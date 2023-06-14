'use strict'

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

  async isBlocked() {
    if (this.blocked) throw 'USER_BLOCKED';
  }

  role() {
    return this.belongsTo('Users/Models/Role');
  }

  friends() {
    return this.belongsToMany('Users/Models/User')
      .pivotModel('Users/Models/UserConnection')
      .withPivot('accepted');
  }

  productions() {
    return {
      whereChief: () => this.hasMany('Productions/Models/Production'),
      whereMember: () => this.belongsToMany('Productions/Models/Production')
        .pivotTable('user_productions')
    };
  }

  workshops() {
    return this.belongsToMany('Workshops/Models/Workshop')
      .pivotModel('Workshops/Models/UserWorkshop');
  }

  messagesSent() {
    return this.hasMany('Reports/Models/Message', 'id', 'sender_id');
  }

  messagesReceived() {
    return this.hasMany('Reports/Models/Message', 'id', 'receiver_id');
  }

  async messagesWith(userId) {
    const messagesAsSender = await this.messagesSent().where('receiever_id', userId).fetch();
    const messagesAsReceiver = await this.messagesReceived().where('sender_id', userId).fetch();

    return [...messagesAsSender, ...messagesAsReceiver];
  }
}

module.exports = User;
