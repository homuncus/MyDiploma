const Route = use('Route');

Route.group(() => {
  // Auth
  Route
    .get('/', '@provider:Auth/Controllers/AccountController.index')
    .as('login.index')
    .middleware('managerGuest');
  Route
    .post('auth/login', '@provider:Auth/Controllers/AccountController.login')
    .as('auth.login')
    .middleware('managerGuest')
    .validator(['App/../modules/Auth/Validators/Login']);

  Route
    .any('auth/logout', '@provider:Auth/Controllers/AccountController.logout')
    .as('auth.logout')
    .middleware('managerAuth');
  // Dashboard
  Route
    .any('dashboard', '@provider:Auth/Controllers/DashboardController.index')
    .as('dashboard.index')
    .middleware(['managerAuth', 'managerXHR']);
  Route
    .any('dashboard/lang/:lang', '@provider:Auth/Controllers/DashboardController.lang')
    .as('dashboard.lang');
}).prefix('admin').as('admin').middleware('adminPanelLocal');

Route.group(() => {
  Route
    .post('signup', '@provider:Users/Controllers/UsersController.save')
    .as('auth.signup')
    .middleware('guest')
    .validator(['App/../modules/Auth/Validators/Signup']);

  Route
    .post('login', '@provider:Auth/Controllers/AccountController.loginUser')
    .as('auth.login')
    .middleware('guest')
    .validator(['App/../modules/Auth/Validators/Login']);

  Route
    .get('check', '@provider:Auth/Controllers/AccountController.check')
    .as('auth.check');
}).prefix('api/auth').as('api');
