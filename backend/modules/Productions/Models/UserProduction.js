'use strict'

const Model = use('Model');

class UserProduction extends Model {
  static get table() {
    return 'user_productions';
  }
}

module.exports = UserProduction;