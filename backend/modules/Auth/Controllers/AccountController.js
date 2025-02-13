const Route = use('Route');
const Config = use('Config');
const Database = use('Database');

const Notify = use('ADM/Notify');

// const User = use('Users/Models/User');

const User = use('Users/Models/User');

class AccountController {
  index({ view }) {
    return view.render('Auth.account.login');
  }

  async login({ request, auth, __ }) {
    try {
      const { email, password } = request.only(['email', 'password']);

      const authUser = await auth.authenticator('manager').attempt(email, password);

      await authUser.isBlocked();

      return Notify.success(__('Auth.login.login'), { path: Route.url(Config.get('admin.general.afterLogin')) });
    } catch (error) {
      console.log(error);
      await auth.authenticator('manager').logout();

      switch (error) {
        case 'USER_BLOCKED':
          return Notify.error(__('Auth.login.errors.blocked'));
        case 'USER_ROLES_NOT_PASSED':
          return Notify.error(__('Auth.login.errors.roleNotPassed'));
        default:
          return Notify.error(error.message);
      }
    }
  }

  async loginUser({
    request, response, auth, __
  }) {
    const { email, password } = request.only(['email', 'password']);

    try {
      if (!await auth.authenticator('jwt').attempt(email, password)) {
        // eslint-disable-next-line no-throw-literal
        throw 'AUTH_FAIL';
      }
      const user = await User.findBy('email', email);
      const accessToken = await auth.authenticator('jwt').generate(user);
      return response.json({ user, access_token: accessToken });
    } catch (error) {
      switch (error) {
        case 'USER_BLOCKED':
          return response.forbidden(Notify.error(__('Auth.login.errors.blocked')));
        case 'AUTH_FAIL':
          return response.badRequest(Notify.error(error));
        default:
          return response.status(500).json(Notify.error(error));
      }
    }
  }

  async check({ request, response }) {
    const token = request.header('Authorization');
    const exists = !!(await Database
      .select('*')
      .from('tokens')
      .whereRaw('type || \' \' || token = ?', token));
    return response.send(exists);
  }

  async logout({ auth, response }) {
    try {
      await auth.authenticator('manager').logout();
      return response.redirect(Route.url('admin.login.index'));
    } catch (error) {
      return response.redirect('back');
    }
  }

  // async signUpUser({ request, response }) {
  //   const { username, email, password } = request.all();

  //   const user = new User();
  //   user.merge({ username, email, password });

  //   if (!await user.save()) {
  //     return response.status(500).json(Notify.error('Couldn`t create a new user'));
  //   }

  //   return response.json(Notify.success('Created a new account'));
  // }
}

module.exports = AccountController;
