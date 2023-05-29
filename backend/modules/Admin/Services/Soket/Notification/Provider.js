'use strict';

const { ServiceProvider } = require('@adonisjs/fold');

class Provider extends ServiceProvider {
  /**
  * Register bindings
  *
  * @method register
  *
  * @return {void}
  */
  register() {
    this.app.bind('Soket/Notification', () => this.app.use('./index.js'));
  }
}

module.exports = Provider;
