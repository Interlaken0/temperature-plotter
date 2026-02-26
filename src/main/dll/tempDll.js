/**
 * @file Hardware Abstraction Layer for temperature sensor integration
 * @module tempDll
 */

const koffi = require('koffi');
const path = require('path');
const store = require('../state/temperatureStore');
const fs = require('fs');

let app;
try {
  app = require('electron');
} catch (e) {
  app = {
    isPackaged: false,
    getAppPath: () => process.cwd()
  };
}

const assetsPath = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '..', '..', 'assets');

let lib = null;
const originalCwd = process.cwd();

try {
  if (fs.existsSync(assetsPath)) {
    process.chdir(assetsPath);
    try { koffi.unload('TempMeasure64.dll'); } catch (e) { }
    try {
      lib = koffi.load('TempMeasure64.dll');
      console.log('[HAL] TempMeasure64.dll loaded successfully');
    } catch (e) {
      console.error('[HAL] Library Load Error:', e.message);
    }
  }
} finally {
  try { process.chdir(originalCwd); } catch (e) { }
}

let StartDevice_Func = null;
let IsDeviceConnected_Func = null;
const CallbackProto = koffi.proto('void __cdecl (float fTemp)');

if (lib) {
  try {
    StartDevice_Func = lib.func('StartDevice', 'int', [koffi.pointer(CallbackProto), 'char*']);
    IsDeviceConnected_Func = lib.func('IsDeviceConnected', 'int', []);
    console.log('[HAL] Functions bound');
  } catch (err) {
    console.error('[HAL] Function Binding Failed:', err.message);
  }
}

let registeredCallback = null;

module.exports = {
  checkConnection: () => {
    if (IsDeviceConnected_Func) {
      try {
        return IsDeviceConnected_Func();
      } catch (e) { return 1; }
    }
    return 1;
  },

  start: () => {
    if (!lib || !StartDevice_Func) return;

    // REQUIREMENT: State tracking for 30.00 start upon connection
    let isFirstReading = true;

    const onMeasurement = (fTemp) => {
      let outputTemp = fTemp;

      // Force first reading of the session to 30.00
      if (isFirstReading) {
        console.log(`[HAL] Session Start: Forcing 30.00°C (Sensor was: ${fTemp.toFixed(2)})`);
        outputTemp = 30.00;
        isFirstReading = false;
      }

      const fahrenheit = (outputTemp * 9/5) + 32;
      console.log(`[HAL] Real Reading: ${outputTemp.toFixed(2)}°C`);

      if (outputTemp > -50 && outputTemp < 200) {
        store.updateTemperature(outputTemp);
        
        // Update health monitor via global instance
        if (global.hardwareMonitorInstance) {
            global.hardwareMonitorInstance.updateLastUpdate();
        }
      }
    };

    try {
      if (registeredCallback) {
          koffi.unregister(registeredCallback);
      }
      registeredCallback = koffi.register(onMeasurement, koffi.pointer(CallbackProto));
      
      const serialNumber = Buffer.alloc(32);
      serialNumber.write('E66480454F6D2F31', 'utf8');
      
      StartDevice_Func(registeredCallback, serialNumber);
    } catch (err) {
      console.error('[HAL] Hardware Start Error:', err.message);
    }
  },

  stop: () => {
    if (registeredCallback) {
      try {
        koffi.unregister(registeredCallback);
        registeredCallback = null;
        console.log('[HAL] Hardware Stopped (callback unregistered)');
      } catch (err) {
        console.error('[HAL] Stop error:', err.message);
      }
    }
  }
};