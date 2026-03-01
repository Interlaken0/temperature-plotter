module.exports = {
  packagerConfig: { 
    asar: true,
    extraResource: [
      './assets'
    ],
    // Unpack native modules from asar
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
        name: 'amf_temp_plotter', // Note: No spaces or dashes usually allowed here
        authors: 'Greg Schaerer',    // Squirrel requires an author!
        exe: 'AMF-Temperature-Plotter.exe', // Must match executableName
        setupExe: 'AMF-Temperature-PlotterSetup.exe', // Optional: Names your installer nicely
        description: 'AMF-Temperature-Plotter - Real-time temperature monitoring application'
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