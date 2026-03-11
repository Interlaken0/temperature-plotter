/**
 * @file Hardware Abstraction Layer for temperature sensor integration
 * @module tempDll
 */

const { app } = require('electron');
const koffi = typeof __non_webpack_require__ !== 'undefined' ? __non_webpack_require__('koffi') : require('koffi');

const path = require('path');
const fs = require('fs');
const store = require('../state/temperatureStore');
const consoleColours = require('../utils/consoleColours');

// Ultra-safe path resolution to prevent Webpack build warnings
let assetsFolder = '';
if (app && app.isPackaged) {
  // Hard fallback just in case process.resourcesPath is undefined during build
  const resPath = process.resourcesPath || path.join(process.cwd(), 'resources');
  assetsFolder = path.join(resPath, 'assets');
} else {
  assetsFolder = path.resolve(__dirname, '..', '..', 'assets');
}

const dllName = 'TempMeasure64.dll';
let lib = null;
let StartDevice_Func = null;
let IsDeviceConnected_Func = null;
const CallbackProto = koffi.proto('void __cdecl (float fTemp)');

const originalCwd = process.cwd();

try {
  const folderExists = typeof assetsFolder === 'string' && assetsFolder !== '' ? fs.existsSync(assetsFolder) : false;
  
  if (folderExists) {
    process.chdir(assetsFolder);
    try { koffi.unload(dllName); } catch (e) { } 
    lib = koffi.load(dllName);
  }
} catch (e) {
  // Silent fail - will fall back to simulator
} finally {
  try { process.chdir(originalCwd); } catch (e) { }
}

if (lib) {
  try {
    StartDevice_Func = lib.func('StartDevice', 'int', [koffi.pointer(CallbackProto), 'char*']);
    IsDeviceConnected_Func = lib.func('IsDeviceConnected', 'int', []);
  } catch (err) {
    // Silent fail - will fall back to simulator
  }
}

let registeredCallback = null;

module.exports = {
  checkConnection: () => {
    if (IsDeviceConnected_Func) {
      try { return IsDeviceConnected_Func(); } catch (e) { return 1; }
    }
    return 1;
  },

  start: () => {
    if (!lib || !StartDevice_Func) return;

    let isFirstReading = true;

    const onMeasurement = (fTemp) => {
      let outputTemp = fTemp;

      if (isFirstReading) {
        consoleColours.hardware(`Session Start: Forcing 30.00 deg C (Sensor was: ${fTemp.toFixed(2)})`);
        outputTemp = 30.00;
        isFirstReading = false;
      }

      const fahrenheit = (outputTemp * 9/5) + 32;
      consoleColours.temperature(outputTemp, fahrenheit, 'REAL');

      if (outputTemp > -50 && outputTemp < 200) {
        // EXPLICIT HARDWARE TAG ADDED HERE (true)
        store.updateTemperature(outputTemp, true);
        if (global.hardwareMonitorInstance) {
            global.hardwareMonitorInstance.updateLastUpdate();
        }
      }
    };

    try {
      if (registeredCallback) koffi.unregister(registeredCallback);
      registeredCallback = koffi.register(onMeasurement, koffi.pointer(CallbackProto));
      
      const serialNumber = Buffer.alloc(32);
      serialNumber.write('E66480454F6D2F31', 'utf8');
      
      StartDevice_Func(registeredCallback, serialNumber);
    } catch (err) {
      consoleColours.error('Hardware Start Error: ' + err.message);
    }
  },

  stop: () => {
    if (registeredCallback) {
      try {
        koffi.unregister(registeredCallback);
        registeredCallback = null;
        consoleColours.warning('Hardware Stopped (callback unregistered)');
      } catch (err) {
        consoleColours.error('Stop error: ' + err.message);
      }
    }
  }
};