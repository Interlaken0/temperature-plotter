module.exports = {
  entry: './src/main/main.js',
  
  // CRITICAL: Tells Webpack not to bundle Koffi, preventing the 18 red errors
  externals: {
    koffi: 'commonjs koffi'
  },

  module: {
    rules: [], 
  },

  plugins: [], 
};