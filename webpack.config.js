const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    }],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};

const backgroundConfig = Object.assign({}, config, {
  name: "background",
  entry: './src/background/background.logic.ts',
  output: {
    filename: 'background.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'manifest.json', to: 'manifest.json' },
      { from: 'src/assets/icon-16.png', to: 'assets/icon-16.png' },
      { from: 'src/assets/icon-32.png', to: 'assets/icon-32.png' },
      { from: 'src/assets/icon-48.png', to: 'assets/icon-48.png' },
      { from: 'src/assets/icon-128.png', to: 'assets/icon-128.png' }
    ])
  ],
});

const popupConfig = Object.assign({}, config, {
  name: "popup",
  entry: './src/popup/popup.logic.ts',
  output: {
    filename: 'popup.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/popup/popup.style.css', to: 'popup.css' },
      { from: 'src/popup/popup.layout.html', to: 'popup.html' }
    ])
  ],
});

module.exports = [backgroundConfig, popupConfig];
