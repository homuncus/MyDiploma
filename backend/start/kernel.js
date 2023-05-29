'use strict';

/** @type {import('@adonisjs/framework/src/Server')} */
const Server = use('Server');
/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on each http request only when the routes
| match.
|
*/
const globalMiddleware = [
  'Adonis/Middleware/BodyParser',
  'Adonis/Middleware/Session',
  'Adonis/Middleware/Shield',
  'Adonis/Middleware/AuthInit',
  'Adonis/Acl/Init',
  '@provider:Adm/Services/Localization/Middleware'
];

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware is key/value object to conditionally add middleware on
| specific routes or group of routes.
|
| // define
| {
|   auth: 'Adonis/Middleware/Auth'
| }
|
| // use
| Route.get().middleware('auth')
|
*/
const namedMiddleware = {
  adminPanelLocal: '@provider:Adm/Services/Localization/Middleware',
  managerGuest: '@provider:Auth/Middleware/ManagerGuest',
  managerAuth: '@provider:Auth/Middleware/ManagerAuth',
  managerXHR: '@provider:Auth/Middleware/ManagerXhr',
  managerIs: '@provider:Auth/Middleware/ManagerIs',
  managerCan: '@provider:Auth/Middleware/ManagerCan',
  can: 'Adonis/Acl/Can',
  is: 'Adonis/Acl/Is',
  Locale: '@provider:Api/Middleware/Locale',
  Auth: '@provider:Api/Middleware/Auth',
  auth: 'Adonis/Middleware/Auth',
  guest: 'Adonis/Middleware/AllowGuestOnly'
};

/*
|--------------------------------------------------------------------------
| Server Middleware
|--------------------------------------------------------------------------
|
| Server level middleware are executed even when route for a given URL is
| not registered. Features like `static assets` and `cors` needs better
| control over request lifecycle.
|
*/
const serverMiddleware = [
  '@provider:Adm/Services/AdminStatic/Middleware',
  'App/Middleware/StaticAuth',
  'Adonis/Middleware/Session',
  'Adonis/Middleware/Static',
  'Adonis/Middleware/Cors',
];

Server
  .registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
  .use(serverMiddleware);
