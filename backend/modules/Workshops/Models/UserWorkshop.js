'use strict'

const Model = use('Model');

class UserWorkshop extends Model {
  static get table() {
    return 'user_workshops';
  }
}

module.exports = UserWorkshop;
