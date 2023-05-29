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
    const View = this.app.use('View');
    const Loader = this.app.use('./index');

    Object.assign(View.engine, { _loader: new Loader(View.engine._loader._viewsPath, View.engine._loader._presentersPath) });

    this.app.bind('ADM/Loader', () => ({
      addPath: (path, scope) => View.engine._loader.addViewsPath(path, scope),
    }));
  }
}

module.exports = Provider;
