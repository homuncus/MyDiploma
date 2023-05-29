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
    this.app.singleton('ADM/Datatables', () => this.app.use('./index'));
  }
}
module.exports = Provider;
