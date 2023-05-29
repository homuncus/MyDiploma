'use strict';

module.exports = {
  /*
  |--------------------------------------------------------------------------
  | Swagger Information
  | Please use Swagger 2 Spesification Docs
  | https://swagger.io/docs/specification/2-0/basic-structure/
  |--------------------------------------------------------------------------
  */

  enable: true,
  specUrl: '/swagger.json',

  options: {
    swaggerDefinition: {
      info: {
        title: 'Adonis 💘 Swagger',
        version: '1.0.0',
      },
      basePath: '/',
      securityDefinitions: {
        JWT: {
          description: '',
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      }
    },

    apis: [
      'docs/**/*.yml',
    ],
  },
};
