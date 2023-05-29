'use strict';

const Config = use('Config');
const Menu = use('ADM/Menu');

class ManagerXhr {
  async handle({ request, response, view, __ }, next) {
    if (!request.ajax()) {
      view.share({
        adminMenu(user) {
          const { $sideLoaded } = user || {};
          const { permissionsSlugs } = $sideLoaded || {};
          return Menu.build(Config.get('admin.menu'), permissionsSlugs, __);
        },
      });
      return response.send(view.render(Config.get('admin.general.masterTemplate')));
    }

    return next();
  }
}

module.exports = ManagerXhr;
