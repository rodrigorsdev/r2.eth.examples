const path = require('path');

module.exports = {
  mode: 'development',
  entry: './dapp/index.js',
  output: {
    path: path.resolve(__dirname, 'dapp'),
    filename: 'bundle.js', // string
  },
  devServer: {
    contentBase: path.join(__dirname, 'dapp'),
    compress: true,
    port: 8080
  }
};