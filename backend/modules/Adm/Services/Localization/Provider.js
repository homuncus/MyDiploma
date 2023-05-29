/* eslint-disable no-underscore-dangle */

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
    this.app.singleton('ADM/Localization/Lang', () => this.app.use('./index'));
  }

  /**
   * On boot, boot the default loader
   *
   * @method boot
   *
   * @return {void}
   */
  async boot() {
    const HttpContext = use('Adonis/Src/HttpContext');
    const Localization = use('ADM/Localization/Lang');

    HttpContext.getter('__', function () {
      return (...args) => Localization.__.apply(null, [this.antl, ...args]);
    }, true);
  }
}
module.exports = Provider;
