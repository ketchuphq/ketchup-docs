let webpack = require('webpack');

module.exports = {
  entry: {
    docs: ['whatwg-fetch', 'vendor.js', 'docs.ts']
  },
  output: {
    filename: 'assets/[name].js',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: ['src', 'node_modules']
  },
  externals: {
    'hljs': 'hljs',
    'mithril': 'm'
  },
  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'source-map-loader', enforce: 'pre' },
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ],
  }
}