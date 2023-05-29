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
    this.app.singleton('ADM/TableBuilder', () => this.app.use('./index'));
  }
}

module.exports = Provider;
