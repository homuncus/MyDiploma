/* eslint-disable consistent-return */

'use strict';

const serveStatic = use('serve-static');

const Helpers = use('Helpers');
let staticServer = null;
class Static {
  async handle({ request, response }, next) {
    const rOriginalUrl = request.originalUrl();
    if (!rOriginalUrl.includes('admin')) return next();

    if (['GET', 'HEAD'].indexOf(request.method()) === -1) return next();

    if (!rOriginalUrl.includes('/admin/assets')) return next();

    Object.assign(request.request, { url: rOriginalUrl.replace('/admin/assets', '') });

    try {
      if (!staticServer) {
        staticServer = Helpers.promisify(serveStatic(`${Helpers.appRoot()}/modules/Adm/resources/assets/themes/metronic/assets`, {
          fallthrough: false,
          dotfiles: 'ignore',
          etag: true,
          extensions: false,
        }));
      }

      await staticServer(request.request, request.response);
    } catch (error) {
      if (error.status === 404) return next();
      error.message = `${error.message} while resolving ${request.url()}`;
      throw error;
    }
  }
}

module.exports = Static;
