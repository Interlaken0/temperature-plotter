const path = require('path');

module.exports = {
  packagerConfig: { 
    asar: true,
    // THE FIX: Explicitly copy both the hardware drivers AND the Koffi library
    extraResource: [
      path.resolve(__dirname, 'assets'),
      path.resolve(__dirname, 'node_modules', 'koffi')
    ],
    asarUnpack: [
      '**/node_modules/koffi/**/*'
    ],
    executableName: 'AMF-Temperature-Plotter'
  },
  rebuildConfig: {
    onlyModules: ['koffi'],
    force: true
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'amf_temp_plotter',
        authors: 'Greg Schaerer',
        exe: 'AMF-Temperature-Plotter.exe',
        setupExe: 'AMF-Temperature-Plotter-Setup.exe',
        description: 'AMF-Temperature-Plotter - Industrial Thermal Monitoring'
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-webpack',
      config: {
        mainConfig: './config/webpack.main.config.js',
        renderer: {
          config: './config/webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/renderer/index.html',
              js: './src/renderer/index.jsx',
              name: 'main_window',
              preload: {
                js: './src/main/preload.js',
              },
            },
          ],
        },
      },
    },
  ],
};