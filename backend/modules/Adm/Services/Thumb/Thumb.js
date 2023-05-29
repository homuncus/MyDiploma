const sharp = require('sharp');
const crypto = require('crypto');
const path = require('path');

const fs = require('fs');
const { promisify } = require('util');
const existsAsync = promisify(fs.exists);

class Thumb {
  getPath(imagePath, options) {
    const hash = crypto.createHash('md5').update(imagePath + JSON.stringify(options)).digest('hex');
    const type = options.type || path.extname(imagePath).replace('.', '');

    return {
      path: `./public/assets/cache/${hash}.${type}`,
      base: `./public/assets/cache/${hash}`,
      hash
    };
  }

  getOptions(args) {
    let options = {
      width: args[0],
      height: args[1]
    };

    if (typeof args[0] === 'object') {
      options = args[0];
    }

    return options;
  }

  async thumb(url, ...args) {
    if (!url) return '';


    if (!(await existsAsync(path.join('./public', url)))) {
      throw new Error('not exists.');
    }

    const options = this.getOptions(args);

    return new Promise((resolve) => {
      const type = options.type || path.extname(url).replace('.', '');
      const newPath = this.getPath(url, options);
      const image = sharp(path.join('./public', url));

      switch (type) {
        case 'png':
          image
            .resize({
              background: { r: 230, g: 230, b: 230, alpha: 0 },
              fit: sharp.fit.contain,
              ...options
            })
            .png({
              compressionLevel: 9,
              adaptiveFiltering: true,
              force: true,
              // progressive: true,
              quality: 100,
              ...options
            });
          break;
        default:
          image
            // .background({ r: 0, g: 0, b: 0, alpha: 0 })
            .flatten({
              background: { r: 255, g: 255, b: 255, alpha: 1 }
            })
            .resize({
              kernel: 'cubic',
              background: { r: 255, g: 255, b: 255, alpha: 1 },
              // quality: 100,
              fit: sharp.fit.contain,
              ...options
            })
            // .sharpen(0.9)
            .jpeg({
              chromaSubsampling: '4:4:4',
              quality: 100,
              force: false,
              // progressive: true,
              ...options
            });
      }

      image
        .toFile(newPath.path)
        .then(info => resolve(newPath.path.replace('./public/', '/')));

      return true;
    });
  }
}

module.exports = new Thumb();
