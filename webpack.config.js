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
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' }
    ],
  },
  externals: {
    'hljs': 'hljs',
    'mithril': 'm'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
    })
  ]
}