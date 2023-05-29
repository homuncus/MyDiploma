'use strict';

const Route = use('Route');
const Config = use('Config');

const Notify = use('ADM/Notify');

class ManagerGuest {
  async handle({ request, response, auth, __ }, next) {
    if (request.ajax()) {
      return next();
    }

    try {
      await auth.authenticator('manager').check();

      // if (request.ajax()) return Notify.success(__('Auth.login.login'), { path: Route.url(Config.get('admin.general.afterLogin')) });

      return response.route(Config.get('admin.general.afterLogin'));
    } catch (error) {
      return next();
    }
  }
}

module.exports = ManagerGuest;
