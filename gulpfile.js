const gulp = require('gulp');
const postcss = require('gulp-postcss');
// Compile SCSS to CSS
const sass = require('gulp-sass');
// Automatically add any browser prefixes to CSS
const autoprefixer = require('autoprefixer');
// Run a local server
const bs = require('browser-sync').create();
// For minifying CSS
const cleanCSS = require('gulp-clean-css');
// Babel for JS
const babel = require('gulp-babel');
// Minimize JS
const uglify = require('gulp-uglify');
// Minimize images
const imagemin = require('gulp-imagemin');
// Only deal with files that have changed since the last run
const changed = require('gulp-changed');
const size = require('gulp-size');

// *** FILE TASKS

// Port root directory files to dist folder (index.html & favicon package files)
function rootFiles() {
  return gulp
    .src('src/*.{html,ico,png,xml,svg,webmanifest}')
    .pipe(changed('dist'))
    .pipe(
      size({
        showFiles: true,
      })
    )
    .pipe(gulp.dest('dist'))
    .pipe(bs.stream());
}

// Build SCSS files to CSS files in dist folder
function styles() {
  return (
    gulp
      .src('src/styles/*.scss')
      .pipe(changed('dist/styles'))
      // Compile SCSS to CSS
      .pipe(sass())
      .pipe(
        postcss([
          // Add browser prefixes
          autoprefixer({}),
        ])
      )
      // minify CSS
      .pipe(cleanCSS({}))
      .pipe(
        size({
          showFiles: true,
        })
      )
      // Send compiled CSS to dist folder
      .pipe(gulp.dest('dist/styles'))
      // Hot reloading for browser-sync
      .pipe(bs.stream())
  );
}

// Compiles JS files to dist folder
function js() {
  return (
    gulp
      .src('src/js/*.js')
      .pipe(changed('dist/js'))
      .pipe(
        babel({
          presets: ['@babel/env'],
        })
      )
      .pipe(uglify())
      .pipe(
        size({
          showFiles: true,
        })
      )
      .pipe(gulp.dest('dist/js'))
      // Hot reloading for browser-sync
      .pipe(bs.stream())
  );
}

// Minify images and send to dist folder
function images() {
  return gulp
  .src('src/images/*.{png,gif,jpg,jpeg}')
  .pipe(changed('dist/images'))
  .pipe(imagemin())
  .pipe(
    size({
      showFiles: true,
    })
  )
  .pipe(gulp.dest('dist/images'));
}

// *** SERVER TASK

// Boot up browser-sync server and hot reload when files change
function serve() {
  bs.init({
    port: 8080,
    server: {
      baseDir: './dist',
    },
  });

  // Watch for file changes
  gulp.watch('src/*.{html,ico,png,xml,svg,webmanifest}').on('change', bs.reload);
  gulp.watch('src/styles/*.scss', styles);
  gulp.watch('src/js/*.js').on('change', bs.reload);
  gulp.watch('src/images/*.{png,gif,jpg,jpeg').on('change', bs.reload);
}


// gulp.task('serve', ['root', 'styles', 'js', 'images'], function() {

// Development task
exports.dev = serve;
// Production build task
exports.build = gulp.parallel(rootFiles, styles, js, images)
// gulp.task('default', ['root', 'styles', 'js', 'images']);
