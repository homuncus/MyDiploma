'use strict'
const path = require('path');

const { ServiceProvider } = require('@adonisjs/fold');

class FileManager extends ServiceProvider {
  register() {
    this.app.bind('FileManager/Static', () => {
      const Static = require('./Middlewares/Static')
      return new Static()
    })
  }

  boot() {
    this.app.autoload(path.join(__dirname), 'FileManager');
    this.app.use('Route').get('/filemanager', '@provider:FileManager/Controllers/FileManagerController.get')
    this.app.use('Route').post('/filemanager', '@provider:FileManager/Controllers/FileManagerController.post')
  }

}
module.exports = FileManager;
