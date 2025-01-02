module.exports = {
  entry: './src/main/main.js',
  module: {
    rules: [
      { test: /\.node$/, use: 'node-loader' },
      { test: /[/\\]node_modules[/\\].+\.(m?js|node)$/, parser: { amd: false }, use: { loader: '@vercel/webpack-asset-relocator-loader', options: { outputAssetBase: 'native_modules' } } },
    ],
  },
};