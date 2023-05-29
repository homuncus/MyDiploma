'use strict';

const auth = use('basic-auth');
const config = use('Adonis/Src/Config').get('auth.staticAuth');
const validConfig = config && config.protectedUrls.length;

class StaticAuth {
  async handle({ request, response }, next) {
    if (!validConfig) return next();
    if (!request.match(config.protectedUrls)) return next();
    const req = request.request;
    const credentials = auth(req);

    if (!credentials || (credentials.name !== config.username) || (credentials.pass !== config.password)) {
      return response
        .safeHeader('WWW-Authenticate', `Basic realm="${config.realm || 'Protected Area'}"`)
        .unauthorized('Access denied');
    }

    return next();
  }
}

module.exports = StaticAuth;
