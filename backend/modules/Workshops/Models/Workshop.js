'use strict'

const Model = use('Model');

class Workshop extends Model {
  static get table() {
    return 'workshops';
  }

  static boot() {
    super.boot();

    this.addHook('beforeSave', 'Slugify.Slugify');
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
