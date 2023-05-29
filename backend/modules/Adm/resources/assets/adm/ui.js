/**
*
* @type {{name: string, el: {}, _init: Function, init: Function, events: Function, _parseCommand: Function, _eventsDestroy: Function, _eventInit: Function, destroy: Function}}
* @private
*/

const _UIcomponent = {
  name: '',
  context: 'body',
  init: (context) => {

  },
  destroy: (context) => {

  }
};

const _UI = {
	components: {},
	set: (name, component) => {
		component.name = name;
		_UI.components[name] = $.extend({}, _UIcomponent, component);
	},
	get: (name) => {
		return _UI.components[name];
	},
	init: (context) => {
		for (let name in _UI.components) {
			const init_context = (context) ? context : _UI.components[name].context;
			_UI.components[name].init(init_context);
		}
	},
	destroy: (context) => {
		for (let name in _UI.components) {
			const destroy_context = (context) ? context : _UI.components[name].context;
			_UI.components[name].destroy(destroy_context);
		}
	}
};

module.exports = _UI;

