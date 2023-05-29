/**
*
* @type {{name: string, el: {}, _init: Function, init: Function, events: Function, _parseCommand: Function, _eventsDestroy: Function, _eventInit: Function, destroy: Function}}
* @private
*/

const Module = require('./module');

class Modules {
  constructor() {
    this.modules = {};
  }

  set(name, module) {
    module.name = name;
    module.el = () => {
      return $('[data-module=' + name + ']');
    }
    this.modules[name] = $.extend({}, Module, module);
  }

  get(name) {
    return this.modules[name];
  }

  init() {
    $("[data-module]").each((key, el) => {
      const modul = $(el).attr('data-module');
      if (!$(el).attr('data-instance') && ADM.modules.modules[modul]) {
        ADM.modules.get(modul)._init();
      }
    });
  }
};
module.exports = new Modules();
