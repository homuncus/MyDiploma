'use strict'

const Model = use('Model');

class Workshop extends Model {
  static get table() {
    return 'workshops';
  }

  users() {
    return this.belongsToMany('Users/Models/User')
      .pivotModel('Workshops/Models/UserWorkshop');
  }

  productions() {
    return this.hasMany('Productions/Models/Production');
  }
}

module.exports = Workshop;
