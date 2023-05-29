/* eslint-disable no-await-in-loop */

'use strict';

const Config = use('Config');

const fs = require('fs');
const path = require('path');

const { Command } = require('@adonisjs/ace');

class PermissionSync extends Command {
  static get signature() {
    return 'adm:init';
  }

  static get description() {
    return 'Init adm';
  }

  async handle() {
    const { adminUserMigrations, adminUserSeeds } = Config.get('admin.general');

    adminUserMigrations.forEach((file) => PermissionSync.moveDatabaseDir('adminUser/migrations', 'migrations', file, this));
    adminUserSeeds.forEach((file) => PermissionSync.moveDatabaseDir('adminUser/seeds', 'seeds', file, this));
  }

  static moveDatabaseDir(fromDir, toDir, file, self) {
    const fromDri = PermissionSync.fromDatabaseDri(fromDir, file);
    const toDri = PermissionSync.toDatabaseDri(toDir, file);

    if (fs.existsSync(fromDri)) {
      self.completed('create', `${toDir}/${file}`);
      fs.createReadStream(fromDri).pipe(fs.createWriteStream(toDri));
    } else {
      self.failed('create', `${toDir}/${file}`);
    }
  }

  static fromDatabaseDri(folder, file) {
    return path.join(__dirname, `../database/${folder}`, file);
  }

  static toDatabaseDri(folder, file) {
    return path.resolve(__dirname, `../../../database/${folder}`, file);
  }
}

module.exports = PermissionSync;
