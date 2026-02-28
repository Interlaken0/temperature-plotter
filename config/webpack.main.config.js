let standardRules = [];
try {
  // Tries to grab the webpack.rules.js file from the project root (one folder up)
  standardRules = require('../webpack.rules');
} catch (e) {
  // If the file doesn't exist, safely do nothing so the build continues
}

module.exports = {
  /**
   * This is the main entry point for your application.
   */
  entry: './src/main/main.js',
  
  module: {
    rules: standardRules,
  },

  // CRITICAL FIX: Stops Webpack from breaking the native Koffi library
  externals: {
    koffi: 'commonjs koffi'
  }
};