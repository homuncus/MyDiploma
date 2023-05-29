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
    this.app.bind('ADM/Notify', () => this.app.use('./index'));
  }
}

module.exports = Provider;
