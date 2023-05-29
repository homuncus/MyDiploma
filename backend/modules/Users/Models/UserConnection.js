'use strict'

const Model = use('Model');

class UserConnection extends Model {
  static get table() {
    return 'user_connections';
  }
}

module.exports = UserConnection;
