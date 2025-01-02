module.exports = {
  packagerConfig: { asar: true },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'temperature_plotter', // Note: No spaces or dashes usually allowed here
        authors: 'Greg Schaerer',    // Squirrel requires an author!
        exe: 'Temperature-Plotter.exe', // Must match package.json name
        setupExe: 'TemperaturePlotterSetup.exe' // Optional: Names your installer nicely
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