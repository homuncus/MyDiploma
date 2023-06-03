'use strict';

const Logger = use('Logger');
const BaseExceptionHandler = use('BaseExceptionHandler');

class ExceptionHandler extends BaseExceptionHandler {
  async handle(error, { response, user, __ }) {
    if (error.name === 'HttpException') {
      // if (error.code === 'E_ROUTE_NOT_FOUND') {
      //   response.notFound(view.render('errors.index', { status: error.status, code: error.code }));
      // }
      // response.badRequest(view.render('errors.index', { status: error.status, code: error.code }));
      // }
      // if (error.name === 'ForbiddenException') {
      //   response.forbidden({ error: error.message });
      // }
      // if (error.name === 'InvalidRefreshToken') {
      //   response.unauthorized({ error: error.message });
      // }
      // if (error.name === 'InvalidJwtToken') {
      //   response.unauthorized({ error: error.message });
      // }
      // if (error.name === 'ExpiredJwtToken') {
      //   response.unauthorized({ error: error.message });
    }
    Logger.error(`ExceptionHandler ${error}`, error);
    return response.status(error.status).json(error.message);
  }
}

module.exports = ExceptionHandler;
