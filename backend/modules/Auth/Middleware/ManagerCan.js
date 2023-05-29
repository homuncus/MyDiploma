'use strict';

class ManagerCan {
  async handle({ auth, response, request }, next, ...args) {
    if (request.ajax()) {
      return next();
    }

    let expression = args[0];

    if (Array.isArray(expression)) {
      expression = expression[0];
    }

    const can = auth.user.managerCan(expression);

    if (!can) {
      return response.forbidden('Access forbidden. You are not allowed to this resource.');
    }

    return next();
  }
}

module.exports = ManagerCan;
