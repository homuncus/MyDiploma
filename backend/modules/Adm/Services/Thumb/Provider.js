'use strict'

const { ServiceProvider } = require('@adonisjs/fold');
const sharp = require('sharp');
const crypto = require('crypto');
const fs = require('fs');
const path = require("path");
const { promisify } = require('util');

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const existsAsync = promisify(fs.exists);

class Thumb extends ServiceProvider {
  boot() {
    const View = use('View');
    const Exception = use('Exception');
    const thumb = require('./Thumb');

    this.app.bind('ADM/Thumb', () => {
      return thumb;
    });


    View.global('thumb', (path, ...args) => {
      const options = thumb.getOptions(args);
      const newPath = thumb.getPath(path, options);
      writeFileAsync(newPath.base, JSON.stringify({
        path,
        options
      }));
      return newPath.path.replace('./public/', '/');
    });


    Exception.handle('HttpException', async (error, { request, response, session }) => {
      const hash = path.basename(request.url()).split('.')[0];
      const jsonPath = `./public/assets/cache/${hash}`;

      try {
        if (await existsAsync(jsonPath)) {
          const json = JSON.parse(await readFileAsync(jsonPath));
          await thumb.thumb(json.path, json.options);
          fs.unlink(jsonPath, () => { });
          return response.redirect(request.url(), true);
        }
      } catch (e) {
        return response.status(404).send();
      }
      return
    });

    // Exception.handle('*', 'App/Services/Thumb/Exception2.handle');
    // Exception.handle('E_ROUTE_NOT_FOUND', () => {
    //   console.log(1111)
    // });
  }
}
module.exports = Thumb;
