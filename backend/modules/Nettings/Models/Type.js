'use strict'

const Model = use('Model');

class Type extends Model {
  static get table() {
    return 'netting_types';
  }

  nettings() {
    return this.hasMany('Nettings/Models/Netting');
  }
}

module.exports = Type;
