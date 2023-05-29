'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Manager extends Model {
  static get table() {
    return 'admin_users';
  }

  static boot() {
    super.boot();
    this.addHook('beforeSave', 'UserHook.hashPassword');
  }

  roles() {
    return this
      .belongsToMany('Managers/Models/AdminRole', 'admin_user_id', 'admin_role_id', 'id', 'id')
      .pivotTable('admin_role_user')
  }
}

module.exports = Manager;
