'use strict'

const Model = use('Model');

class Message extends Model {
  static get table() {
    return 'messages';
  }

  sender() {
    return this.belongsTo('Users/Models/User', 'id', 'sender_id');
  }

  receiever() {
    return this.belongsTo('Users/Models/User', 'id', 'receiever_id');
  }

  interlocutor() {
    // Assuming the User model is defined in 'App/Models/User'
    return this.belongsTo('Users/Models/User', 'receiver_id', 'id').orWhere('sender_id', this.sender_id);
  }

  lastMessage() {
    return this.belongsTo('Reports/Models/Message', 'id', 'id');
  }
}

module.exports = Message;
