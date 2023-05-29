'use strict';

const { exec } = require('child_process');
const pluralize = require('pluralize');
const fs = require('fs');
const path = require('path');

const ace = use('@adonisjs/ace');
const { Command } = use('@adonisjs/ace');
const Database = use('Database');
const Config = use('Config');

const modulesPath = path.resolve('modules')
const sourcePath = path.resolve(modulesPath, 'Adm/generator/files');
const tmpPath = path.resolve(sourcePath, 'file.tmp');

class PermissionSync extends Command {
  static get signature() {
    return 'module:generate';
  }

  static get description() {
    return 'Generate HMVC module';
  }

  async handle(args, options) {
    const locales = Config.get('admin.general.locales');
    
    const type = await this.choice('Type', ['module', 'sub-module'], 'module');

    let mainModule = null;
    if (type === 'sub-module') {
      const modulesFolder = path.resolve(__dirname, '../../');
      const modules = fs.readdirSync(modulesFolder, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      mainModule = await this.choice('Select main module', modules);
    }

    const name = await this.ask('Module name (singular)?');

    const namePlural = pluralize.plural(name);
    const nameSingular = pluralize.singular(name);

    const NAMES = {
      US_NAME: nameSingular.charAt(0).toUpperCase() + nameSingular.slice(1),
      LS_NAME: nameSingular.charAt(0).toLowerCase() + nameSingular.slice(1),
      UP_NAME: namePlural.charAt(0).toUpperCase() + namePlural.slice(1),
      LP_NAME: namePlural.charAt(0).toLowerCase() + namePlural.slice(1),
    };

    NAMES.MODULE = type === 'module' ? NAMES.UP_NAME : mainModule;
    NAMES.L_MODULE = NAMES.MODULE.toLowerCase();

    const tables = await Database.raw(`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name ASC`);
    const excludes = [
      'permission_role',
      'permission_user',
      'permissions',
      'tokens',
      'adonis_schema'
    ];

    const list = tables.rows.map(t => t.table_name).filter(t => excludes.indexOf(t) === -1);
    const table = await this.choice('Which of tables to use', list, list[0]);

    NAMES.TABLE = table;

    const columnsDB = await Database.raw(`SELECT * FROM information_schema.columns WHERE table_name = '${table}'`);
    const columns = columnsDB.rows.map(c => c.column_name);
    const types = {};

    columnsDB.rows.forEach((c) => {
      types[c.column_name] = c.data_type;
    });


    let choiceToOrderTable = await this.multiple('Which of field show in table list', columns.filter(c => c !== 'id'));
    const choiceToOrderTableLength = choiceToOrderTable.length;
    const showingTable = [];
    for (let i = 0; i < choiceToOrderTableLength; i += 1) {
      const nextOrder = await this.choice(`Ordering next: `, choiceToOrderTable, choiceToOrderTable[0]);
      if (!nextOrder) {
        i -= 1;
        console.log('ARE YOU SURE!! undefined field!!!!')
        continue;
      }
      showingTable.push(nextOrder)
      choiceToOrderTable = choiceToOrderTable.filter(c => c !== nextOrder);
    }

    let choiceToOrderEditable = await this.multiple('Which of field should be editable', columns.filter(c => ['created_at', 'updated_at', 'id'].indexOf(c) === -1), columns);
    const choiceToOrderEditableLength = choiceToOrderEditable.length;
    const editableAnswers = [];
    for (let i = 0; i < choiceToOrderEditableLength; i += 1) {
      const nextOrder = await this.choice(`Ordering next: `, choiceToOrderEditable, choiceToOrderEditable[0]);
      if (!nextOrder) {
        i -= 1;
        console.log('ARE YOU SURE!! undefined field!!!!')
        continue;
      }
      editableAnswers.push(nextOrder)
      choiceToOrderEditable = choiceToOrderEditable.filter(c => c !== nextOrder);
    }

    const editable = {};

    for (let key in editableAnswers) {
      editable[editableAnswers[key]] = await this.choice(`Which type of field should be for: ${editableAnswers[key]}`, [
        'text',
        'textarea',
        'select',
        'checkbox',
        'switch',
        'radio',
        'editor',
        'file',
        'filemanager',
        'tag'
      ], 'text');
    }

    const modulePath = `${modulesPath}/${NAMES.MODULE}`;

    mkDir(modulePath);
    mkDir(`${modulePath}/Configs/admin`);
    mkDir(`${modulePath}/Controllers`);
    mkDir(`${modulePath}/database/migrations`);
    mkDir(`${modulePath}/Middleware`);
    mkDir(`${modulePath}/Models`);
    mkDir(`${modulePath}/resources/views`);
    mkDir(`${modulePath}/resources/modules`);

    locales.forEach((locale) => {
      mkDir(`${modulePath}/resources/locales/${locale.slug}`);
    });

    // mkDir(`${modulePath}/resources/locales/en`);
    // mkDir(`${modulePath}/resources/locales/ru`);
    // mkDir(`${modulePath}/resources/locales/ua`);


    /*
     * Controller
     */
    if (!fs.existsSync(`${modulePath}/Controllers/${NAMES.UP_NAME}Controller.js`)) {
      await createTemp('Controller.js', NAMES);
      for (let i = 0; i < showingTable.length; i += 1) {
        await shell(`sed -i -e "/__('Adm.admin.actions')/i\ \t { title: __('${NAMES.MODULE}.${NAMES.LP_NAME}.${showingTable[i]}'), width: '' }," ${tmpPath}`);
      }

      const fields = showingTable.map(f => `'${NAMES.TABLE}.${f}'`).join(', ');
      await shell(`sed -i "s/__FIELDS__/${fields}/g" ${tmpPath}`);

      for (const key in editable) {
        let proc = '';
        switch (types[key]) {
          case 'boolean':
            proc = `!!input.${key}`;
            break;
          case 'integer':
            proc = `Number(input.${key}) ? Number(input.${key}) : null`;
            break;
          case 'decimal':
            proc = `Number(input.${key}) ? Number(input.${key}) : null`;
            break;
          default:
            proc = `input.${key}`
            break;
        }
        await shell(`sed -i "/.save();/i \       ${NAMES.LS_NAME}.${key} = ${proc};" ${tmpPath}`);
      }
      await shell(`cp ${tmpPath} ${modulePath}/Controllers/${NAMES.UP_NAME}Controller.js`);
    }


    /**
     *  Models
     */
    if (!fs.existsSync(`${modulePath}/Models/${NAMES.US_NAME}.js`)) {
      await createTemp('Model.js', NAMES);
      await shell(`cp ${tmpPath} ${modulePath}/Models/${NAMES.US_NAME}.js`);
    } else {
      console.log(`ERROR: Model ${modulePath}/Models/${NAMES.US_NAME}.js already exist`);
    }


    /**
     *  locales
     */
    if (!fs.existsSync(`${modulePath}/resources/locales/en/${NAMES.LP_NAME}.json`)) {
      await createTemp('localization.json', NAMES);
      for (const key in editable) {
        await shell(`sed -i '/"dummy": "dummy"/i \     "${key}": "${key}",' ${tmpPath}`);
      }
      const loc = locales.map(async (locale) => {
        await shell(`cp ${tmpPath} ${modulePath}/resources/locales/${locale.slug}/${NAMES.LP_NAME}.json`);
      });
      await Promise.all(loc);
    } else {
      console.log(`ERROR: Localization ${modulePath}/resources/locales/en/${NAMES.LP_NAME}.json already exist`);
    }


    /** ADM models
     *
     */
    if (!fs.existsSync(`${modulePath}/resources/modules/${NAMES.UP_NAME}.js`)) {
      await createTemp('adm.js', NAMES);
      for (let i = 0; i < showingTable.length; i += 1) {
        const field = ([...showingTable].reverse())[i];
        await shell(`sed -i -e "/{ data: 'id', name: '${NAMES.LP_NAME}.id' }/a\ \t { data: '${field}', name: '${NAMES.LP_NAME}.${field}', orderable: true, searchable: true }," ${tmpPath}`);
      }
      await shell(`cp ${tmpPath} ${modulePath}/resources/modules/${NAMES.UP_NAME}.js`);
    } else {
      console.log(`ERROR: ADM ${modulePath}/resources/modules/${NAMES.UP_NAME}.js already exist`);
    }

    /** Views
     *
     */
    if (!fs.existsSync(`${modulePath}/resources/views/${NAMES.LP_NAME}`)) {
      await mkDir(`${modulePath}/resources/views/${NAMES.LP_NAME}`);

      await createTemp('view_index.edge', NAMES);
      await shell(`cp ${tmpPath} ${modulePath}/resources/views/${NAMES.LP_NAME}/index.edge`);

      await createTemp('view_form.edge', NAMES);

      let fields = [];
      for (const key in editable) {
        fields.push(input(editable[key], key, NAMES));
      }
      fields = fields.join('\n').split(/\r?\n/);

      for (let i = 0; i < fields.length; i += 1) {
        let line = fields[i].trim() === '' ? '\n' : fields[i];
        line = line.split('"').join('\\"');
        await shell(`sed -i "/<!--FIELDS-->/i \\ ${line}" ${tmpPath}`);
      }
      await shell(`sed -i "s/<!--FIELDS-->/ /g" ${tmpPath}`);
      await shell(`cp ${tmpPath} ${modulePath}/resources/views/${NAMES.LP_NAME}/form.edge`);
    } else {
      console.log(`ERROR: Views already exist`);
    }


    /**
     *  Routes
     */
    if (!fs.existsSync(`${modulePath}/routes.js`)) {
      await shell(`cp ${sourcePath}/routes.js ${modulePath}/routes.js`);
    }
    await createTemp('route.js', NAMES);
    let routes = await shell(`cat ${tmpPath}`);
    routes = routes.split(/\r?\n/);
    for (let i = 0; i < routes.length; i += 1) {
      const line = routes[i].trim() === '' ? '\n' : routes[i];
      await shell(`sed -i "/^}).prefix('admin').*/i \\ ${line}" ${modulePath}/routes.js`)
    }


    /**
     * Menu
     */
    let menu = '';

    if (type === 'sub-module') {
      const existedMenu = require(`${modulePath}/Configs/admin/menu.js`);

      if (existedMenu[0].children && existedMenu[0].children.length) {
        await createTemp('menu-child.js', NAMES);
        const item = require(tmpPath);
        existedMenu[0].children.push(item);
        existedMenu[0].permissions.push(NAMES.LP_NAME);
        menu = existedMenu;
      } else {
        await createTemp('menu-child.js', NAMES);
        const item = requireUncached(tmpPath);

        await createTemp('menu-wrapper.js', NAMES);
        const parent = requireUncached(tmpPath);

        existedMenu.forEach((m) => {
          parent.permissions = [...parent.permissions, ...m.permissions];
          // parent.children.push(m);
        });

        parent.children.push(item);
        //parent.permissions = [...parent.permissions, ...item.permissions];
        menu = [parent];
      }
    } else {
      await createTemp('menu-item.js', NAMES);
      menu = [requireUncached(tmpPath)];
    }

    fs.writeFileSync(`${modulePath}/Configs/admin/menu.js`, `module.exports = ${JSON.stringify(menu, null, 2)}`);


    /**
     * Permissions
     */
    if (!fs.existsSync(`${modulePath}/Configs/admin/permissions.js`)) {
      await shell(`cp ${sourcePath}/permission-wrapper.js ${modulePath}/Configs/admin/permissions.js`);
    }
    await patch(`${sourcePath}/permission-items.js`, '^};.*', `${modulePath}/Configs/admin/permissions.js`, NAMES);


    // await ace.call('module:sync', {}, {});

    console.info('Run command: node ace module:sync');
    Database.close();
    return true;

    // Patch Routes.js
    // let routes = await shell(`cat source/module_example/route.js`);
    // routes = routes.split('__LS_NAME__').join(NAMES.LS_NAME);
    // routes = routes.split('__US_NAME__').join(NAMES.US_NAME);
    // routes = routes.split('__UP_NAME__').join(NAMES.UP_NAME);
    // routes = routes.split('__LP_NAME__').join(NAMES.LP_NAME);
    // routes = routes.split(/\r?\n/);
    // for (let i = 0; i < routes.length; i += 1) {
    //   const line = routes[i].trim() === '' ? '\n' : routes[i];
    //   await shell(`sed -i "/^}).prefix('admin').*/i \\ ${line}" start/routes.js`)
    // }


    // // Patch permissions
    // await patch('permission.txt', '^}.*', 'config/admin/Permissions.js', NAMES);


    // // Patch menu
    // await patch('menu.txt', '^.*GENERATOR.*', 'config/admin/menu.js', NAMES);


    // Controller
    // await createTemp('Controller.js', NAMES);
    // for (let i = 0; i < showingTable.length; i += 1) {
    //   await shell(`sed -i -e "/__('admin.actions')/i\ \t { title: __('cms.${NAMES.LP_NAME}.${showingTable[i]}'), width: '' }," source/module_example/tmp.tmp`);
    // }

    // const fields = showingTable.map(f => `'${NAMES.LP_NAME}.${f}'`).join(', ');
    // await shell(`sed -i "s/__FIELDS__/${fields}/g" source/module_example/tmp.tmp`);


    // for (const key in editable) {
    //   let proc = '';
    //   switch (types[key]) {
    //     case 'boolean':
    //       proc = `!!input.${key}`;
    //       break;
    //     case 'integer':
    //       proc = `Number(input.${key})`;
    //       break;
    //     default:
    //       proc = `input.${key}`
    //       break;
    //   }
    //   await shell(`sed -i "/.save();/i \       ${NAMES.LS_NAME}.${key} = ${proc};" source/module_example/tmp.tmp`);
    // }
    // await shell(`cp source/module_example/tmp.tmp app/Controllers/Http/backend/${NAMES.UP_NAME}Controller.js`);


    // // Model
    // if (!fs.existsSync(`app/Models/${NAMES.US_NAME}.js`)) {
    //   await createTemp('Model.js', NAMES);
    //   await shell(`cp source/module_example/tmp.tmp app/Models/${NAMES.US_NAME}.js`);
    // } else {
    //   console.log(`ERROR: Model app/Models/${NAMES.US_NAME}.js already exist`);
    // }

    // Localisation
    // if (!fs.existsSync(`resources/locales/en/cms/${NAMES.LP_NAME}.json`)) {
    //   await createTemp('localization.json', NAMES);

    //   for (const key in editable) {
    //     await shell(`sed -i '/"dummy": "dummy"/i \     "${key}": "${key}",' source/module_example/tmp.tmp`);
    //   }

    //   await shell(`cp source/module_example/tmp.tmp resources/locales/en/cms/${NAMES.LP_NAME}.json`);
    // } else {
    //   console.log(`ERROR: Localization resources/locales/en/cms/${NAMES.LP_NAME}.json already exist`);
    // }

    // ADM module
    // if (!fs.existsSync(`resources/locales/en/cms/${NAME}.json`)) {
    //   await createTemp('localization.json', NAME, UNAME);
    //   await shell(`cp source/module_example/tmp.tmp resources/locales/en/cms/${NAME}.json`);
    // } else {
    //   console.log(`ERROR: Localization resources/locales/en/cms/${NAME}.json already exist`);
    // }


    // ADM models
    // if (!fs.existsSync(`source/admin/modules/${NAMES.UP_NAME}.js`)) {
    //   await createTemp('adm.js', NAMES);
    //   for (let i = 0; i < showingTable.length; i += 1) {
    //     await shell(`sed -i -e "/{ data: 'id', name: '${NAMES.LP_NAME}.id' }/a\ \t { data: '${showingTable[i]}', name: '${NAMES.LP_NAME}.${showingTable[i]}', orderable: true, searchable: true }," source/module_example/tmp.tmp`);
    //   }
    //   await shell(`cp source/module_example/tmp.tmp source/admin/modules/${NAMES.UP_NAME}.js`);
    // } else {
    //   console.log(`ERROR: ADM source/admin/module/${NAMES.UP_NAME}.js already exist`);
    // }

    // Views
    // if (!fs.existsSync(`resources/views/backend/${NAMES.LP_NAME}`)) {
    //   await mkDir(`resources/views/backend/${NAMES.LP_NAME}`);

    //   await createTemp('view_index.edge', NAMES);
    //   await shell(`cp source/module_example/tmp.tmp resources/views/backend/${NAMES.LP_NAME}/index.edge`);

    //   await createTemp('view_form.edge', NAMES);

    //   let fields = [];
    //   for (const key in editable) {
    //     fields.push(input(editable[key], key, NAMES));
    //   }
    //   fields = fields.join('\n').split(/\r?\n/);

    //   for (let i = 0; i < fields.length; i += 1) {
    //     let line = fields[i].trim() === '' ? '\n' : fields[i];
    //     line = line.split('"').join('\\"');
    //     await shell(`sed -i "/<!--FIELDS-->/i \\ ${line}" source/module_example/tmp.tmp`);
    //   }
    //   await shell(`sed -i "s/<!--FIELDS-->/ /g" source/module_example/tmp.tmp`);
    //   await shell(`cp source/module_example/tmp.tmp resources/views/backend/${NAMES.LP_NAME}/form.edge`);
    // } else {
    //   console.log(`ERROR: Views already exist`);
    // }

    Database.close();
    return true;
  }
}

async function mkDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function createTemp(template, data) {
  await shell(`cp ${path.resolve(sourcePath, template)} ${tmpPath}`);
  for (let key in data) {
    await shell(`sed -i 's/__${key}__/${data[key]}/g' ${tmpPath}`);
  }
}


function requireUncached(module) {
  delete require.cache[require.resolve(module)]
  return require(module)
}


async function patch(template, pattern, target, data) {
  await createTemp(template, data);
  await shell(`sed -i "/${pattern}/{e cat ${tmpPath}\n}" ${target}`);
}

async function shell(command) {
  return new Promise((resolve) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }
      resolve(stdout);
    });
  });
}


