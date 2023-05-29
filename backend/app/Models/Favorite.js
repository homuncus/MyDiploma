'use strict';

const Model = use('Model');

class Favorite extends Model {

  static boot() {
    super.boot();
  }

  static get hidden() {
    return [];
  }
}

module.exports = Favorite;
