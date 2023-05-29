'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Permission extends Model {
  static get table() {
    return 'admin_permissions';
  }

  static get traits() {
    return [
      '@provider:Adonis/Acl/HasRole',
    ];
  }
}

module.exports = Permission;
