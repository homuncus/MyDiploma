const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const order = require('gulp-order');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');

const source = require('vinyl-source-stream');

const Browserify = require('browserify');

const ADMIN_PATH = 'modules/Adm/resources/assets';
const CSS_DEST_PATH = 'public/admin/css';
const LIBS_DEST_PATH = 'public/admin/js';
const MODULES_DEST_PATH = 'public/admin/js';
const EXTENSION = ['.jsx', '.js'];

const MODULES_FOLDER = path.resolve(__dirname, '../../../../../', 'modules');

/**
 * JS
 */

gulp.task('admin:libs', (done) => {
  gulp.src(`${ADMIN_PATH}/admin/libs/**/*`)
    .pipe(order([
      '/**/*',
      '/*',
    ]))
    .pipe(concat('libs.min.js'))
    .pipe(gulp.dest(LIBS_DEST_PATH))
    .on('finish', () => {
      done();
    });
});

gulp.task('admin:modules', (done) => {
  const browserify = Browserify({
    extensions: EXTENSION,
    debug: false,
  });

  // init Adm module
  if (fs.existsSync(path.resolve(MODULES_FOLDER, 'Adm', 'resources/modules'))) {
    fs.readdirSync(path.resolve(MODULES_FOLDER, 'Adm', 'resources/modules')).filter((file) => EXTENSION.includes(path.extname(file))).forEach((file) => {
      browserify.add(path.resolve(MODULES_FOLDER, 'Adm', 'resources/modules', file));
    });
  }
  if (fs.existsSync(path.resolve(MODULES_FOLDER, 'Adm', 'resources/modules/libs'))) {
    fs.readdirSync(path.resolve(MODULES_FOLDER, 'Adm', 'resources/modules/libs')).filter((file) => EXTENSION.includes(path.extname(file))).forEach((file) => {
      browserify.add(path.resolve(MODULES_FOLDER, 'Adm', 'resources/modules/libs', file));
    });
  }
  if (fs.existsSync(path.resolve(MODULES_FOLDER, 'Adm', 'resources/modules/components'))) {
    fs.readdirSync(path.resolve(MODULES_FOLDER, 'Adm', 'resources/modules/components')).filter((file) => EXTENSION.includes(path.extname(file))).forEach((file) => {
      browserify.add(path.resolve(MODULES_FOLDER, 'Adm', 'resources/modules/components', file));
    });
  }

  fs.readdirSync(MODULES_FOLDER, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .filter((dir) => dir.name != 'Adm')
    .map((dirent) => dirent.name)
    .forEach((moduleName) => {
      if (fs.existsSync(path.resolve(MODULES_FOLDER, moduleName, 'resources/modules'))) {
        fs.readdirSync(path.resolve(MODULES_FOLDER, moduleName, 'resources/modules')).filter((file) => EXTENSION.includes(path.extname(file))).forEach((file) => {
          browserify.add(path.resolve(MODULES_FOLDER, moduleName, 'resources/modules', file));
        });
      }
      if (fs.existsSync(path.resolve(MODULES_FOLDER, moduleName, 'resources/modules/libs'))) {
        fs.readdirSync(path.resolve(MODULES_FOLDER, moduleName, 'resources/modules/libs')).filter((file) => EXTENSION.includes(path.extname(file))).forEach((file) => {
          browserify.add(path.resolve(MODULES_FOLDER, moduleName, 'resources/modules/libs', file));
        });
      }
      if (fs.existsSync(path.resolve(MODULES_FOLDER, moduleName, 'resources/modules/components'))) {
        fs.readdirSync(path.resolve(MODULES_FOLDER, moduleName, 'resources/modules/components')).filter((file) => EXTENSION.includes(path.extname(file))).forEach((file) => {
          browserify.add(path.resolve(MODULES_FOLDER, moduleName, 'resources/modules/components', file));
        });
      }
    });

  browserify.transform('babelify', {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-transform-runtime',
    ],
  })
    .bundle()
    .pipe(source('modules.min.js'))
    .pipe(gulp.dest(MODULES_DEST_PATH))
    .on('finish', () => {
      done();
    });
});

