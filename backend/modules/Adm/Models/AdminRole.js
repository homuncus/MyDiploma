'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class AdminRole extends Model {
  static get admin() {
    return 'admin';
  }

  static get manager() {
    return 'manager';
  }

  users() {
    return this.belongsToMany('Adm/Models/AdminUser').pivotTable('admin_role_user');
  }

  permissions() {
    return this.belongsToMany('Adm/Models/AdminPermission').pivotTable('admin_permission_role');
  }

  async getPermissionsSlugs() {
    let rolePermissions = this.getRelated('permissions') || {};

    // Check if related loaded befor if no get new
    if (Object.keys(rolePermissions).length === 0) {
      rolePermissions = await this.permissions().fetch();
    }

    return rolePermissions.rows.map(({ slug }) => slug);
  }
}

module.exports = AdminRole;
