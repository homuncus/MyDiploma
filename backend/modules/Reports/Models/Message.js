'use strict'

const Model = use('Model');

class Message extends Model {
  static get table() {
    return 'messages';
  }
}

module.exports = Message;
