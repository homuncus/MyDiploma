'use strict'

const Model = use('Model');

class Netting extends Model {
  static get table() {
    return 'nettings';
  }

  type() {
    return this.belongsTo('Nettings/Models/Type');
  }
}

module.exports = Netting;
