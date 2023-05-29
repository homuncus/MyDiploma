const Module = {
  name: '',
  el: {},
  _init(debug) {
    if (debug === undefined) debug = false;
    this.destroy();
    if (this.init) this.init(this.el());
    if (this.events) this._eventInit(debug);
    this.el().attr('data-instance', this);
  },

  init(debug) {
  },

  events() {
  },

  _parseCommand(command) {
    var command = command.split(':');
    const event = command[0];
    command.splice(0, 1);
    const selector = command.join(':');
    return { event, selector };
  },
  _eventsDestroy() {
    const module = this;
    for (const key in this.events) {
      const command = this._parseCommand(key);
      $(document).off(command.event, `[data-module=${module.name}] ${command.selector}`);
    }
  },
  _eventInit(debug) {
    const module = this;
    for (const key in this.events) {
      const command = this._parseCommand(key);
      if (debug) console.log(`Model: ${module.name}  Attach event "${command.event}" on: [data-module=${module.name}]${command.selector}`);

      (function ($, command, key, module) {
        const _function = module.events[key] === 'function' ? module.events[key] : module[module.events[key]];
        $(document).on(command.event, `[data-module=${module.name}] ${command.selector}`, function (e) {
          const result = _function.apply(this, [e, module]);
          return result;
        });
      }(jQuery, command, key, module));
    }
  },

  destroy() {
    const module = this;
    for (const key in this.events) {
      const command = this._parseCommand(key);
      $(document).off(command.event, `[data-module=${module.name}] ${command.selector}`);
    }
  }
};

module.exports = Module;
