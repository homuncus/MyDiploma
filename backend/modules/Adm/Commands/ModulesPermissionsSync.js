/* eslint-disable no-await-in-loop */

'use strict';

const Env = use('Env');
const Config = use('Config');
const Database = use('Database');

const { Command } = require('@adonisjs/ace');

const AdminUser = use('Adm/Models/AdminUser');
const AdminPermission = use('Adm/Models/AdminPermission');

class PermissionSync extends Command {
  static get signature() {
    return 'module:sync';
  }

  static get description() {
    return 'Sync permissions from modules';
  }

  async handle() {
    const existedPermissions = await AdminPermission.pair('slug', 'name');

    // eslint-disable-next-line prefer-spread
    const allConfigPermissions = [].concat.apply([], Object.entries(Config.get('admin.permissions')).map((g) => g[1]));

    // Incerset or Update slugs
    for (const permission of allConfigPermissions) {
      const { slug, name } = permission;
      this.info(slug);
      if (Object.prototype.hasOwnProperty.call(existedPermissions, slug)) {
        await AdminPermission.query().where('slug', slug).update({ slug, name });
      } else {
        await AdminPermission.create({ slug, name });
      }
    }

    // Delete not existed slugs
    const onDeleteCount = await AdminPermission.query().whereNotIn('slug', allConfigPermissions.map((p) => p.slug)).delete();
    if (onDeleteCount) this.success(`onDekete (${onDeleteCount}) -> done`);

    // Attach all permissions to admin user & role
    const existedPermissionsReload = await AdminPermission.pair('id', 'slug');
    const existedPermissionsReloadIds = Object.keys(existedPermissionsReload);

    // const adminUser = await AdminUser.findBy({ email: Env.get('ADMIN_EMAIL', 'admin@admin.com') });
    const adminUser = await AdminUser.find(1);

    await adminUser.permissions().detach();
    await adminUser.permissions().attach(existedPermissionsReloadIds);

    // Close DB to stop command execution
    Database.close();
    return true;
  }
}

module.exports = PermissionSync;
