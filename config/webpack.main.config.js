const rendererConfig = require('./webpack.renderer.config.js');

module.exports = {
  /**
   * This is the main entry point for your application.
   */
  entry: './src/main/main.js',
  
  module: {
    rules: rendererConfig.module.rules,
  },

  // CRITICAL FIX: Stops Webpack from breaking the native Koffi library
  externals: {
    koffi: 'commonjs koffi'
  }
};