module.exports = {
  /**
   * BACKEND ENTRY POINT
   * KSB: Build Systems
   * Defines the root of the Main Process dependency tree. 
   * Webpack starts here to bundle the Node.js side of the Electron app.
   */
  entry: './src/main/main.js',
  
  // --- NEW ADDITION ---
  // KSB: Native Modules & Dependency Management
  // We explicitly tell Webpack NOT to bundle 'koffi'.
  // Since 'koffi' relies on binary .node files, it must be loaded from 
  // node_modules at runtime (CommonJS) rather than bundled into the JS blob.
  externals: {
    koffi: 'commonjs koffi', 
  },
  // --------------------

  module: {
    rules: [
      // KSB: Native Integration (FFI)
      // This rule is CRITICAL for the project's distinction feature (Hardware DLL).
      // It tells Webpack to handle .node files (Native C++ Addons) correctly,
      // ensuring the DLL driver works inside the packaged application.
      { test: /\.node$/, use: 'node-loader' },
      
      { 
        test: /[/\\]node_modules[/\\].+\.(m?js|node)$/, 
        parser: { amd: false }, 
        use: { 
          // KSB: Deployment & Packaging
          // Ensures native dependencies are correctly relocated when compiling 
          // the source code into the final executable (.exe).
          loader: '@vercel/webpack-asset-relocator-loader', 
          options: { outputAssetBase: 'native_modules' } 
        } 
      },
    ],
  },
};