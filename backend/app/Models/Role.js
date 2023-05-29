'use strict';

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Role extends Model {
  static get traits() {
    return [
      '@provider:Adonis/Acl/HasPermission',
    ];
  }
}

module.exports = Role;
