'use strict';

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

const AdminRole = use('Adm/Models/AdminRole');

class AdminUser extends Model {
  static boot() {
    super.boot();
    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (user) => {
      if (user.dirty.password) {
        Object.assign(user, { password: await Hash.make(user.password) });
      }
    });
  }

  static get hidden() {
    return ['deleted_at', 'password'];
  }

  roles() {
    return this.belongsToMany('Adm/Models/AdminRole').pivotTable('admin_role_user');
  }

  permissions() {
    return this.belongsToMany('Adm/Models/AdminPermission').pivotTable('admin_permission_user');
  }

  /**
   * Before check add $sideLoaded.rolesSlugs
   * @param {*} expression
   */
  managerIs(expression) {
    const roles = this.$sideLoaded.rolesSlugs || [];

    return this.buildRule(expression, roles);
  }

  /**
   * Before check add $sideLoaded.permissionsSlugs
   * @param {*} expression
   */
  managerCan(expression) {
    const permissions = this.$sideLoaded.permissionsSlugs || [];

    return this.buildRule(expression, permissions);
  }

  buildRule(expression, keysForCheck) {
    const ingoreTag = ['(', '&&', '||', ')', '', ' ', 'process'];

    // prepare rule and keys
    const rule = expression.replace(/ or /g, ' || ')
      .replace(/ and /g, ' && ')
      .replace(/ OR /g, ' || ')
      .replace(/ AND /g, ' && ')
      .replace(/\(/g, '( ')
      .replace(/\)/g, ' )');
    const keys = rule.split(' ');

    const result = keys.map((key) => {
      if (!ingoreTag.includes(key)) {
        return keysForCheck.includes(key);
      }
      return key;
    });

    const prepereResult = result.join(', ').replace(/,/g, '');

    // eslint-disable-next-line no-eval
    return eval(prepereResult);
  }

  async getRolesSlugs() {
    let roles = this.getRelated('roles') || {};

    // Check if related loaded befor if no get new
    if (Object.keys(roles).length === 0) {
      roles = await this.roles().fetch();
    }

    return roles.rows.map(({ slug }) => slug);
  }

  /**
   * Get auth permissions slug array.
   */
  async getPermissionsSlugs() {
    let permissions = this.getRelated('permissions') || {};

    // Check if related loaded befor if no get new
    if (Object.keys(permissions).length === 0) {
      permissions = await this.permissions().fetch();
    }

    permissions = permissions.rows.map(({ slug }) => slug);

    // Get admin_permissions_role
    if (typeof this.roles === 'function') {
      let roles = this.getRelated('roles') || {};

      // Check if related loaded befor if no get new
      if (Object.keys(roles).length === 0) {
        roles = await this.roles().fetch();
      }

      let rolesPermissions = [];

      for (const role of roles.rows) {
        // eslint-disable-next-line no-await-in-loop
        const rolePermissionsSlugs = await role.getPermissionsSlugs();
        rolesPermissions = rolesPermissions.concat(rolePermissionsSlugs);
      }
      permissions = [...new Set(permissions.concat(rolesPermissions))];
    }

    return permissions;
  }

  // async isAdminPanelAccess() {
  //   const slugsRoles = await this.getRolesSlugs('roles') || [];
  //   const check = slugsRoles.filter((role) => [AdminRole.admin, AdminRole.manager].includes(role));
  //   if (!check.length) throw 'USER_ROLES_NOT_PASSED';
  // }

  async isBlocked() {
    if (this.blocked) throw 'USER_BLOCKED';
  }
}

module.exports = AdminUser;
