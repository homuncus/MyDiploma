# Init 

## You need add thex in ur app

Instal dependances

```bash
  npm i deepmerge
```

Update `app.js` add important providers

```js
  const providers = [
    ...use('App/../modules/Adm/Services/providers'),
  ];
```

Update `kernel.js` add important middleware

```js

  const globalMiddleware = [
    '@provider:Adm/Services/Localization/Middleware',
  ];

  const namedMiddleware = [
    managerGuest: '@provider:Auth/Middleware/ManagerGuest',
    managerAuth: '@provider:Auth/Middleware/ManagerAuth',
    managerXHR: '@provider:Auth/Middleware/ManagerXhr',
    managerIs: '@provider:Auth/Middleware/ManagerIs',
    managerCan: '@provider:Auth/Middleware/ManagerCan',
  ];

  const serverMiddleware = [
    '@provider:Adm/Services/AdminStatic/Middleware',
  ];
```
## ADM `gulp` commands

```bash
  gulp build
  gulp min
  gulp watch
```
## ADM `module` commands

```bash
  adonis module:generate
  adonis module:migrun
  adonis module:sync
```
