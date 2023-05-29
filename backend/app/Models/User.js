'use strict';

const Model = use('Model');

class User extends Model {
  static get table() {
    return 'users';
  }

  static boot() {
    super.boot();
    this.addHook('beforeSave', 'UserHook.hashPassword');
  }

  static get hidden() {
    return ['al_token'];
  }

  tokens() {
    return this.hasMany('App/Models/Token');
  }

  jwtRefreshTokens() {
    return this.hasMany('App/Models/Token').where('type', 'jwt_refresh_token');
  }
}

module.exports = User;