function input(type, name, NAMES) {
  switch (type) {
    case 'switch':
      return `
        <div class="form-group form-group-sm row">
          <label class="col-xl-3 col-lg-3 col-form-label">{{__('${NAMES.MODULE}.${NAMES.LP_NAME}.${name}')}}</label>
          <div class="col-lg-9 col-xl-9">
            <span class="switch">
              <label>
                <input type="checkbox" {{ data.${name} ? 'checked' : ''}} name="${name}" value="1">
                <span></span>
              </label>
            </span>
          </div>
        </div>`;
      break;

    case 'checkbox':
      return `
        <div class="form-group form-group-sm row">
          <label class="col-xl-3 col-lg-3 col-form-label">{{__('${NAMES.MODULE}.${NAMES.LP_NAME}.${name}')}}</label>
          <div class="col-lg-9 col-xl-9">
            <div class="checkbox-list">
              @each(option in [{title:'one', value: 1}, {title:'two', value: 2}, {title:'three', value: 3}])
                <label class="checkbox">
                  <input type="checkbox" name="${name}[]" value="{{ option.value }}" {{[2,3].indexOf(option.value) > -1 ? 'checked' : ''}}>
                  <span></span>
                  {{option.title}}
                </label>
              @endeach
            </div>
          </div>
        </div>`;
      break;

    case 'tag':
      return `
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label">{{__('${NAMES.MODULE}.${NAMES.LP_NAME}.${name}')}}</label>
          <div class="col-lg-9 col-xl-9 typeahead">
            <input class="form-control tag" id="${name}" name="${name}" type="text" value="{{fields.tags || ''}}">
          </div>
        </div>`;
      break;

    case 'select':
      return `
        <div class="form-group row">
          <label class="col-form-label col-lg-3 col-sm-12">{{__('${NAMES.MODULE}.${NAMES.LP_NAME}.${name}')}}</label>
          <div class="col-lg-9 col-md-9 col-sm-12">
            <select class="form-control form-control-solid" id="${name}" name="${name}">
              @each(option in [{title:'one', value: 1}, {title:'two', value: 2}, {title:'three', value: 3}])
                <option value="{{ option.value }}" {{option.value == 2 ? 'selected' : ''}}>{{option.title}}</option>
              @endeach
            </select>
          </div>
        </div>`;
      break;

    case 'radio':
      return `
        <div class="form-group row">
            <label class="col-xl-3 col-lg-3 col-form-label">{{__('${NAMES.MODULE}.${NAMES.LP_NAME}.${name}')}}</label>
            <div class="col-lg-9 col-xl-9">
              <div class="radio-list">
                @each(option in [{title:'one', value: 1}, {title:'two', value: 2}, {title:'three', value: 3}])
                  <label class="radio">
                    <input type="radio" name="${name}" value="{{ option.value }}" {{[2].indexOf(option.value) > -1 ? 'checked' : ''}}>
                    <span></span>
                    {{option.title}}
                  </label>
                @endeach
              </div>
            </div>
        </div>`;
      break;

    case 'file':
      return `
        <div class="form-group row">
            <label class="col-xl-3 col-lg-3 col-form-label">{{__('${NAMES.MODULE}.${NAMES.LP_NAME}.${name}')}}</label>
            <div class="col-lg-9 col-xl-9">
                <input class="form-control form-control-solid" name="${name}" type="file" value="{{ data.${name} || '' }}">
            </div>
        </div>`;
      break;

    case 'filemanager':
      return `
        <div class="form-group row">
            <label class="col-xl-3 col-lg-3 col-form-label">{{__('${NAMES.MODULE}.${NAMES.LP_NAME}.${name}')}}</label>
            <div class="col-lg-9 col-xl-9">
                <input class="form-control form-control-solid filemanager" name="${name}" type="text" value="{{ data.${name} || '' }}">
            </div>
        </div>`;
      break;

    case 'textarea':
    case 'editor':
      return `
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label">{{__('${NAMES.MODULE}.${NAMES.LP_NAME}.${name}')}}</label>
          <div class="col-lg-9 col-xl-9">
              <textarea class="form-control ${type} form-control-solid" name="${name}">{{ data.${name} || '' }}</textarea>
          </div>
        </div>
      `;
      break;

    case 'number':
      return `
        <div class="form-group row">
            <label class="col-xl-3 col-lg-3 col-form-label">{{__('${NAMES.MODULE}.${NAMES.LP_NAME}.${name}')}}</label>
            <div class="col-lg-9 col-xl-9">
                <input class="form-control form-control-solid" name="${name}" type="number" value="{{ data.${name} || '' }}">
            </div>
        </div>`;
      break;

    case 'text':
    default:
      return `
        <div class="form-group row">
          <label class="col-xl-3 col-lg-3 col-form-label">{{__('${NAMES.MODULE}.${NAMES.LP_NAME}.${name}')}}</label>
          <div class="col-lg-9 col-xl-9">
            <input class="form-control form-control-solid" name="${name}" type="text" value="{{ data.${name} || '' }}">
          </div>
        </div>`;
      break;
  }
}

module.exports = PermissionSync;
