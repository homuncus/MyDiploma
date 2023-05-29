/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

'use strict';

const fs = use('fs');
const path = use('path');
const deepmerge = use('deepmerge');
const requireAll = use('require-all');
const ace = use('@adonisjs/ace');
const Config = use('Config');

const Loader = use('ADM/Loader');
const Localization = use('ADM/Localization/Lang');

class Adm {
  constructor() {
    this.setPath();
    this.setModules();
  }

  get getPatah() {
    return this.path;
  }

  get getModules() {
    return this.modules;
  }

  /**
   * Path of modules
   */
  setPath() {
    this.path = path.resolve(__dirname, '../../../');
  }

  /**
   * Autoload -> @provider:Modules/../../..
   */
  setModules() {
    this.modules = fs.readdirSync(this.getPatah, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
  }

  /**
   * Set up Views
   * @param {string} modulePath
   * @param {string} moduleName
   */
  registerViews(modulePath, moduleName) {
    Loader.addPath(path.resolve(modulePath, moduleName, 'resources/views'), moduleName);
  }

  /**
   *Set up Configs
   * @param {string} modulePath
   * @param {string} moduleName
   */
  registerConfigs(modulePath, moduleName) {
    const configsPath = path.resolve(modulePath, moduleName, 'Configs');
    // console.log(configsPath);
    if (fs.existsSync(configsPath)) {
      const moduleMenu = requireAll(configsPath);
      const { _config } = Config;

      Object.assign(Config, { _config: deepmerge(_config, moduleMenu) });
    }
  }

  /**
   * Set up Locales
   * @param {string} modulePath
   * @param {string} moduleName
   */
  registerLocales(modulePath, moduleName) {
    const localesPath = path.resolve(modulePath, moduleName, 'resources/locales');
    if (fs.existsSync(localesPath)) {
      const translations = requireAll({ dirname: localesPath, filters: /(.*)\.json$/ });
      const normalizedTranslation = {};

      for (const lang in translations) {
        if (Object.prototype.hasOwnProperty.call(translations, lang)) {
          normalizedTranslation[lang] = {
            [moduleName]: translations[lang],
          };
        }
      }
      Localization.set(normalizedTranslation);
    }
  }

  /**
   *
   * @param {string} modulePath
   * @param {string} moduleName
   */
  bootRouters(modulePath, moduleName) {
    const routerPath = path.resolve(modulePath, moduleName, 'Router.js');
    if (fs.existsSync(routerPath)) {
      require(routerPath);
    }
  }

  /**
   *
   * @param {string} modulePath
   * @param {string} moduleName
   */
  bootRoutes(modulePath, moduleName) {
    const routePath = path.resolve(modulePath, moduleName, 'routes.js');
    if (fs.existsSync(routePath)) {
      require(routePath);
    }
  }

  /**
   *
   * @param {string} modulePath
   * @param {string} moduleName
   */
  bootListeners(modulePath, moduleName) {
    const listenerPath = path.resolve(modulePath, moduleName, 'Listeners');
    if (fs.existsSync(listenerPath)) {
      requireAll(listenerPath);
    }
  }

  /**
   *
   * @param {string} modulePath
   * @param {string} moduleName
   */
  bootCommands(modulePath, moduleName) {
    const comandsPath = path.resolve(modulePath, moduleName, 'Commands');
    if (fs.existsSync(comandsPath)) {
      const commands = fs.readdirSync(comandsPath);
      for (const command of commands) {
        const { name } = path.parse(command);
        ace.addCommand(`${moduleName}/Commands/${name}`);
      }
    }
  }
}
module.exports = new Adm();
