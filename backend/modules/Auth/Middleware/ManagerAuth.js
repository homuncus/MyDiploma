'use strict';

const Route = use('Route');
const Logger = use('Logger');
class ManagerAuth {
  async handle({ request, response, view, auth }, next) {
    try {
      if (request.ajax()) {
        return next();
      }
      const authUser = await auth.authenticator('manager').getUser();
      await authUser.isBlocked();

      await authUser.load('roles.permissions');

      // await authUser.isAdminPanelAccess();

      authUser.$sideLoaded.rolesSlugs = await authUser.getRolesSlugs();
      authUser.$sideLoaded.permissionsSlugs = await authUser.getPermissionsSlugs();
      authUser.$sideLoaded.permissionsSlugsStringify = JSON.stringify(authUser.$sideLoaded.permissionsSlugs);

      Object.assign(auth, { user: authUser });

      view.share({
        auth: { user: authUser },
      });
    } catch (error) {
      if (error.name !== 'InvalidSessionException') {
        Logger.error(`ManagerAuth ${error}`, error);
      }

      await auth.authenticator('manager').logout();

      // if (request.ajax()) {
      //   return response.unauthorized({ path: Route.url('admin.login.index') });
      // }

      return response.route('admin.login.index');
    }

    return next();
  }
}

module.exports = ManagerAuth;
