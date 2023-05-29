'use strict';

class ManagerIs {
  async handle({ auth, request, response }, next, ...args) {
    if (request.ajax()) {
      return next();
    }

    let expression = args[0];

    if (Array.isArray(expression)) {
      expression = expression[0];
    }

    const is = auth.user.managerIs(expression);

    if (!is) {
      return response.forbidden('Access forbidden. You are not allowed to this resource.');
    }

    return next();
  }
}

module.exports = ManagerIs;
