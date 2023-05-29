/* eslint-disable no-underscore-dangle */

'use strict';

const _ = require('lodash');

const View = use('View');
const Config = use('Config');
const Localization = use('ADM/Localization/Lang');

class Locale {
  async handle({ antl, view, session }, next) {
    /** Overide class method */
    Object.assign(antl, {
      get: function get(key, defaultValue = null) {
        const [group, ...parts] = key.split('.');
        const localeNode = [this._locale, group, ...parts];
        const fallbackKey = this._messages['*'] ? '*' : 'fallback';
        const fallbackNode = [fallbackKey, group, ...parts];
        return _.get(this._messages, localeNode, _.get(this._messages, fallbackNode, defaultValue));
      },
    });

    View.global('__', (...args) => Localization.__.apply(null, [antl, ...args]));

    Object.assign(antl, {
      _messages: _.merge({}, Localization.getStore(), antl._messages),
    });

    const currentLocale = session.get('locale');

    if (currentLocale) {
      antl.switchLocale(currentLocale);
    } else {
      antl.switchLocale(Config.get('admin.general.defaultLocale'));
    }

    const locales = Config.get('admin.general.locales');

    view.share({ lang: locales.find((l) => l.slug === antl.currentLocale()) });
    view.share({ locales });
    view.share({ localisation: JSON.stringify(antl._messages[antl.currentLocale()]) });

    await next();
  }
}
module.exports = Locale;
