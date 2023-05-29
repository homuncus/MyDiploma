'use strict';

const _ = require('lodash');

class Localization {
  constructor() {
    this.store = {};
  }

  __(antl, ...args) {
    try {
      return antl.formatMessage(...args);
    } catch (error) {
      return `${antl.currentLocale()}.${args[0]}`;
    }
  }

  set(value) {
    this.store = _.merge({}, this.store, value);
  }

  getStore() {
    return this.store;
  }
}

module.exports = new Localization();
