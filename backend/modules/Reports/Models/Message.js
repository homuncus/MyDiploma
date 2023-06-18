'use strict'

const Model = use('Model');

class Message extends Model {
  static get table() {
    return 'messages';
  }

  sender() {
    return this.belongsTo('Users/Models/User', 'id', 'sender_id');
  }

  receiver() {
    return this.belongsTo('Users/Models/User', 'id', 'receiever_id');
  }

  interlocutor() {
    console.log(this.$parent);
    return this.sender_id === this.$parent.id ? this.receiver() : this.sender();
  }

  lastMessage() {
    return this.belongsTo('Reports/Models/Message', 'id', 'id');
  }
}

module.exports = Message;
