var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack')

gulp.task('js', (cb) => {
  webpack({
    entry: {
      docs: ['whatwg-fetch', 'vendor.js', 'docs.ts']
    },
    output: {
      filename: '[name].js',
      path: 'assets',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      modules: ['src', 'node_modules']
    },
    module: {
      rules: [
        { test: /\.jsx?$/, loader: 'source-map-loader', enforce: 'pre' },
        { test: /\.tsx?$/, loader: 'ts-loader' }
      ],
    },
    externals: {
      'hljs': 'hljs',
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
      })
    ]
  }, (err, stats) => {
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
gulp.task('default', ['js']);
