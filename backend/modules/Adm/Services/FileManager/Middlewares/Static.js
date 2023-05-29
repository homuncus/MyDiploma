'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */
class Static {
  async handle({ request, auth, response }, next, ...args) {
    try {
      const user = await auth.authenticator('manager').getUser();
    } catch (e) {
      if (request.url().indexOf('/admin/filemanager') > -1) {
        return response.status(404).send();
      }
    }

    await next();
  }
}

module.exports = Static;
