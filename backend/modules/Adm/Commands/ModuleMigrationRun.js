'use strict';

const { Command } = require('@adonisjs/ace');
const requireAll = require('require-all');
const path = require('path');
const fs = require('fs');
const prettyHrTime = require('pretty-hrtime');

class BaseMigration extends Command {
  static get inject() {
    return ['Adonis/Src/Migration', 'Adonis/Src/Helpers']
  }

  constructor(migration, helpers) {
    super()

    this._migrationsPath = helpers.migrationsPath();
    this.migration = migration
  }

  migrationsPath(toFile = '') {
    let pathSet = [this._migrationsPath];
    const modulesFolder = path.resolve(__dirname, '../../');
    const modules = fs.readdirSync(modulesFolder, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    for (let i = 0; i < modules.length; i++) {
      if (modules[i] !== 'Adm') {
        pathSet.push(
          path.join(modulesFolder, `/${modules[i]}/database/migrations`, toFile)
        );
      }
    }
    return pathSet;
  }

  getSchemaFiles() {
    let schemas = {};
    const paths = this.migrationsPath();

    for (let i = 0; i < paths.length; i += 1) {
      if (paths[i] !== undefined) {
        if (fs.existsSync(paths[i])) {
          const moduleSchema = requireAll({
            dirname: paths[i],
            filters: /(.*)\.js$/
          });
          schemas = {
            ...schemas,
            ...moduleSchema
          };
        }
      }
    }

    return schemas;
  }

  sortSchemas(schemas) {
    const sorted = {};
    const a = [];
    for (let key in schemas) {
      if (schemas.hasOwnProperty(key)) {
        a.push(key);
      }
    }

    a.sort();

    for (let i = 0; i < a.length; i += 1) {
      sorted[a[i]] = schemas[a[i]];
    }
    return sorted;
  }

  validateState(force) {
    if (process.env.NODE_ENV === 'production' && !force) {
      throw new Error('Cannot run migrations in production. Use --force flag to continue');
    }
  }

  execIfNot(conditional, fn) {
    if (!conditional) {
      fn();
    }
  }
}


class ModuleMigrationRun extends BaseMigration {
  static get signature() {
    return 'module:migrun';
  }

  static get description() {
    return 'Run module`s migrations';
  }

  async handle(args, { log, force, silent, seed, keepAlive }) {
    try {
      
      this.validateState(force);

      if (keepAlive) {
        this.migration.keepAlive();
      }

      const startTime = process.hrtime();
      const { migrated, status, queries } = await this.migration.up(this.getSchemaFiles(), log);

      /**
       * Tell user that there is nothing to migrate
       */
      if (status === 'skipped') {
        this.execIfNot(silent, () => this.info('Nothing to migrate'));
      }

      /**
       * Log files that been migrated successfully
       */
      if (status === 'completed' && !queries) {
        const endTime = process.hrtime(startTime);
        migrated.forEach((name) => this.execIfNot(silent, () => this.completed('migrate', `${name}.js`)));
        this.success(`Database migrated successfully in ${prettyHrTime(endTime)}`);
      }

      /**
       * If there are queries in the result, just log them
       */
      if (queries) {
        _.each(queries, ({ queries, name }) => {
          this.execIfNot(silent, () => console.log(this.chalk.magenta(`\n Queries for ${name}.js`)));
          _.each(queries, (query) => {
            return this.execIfNot(silent, () => console.log(`  ${query}`));
          });
          console.log('\n');
        });
      }

      /**
       * If seed is passed, seed the DB after migration
       */
      if (seed) {
        await ace.call('seed', {}, {
          keepAlive,
          force
        });
      }

      if (!this.viaAce) {
        return {
          status,
          migrated,
          queries
        };
      }
    } catch (error) {
      console.log(error)
      process.exit(1);
    }
  }
}

module.exports = ModuleMigrationRun;
