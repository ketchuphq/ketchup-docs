var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack')
var webpackProdConfig = require('./webpack.config')
var webpackDevConfig = require('./webpack.dev.config')

let production = gutil.env.production

gulp.task('js', (cb) => {
  let config = production ? webpackProdConfig : webpackDevConfig;
  webpack(config, (err, stats) => {
    if (err) {
      throw new gutil.PluginError('webpack', err)
    }
    gutil.log('[webpack]', stats.toString({
      chunks: false,
      colors: true
    }))
    cb()
  })
});

gulp.task('js:watch', () =>
  gulp.watch('src/*.ts', ['js'])
);

gulp.task('watch', ['js', 'js:watch']);

// run gulp --production to compile production build.
gulp.task('default', ['js']);
