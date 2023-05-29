const BaseExceptionHandler = use('BaseExceptionHandler');
const thumb = use('ADM/Thumb');
const fs = require('fs');
const path = require("path");

class ExceptionHandler extends BaseExceptionHandler {
  async handle(error, { request, response, session }) {
    const hash = path.basename(request.url()).split('.')[0];
    const jsonPath = `./public/assets/cache/${hash}`;

    if (fs.existsSync(jsonPath)) {
      const json = JSON.parse(fs.readFileSync(jsonPath));
      await thumb.thumb(json.path, json.options);
      fs.unlinkSync(jsonPath);
      return response.redirect(request.url(), true);
    }
    return super.handle(...arguments);
  }
}

module.exports = ExceptionHandler;
