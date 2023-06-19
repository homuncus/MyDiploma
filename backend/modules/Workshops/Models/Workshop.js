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
      .pivotModel('Workshops/Models/UserWorkshop')
      .withPivot(['is_manager', 'created_at']);
  }

  productions() {
    return this.hasMany('Productions/Models/Production');
  }

  nettings() {
    return this.hasMany('Nettings/Models/Netting');
  }

  materials() {
    return this.hasMany('Materials/Models/Material');
  }
}

module.exports = Workshop;
