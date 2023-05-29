'use strict'

const Model = use('Model');

class Material extends Model {
  static get table() {
    return 'materials';
  }

  workshop() {
    return this.belongsTo('Workshops/Models/Workshop');
  }
}

module.exports = Material;
