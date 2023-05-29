'use strict';

class Notify {
  static success(content, data = {}) {
    return this.response({
      ...data,
      type: 'success',
      text: content,
    });
  }

  static info(content, data = {}) {
    return this.response({
      ...data,
      type: 'info',
      text: content,
    });
  }

  static warning(content, data = {}) {
    return this.response({
      ...data,
      type: 'warning',
      text: content,
    });
  }

  static error(content, data = {}) {
    return this.response({
      ...data,
      type: 'error',
      text: content,
    });
  }

  static response(data) {
    return { notification: data };
  }
}

module.exports = Notify;
