'use strict'

const Model = use('Model');

class Role extends Model {
  static get table() {
    return 'roles';
  }
}

module.exports = Role;
