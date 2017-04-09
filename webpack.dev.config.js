let webpack = require('webpack');

module.exports = {
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
  }
}