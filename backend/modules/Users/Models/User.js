'use strict'

const Model = use('Model');
const Database = use('Database')

class User extends Model {
  static get table() {
    return 'users';
  }

  static boot() {
    super.boot();
    this.addHook('beforeSave', 'UserHook.hashPassword');
  }

  static get hidden() {
    return ['al_token', 'password'];
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

  friendRequests() {
    return this.belongsToMany('Users/Models/User', 'friend_id')
      .pivotModel('Users/Models/UserConnection')
      // .wherePivot('accepted', false);
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
    const currentUser = this.id;

    const messages = await Database.raw(`
    SELECT
      m.id,
      m.message,
      m.created_at,
      u.username AS sender_username,
      CASE
        WHEN m.sender_id = ${currentUser} THEN 'sent'
        ELSE 'received'
      END AS direction
    FROM
      messages m
    INNER JOIN
      users u ON u.id = m.sender_id
    WHERE
      (m.sender_id = ${currentUser} AND m.receiver_id = ${userId})
      OR (m.sender_id = ${userId} AND m.receiver_id = ${currentUser})
    ORDER BY
      m.created_at ASC;
  `);

    return messages.rows;
  }

  async conversations() {
    const userId = this.id;

    const conversations = await Database.raw(`
      SELECT
        u.id,
        u.username,
        m.message AS last_message,
        m.created_at AS last_message_date
      FROM
        users u
      INNER JOIN
        messages m ON (u.id = m.sender_id OR u.id = m.receiver_id)
      WHERE
        (m.sender_id = ${userId} OR m.receiver_id = ${userId})
        AND m.id IN (
          SELECT
            MAX(id)
          FROM
            messages
          WHERE
            sender_id = ${userId} OR receiver_id = ${userId}
          GROUP BY
            CASE
              WHEN sender_id = ${userId} THEN receiver_id
              WHEN receiver_id = ${userId} THEN sender_id
            END
        )
        AND u.id <> ${userId}
      ORDER BY
        last_message_date DESC;
    `);

    return conversations.rows;
  }
}

module.exports = User;
