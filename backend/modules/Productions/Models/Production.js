'use strict'

const Model = use('Model');

class Production extends Model {
  static get table() {
    return 'productions';
  }

  chief() {
    return this.belongsTo('Users/Models/User');
  }

  users() {
    return this.belongsToMany('Users/Models/User')
      .pivotModel('Productions/Models/UserProduction');
  }

  material() {
    return this.belongsTo('Materials/Models/Material');
  }

  workshop() {
    return this.belongsTo('Productions/Models/Production');
  }

  netting() {
    return this.belongsTo('Nettings/Models/Netting');
  }
}

module.exports = Production;
