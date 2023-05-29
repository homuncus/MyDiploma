'use strict';

const Route = use('Route');
const Database = use('Database');
const View = use('View');
const Notify = use('ADM/Notify');
const Datatables = use('ADM/Datatables');
const TableBuilder = use('ADM/TableBuilder');

const Role = use('Managers/Models/AdminRole');
const Permission = use('Managers/Models/AdminPermission')

const Config = use('Config');

class RolesController {
  async index({ view, auth, __ }) {
    const table = new TableBuilder('admin_roles');

    table.setName(__('Managers.role.list'));

    if (auth.user.managerCan('admin_roles_create')) {
      table.setButtons([
        [`<a href="${Route.url('admin.role.edit')}" class="no-history pull-right btn btn-success">${__('Adm.admin.create')}</a>`],
      ]);
    }

    table.setColums([
      { title: '#', width: '1%' },
      { title: __('Managers.role.slug'), width: '5%' },
      { title: __('Managers.role.name'), width: '10%' },
      { title: __('Managers.role.description'), width: '' },
      { title: __('Managers.role.created_at'), width: '10%' },
      { title: __('Managers.role.updated_at'), width: '10%' },
      { title: __('Adm.admin.actions'), width: '1%' },
    ]);

    View.global('breadcrumbs', [
      { name: __('Adm.admin.home'), url: Route.url('admin.dashboard.index') },
      { name: __('Managers.role.list'), url: Route.url('admin.role.index') },
    ]);

    return view.render('Managers.role.index', {
      table: table.build(),
    });
  }

  async list({ request, response }) {
    const query = Database.select([`admin_roles.id`, `admin_roles.slug`, `admin_roles.name`, `admin_roles.description`,
      `admin_roles.created_at`, `admin_roles.updated_at`,
    ]).from('admin_roles');

    const table = new Datatables(query, request);
    const res = await table.make();
    return response.json(res);
  }

  async edit({ response, params, __, antl }) {
    const { id } = params;
    let data = await Role.find(id);

    const permissions = await this.getTranslatedPermissions({ antl, __ });

    if (id && !data) {
      return response.json(Notify.error('Not found', {}));
    }

    if (data) {
      const { rows } = await data.permissions().fetch();
      data.role_permissions = rows.map((item) => item.slug);
    }

    return response.json({
      modal: {
        title: id ? __('Managers.role.edit') : __('Managers.role.create'),
        content: View.render('Managers.role.form', { data, permissions }),
        cancel: __('Adm.admin.cancel'),
        submit: __('Adm.admin.save'),
      },
      success: true,
    });
  }

  async save({ request, response }) {
    const input = request.only(['name', 'slug', 'description']);
    const id = request.input('id');
    const permissions = request.input('permissions', []);

    const permission_ids = await this.getInserPermissionsData(permissions);

    let role = {};

    if (!id) {
      role = new Role();
    } else {
      role = await Role.find(id);
      if (!role) {
        return response.json(Notify.error('Role not found', {}));
      }
    }
    
    role.merge(input);
    await role.save();
    
    await role.permissions().detach();
    await role.permissions().attach(permission_ids);

    return response.json(Notify.success('Saved', {}));
  }

  async delete({ response, params }) {
    const { id } = params;
    const role = await Role.find(id);

    if (!role) {
      return response.json(Notify.error('Something went wrong. Role not found', {}));
    }

    if (await role.delete()) {
      return response.json(Notify.success('Deleted', {}));
    }
    return true;
  }

  async getTranslatedPermissions({ antl, __ }) {
    const permissions = Config.get('admin.permissions');
    const translatedPermissions = {};

    for (const key in permissions) {
      if (Object.prototype.hasOwnProperty.call(permissions, key)) {
        const groupPermissions = [];
        permissions[key].forEach((p) => {
          groupPermissions.push({
            ...p,
            name: __(`cms.permissions.${p.slug}`) === `${antl.currentLocale()}.cms.permissions.${p.slug}` ? p.name : __(`cms.permissions.${p.slug}`),
          });
        });
        translatedPermissions[key] = groupPermissions;
      }
    }
    return translatedPermissions;
  }

  async getInserPermissionsData(permissions) {
    if (Array.isArray(permissions) && !permissions.length) {
      return [];
    }

    const allPermissions = await Permission.query().whereIn('slug', permissions).fetch();

    return allPermissions.toJSON().map((item) => item.id);
  }
}

module.exports = RolesController;
