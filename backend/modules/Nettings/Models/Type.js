'use strict'

const Model = use('Model');

class Type extends Model {
  static boot() {
    super.boot();

    this.addHook('beforeSave', 'Slugify.Slugify');
  }

  static get table() {
    return 'netting_types';
  }

  nettings() {
    return this.hasMany('Nettings/Models/Netting');
  }
}

module.exports = Type;
