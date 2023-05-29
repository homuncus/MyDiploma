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
    const Adm = this.app.use('./index');

    const modulePath = Adm.getPatah;
    for (const module of Adm.getModules) {
      this.app.autoload(`${modulePath}/${module}`, module);
      Adm.registerViews(modulePath, module);
      Adm.registerLocales(modulePath, module);
    }
  }

  /**
   * On boot, boot the default loader
   *
   * @method boot
   *
   * @return {void}
   */
  async boot() {
    const Adm = this.app.use('./index');
    const modulePath = Adm.getPatah;
    for (const module of Adm.getModules) {
      // Register middlewares
      // if (fs.existsSync(path.resolve(modulePath, 'Middleware'))) {
      //   const commands = fs.readdirSync(path.resolve(modulePath, 'Middleware'));
      //   for (let i = 0; i < commands.length; i += 1) {
      //     const { name, base } = path.parse(commands[i]);

      //     Server.registerNamed({
      //       [`${moduleName}/${name}`]: 'Adonis/Middleware/Validator'
      //     });
      //   }
      // }
      Adm.registerConfigs(modulePath, module);
      Adm.bootRouters(modulePath, module);
      Adm.bootRoutes(modulePath, module);
      Adm.bootListeners(modulePath, module);
      Adm.bootCommands(modulePath, module);
    }
  }
}
module.exports = Provider;