/**
 * CSS
 */

gulp.task('admin:theme:css:extends', (done) => {
  gulp.src(`${ADMIN_PATH}/admin/css/**/**/**/**/*`)
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(CSS_DEST_PATH))
    .on('finish', () => {
      done();
    });
});

gulp.task('admin:theme:css', gulp.series(
  'admin:theme:css:extends',
));

/**
 * BUILD
 */

gulp.task('build', gulp.series(
  'admin:theme:css',
  'admin:libs',
  'admin:modules',
));

/**
 * MIN
 */
gulp.task('min', (done) => {
  gulp.src([
    `${LIBS_DEST_PATH}/libs.min.js`,
    `${LIBS_DEST_PATH}/modules.min.js`,
  ])
    .pipe(sourcemaps.init())
    .pipe(minify({
      ext: {
        min: '.js', // Set the file extension for minified files to just .js
      },
      noSource: true, // Don’t output a copy of the source file
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(LIBS_DEST_PATH))
    .on('finish', () => {
      // Trigger the callback to signify that the task is done
      done();
      process.exit(0);
    });
});

/**
 * WATCH
 */
gulp.task('watch', () => {
  gulp.watch(`${ADMIN_PATH}/adm/**/*.js`, gulp.series('admin:modules'));
  gulp.watch(`${ADMIN_PATH}/admin/libs/**/**/**/*.js`, gulp.series('admin:libs'));
  gulp.watch(`${ADMIN_PATH}/admin/css/**/*`, gulp.series('admin:theme:css'));

  // init Adm module
  if (fs.existsSync(path.resolve(MODULES_FOLDER, 'Adm', 'resources/modules'))) {
    gulp.watch(path.resolve(MODULES_FOLDER, 'Adm', 'resources/modules/*.js'), gulp.series('admin:modules'));
  }
  if (fs.existsSync(path.resolve(MODULES_FOLDER, 'Adm', 'resources/modules/libs'))) {
    gulp.watch(path.resolve(MODULES_FOLDER, 'Adm', 'resources/modules/libs/*.js'), gulp.series('admin:modules'));
  }
  if (fs.existsSync(path.resolve(MODULES_FOLDER, 'Adm', 'resources/modules/components'))) {
    gulp.watch(path.resolve(MODULES_FOLDER, 'Adm', 'resources/modules/components/*.js'), gulp.series('admin:modules'));
  }

  // init Websocket-client module
  if (fs.existsSync(path.resolve(MODULES_FOLDER, '..', 'node_modules/@adonisjs/websocket-client'))) {
    gulp.watch(path.resolve(MODULES_FOLDER, '..', 'node_modules/@adonisjs/websocket-client/*.js'), gulp.series('admin:modules'));
  }

  fs.readdirSync(MODULES_FOLDER, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .forEach((moduleName) => {
      if (fs.existsSync(path.resolve(MODULES_FOLDER, moduleName, 'resources/modules'))) {
        gulp.watch(path.resolve(MODULES_FOLDER, moduleName, 'resources/modules/*.js'), gulp.series('admin:modules'));
      }
      if (fs.existsSync(path.resolve(MODULES_FOLDER, moduleName, 'resources/modules/libs'))) {
        gulp.watch(path.resolve(MODULES_FOLDER, moduleName, 'resources/modules/libs/*.js'), gulp.series('admin:modules'));
      }
      if (fs.existsSync(path.resolve(MODULES_FOLDER, moduleName, 'resources/modules/components'))) {
        gulp.watch(path.resolve(MODULES_FOLDER, moduleName, 'resources/modules/components/*.js'), gulp.series('admin:modules'));
      }
      if (fs.existsSync(path.resolve(MODULES_FOLDER, '..', 'node_modules/@adonisjs/websocket-client'))) {
        gulp.watch(path.resolve(MODULES_FOLDER, '..', 'node_modules/@adonisjs/websocket-client/*.js'), gulp.series('admin:modules'));
      }
    });
});
