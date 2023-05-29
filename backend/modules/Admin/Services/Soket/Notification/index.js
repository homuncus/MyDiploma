'use strict';

const Server = use('Server');
const io = use('socket.io')(Server.getInstance());

class Notification {
  static message(message) {
    io.emit('message', message);
  }
}

module.exports = Notification;
