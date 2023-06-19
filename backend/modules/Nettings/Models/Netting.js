'use strict'

const Model = use('Model');

class Netting extends Model {
  static get table() {
    return 'nettings';
  }

  type() {
    return this.belongsTo('Nettings/Models/Type')
      .select('netting_types.id', 'netting_types.name', 'netting_types.slug');
  }
}

module.exports = Netting;
