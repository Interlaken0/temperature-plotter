/**
 * @file Hardware Abstraction Layer - Refactored for Testability
 * @module tempDll
 * 
 * REFACTORED: Now uses factory pattern to support unit testing.
 * - All module-level execution moved into factory function
 * - Dependencies can be injected for testing
 * - Maintains backward compatibility via default export
 */

const { app } = require('electron');
const path = require('path');
const fs = require('fs');
const store = require('../state/temperatureStore');
const consoleColours = require('../utils/consoleColours');

/**
 * Create hardware abstraction layer with optional dependency injection
 * @param {Object} [deps] - Dependencies for injection (testing)
 * @param {Object} [deps.electronApp] - Mock Electron app
 * @param {Object} [deps.koffiModule] - Mock Koffi module
 * @param {Object} [deps.fsModule] - Mock fs module
 * @param {Object} [deps.pathModule] - Mock path module
 * @returns {Object} Hardware abstraction interface
 */
function createHardwareAbstraction(deps = {}) {
  // Dependency injection for testing
  const electronApp = deps.electronApp || app;
  const koffi = deps.koffiModule || loadKoffi();
  const fsModule = deps.fsModule || fs;
  const pathModule = deps.pathModule || path;

  let lib = null;
  let StartDevice_Func = null;
  let IsDeviceConnected_Func = null;
  let registeredCallback = null;
  let CallbackProto = null;

  // 1. LOAD KOFFI LIBRARY
  function loadKoffi() {
    try {
      const koffiPath = electronApp.isPackaged
        ? pathModule.join(process.resourcesPath, 'koffi')
        : 'koffi';

      return typeof __non_webpack_require__ !== 'undefined'
        ? __non_webpack_require__(koffiPath)
        : require(koffiPath);
    } catch (err) {
      consoleColours.error(`Koffi load failed: ${err.message}`);
      throw err;
    }
  }

  // 2. RESOLVE ASSETS FOLDER
  let assetsFolder = electronApp.isPackaged
    ? pathModule.join(process.resourcesPath, 'assets')
    : pathModule.join(electronApp.getAppPath(), 'assets');

  let dllPath = pathModule.join(assetsFolder, 'TempMeasure64.dll');

  if (electronApp.isPackaged && !fsModule.existsSync(dllPath)) {
    assetsFolder = process.resourcesPath;
    dllPath = pathModule.join(assetsFolder, 'TempMeasure64.dll');
  }

  // 3. WINDOWS DLL PATH INJECTION
  process.env.PATH = `${assetsFolder};${process.env.PATH}`;

  // 4. CREATE CALLBACK PROTOCOL
  if (koffi && koffi.proto) {
    try {
      CallbackProto = koffi.proto('void __cdecl (float fTemp)');
    } catch (e) {
      consoleColours.warning('Failed to create callback protocol: ' + e.message);
    }
  }

  // 5. LOAD DLL & PREVENT AMF CHANNEL EXHAUSTION
  const originalCwd = process.cwd();
  try {
    if (fsModule.existsSync(dllPath)) {
      process.chdir(assetsFolder);

      // CRITICAL FIX: Unload previous instance to free up the 9 AMF Channels
      try {
        if (koffi.unload) koffi.unload(dllPath);
      } catch (e) {
        // Ignore if it is the first time loading
      }

      lib = koffi.load(dllPath);
      consoleColours.success(`Hardware HAL: DLL loaded from ${assetsFolder}`);
    } else {
      throw new Error(`DLL missing at expected path: ${dllPath}`);
    }
  } catch (e) {
    consoleColours.warning(`Hardware HAL Failure: ${e.message}`);
  } finally {
    process.chdir(originalCwd);
  }

  // 6. BIND DLL FUNCTIONS
  if (lib) {
    try {
      StartDevice_Func = lib.func('StartDevice', 'int', [koffi.pointer(CallbackProto), 'char*']);
      IsDeviceConnected_Func = lib.func('IsDeviceConnected', 'int', []);
    } catch (err) {
      consoleColours.error('Hardware HAL: Function binding failed: ' + err.message);
    }
  }

  // Create interface object
  const hardwareInterface = {
    checkConnection: () => {
      if (IsDeviceConnected_Func) {
        try { return IsDeviceConnected_Func(); } catch (e) { return 1; }
      }
      return 1;
    },

    start: () => {
      if (!lib || !StartDevice_Func) return;

      const knownSerials = [
        'E66480454F6D2F31', // Alpha
        'E6614103E71E2122'  // Beta
      ];

      let isFirstReading = true;

      const onMeasurement = (fTemp) => {
        let outputTemp = fTemp;
        if (isFirstReading) {
          consoleColours.hardware(`Handshake Success: Forcing 30.00°C`);
          outputTemp = 30.00;
          isFirstReading = false;
        }

        const fahrenheit = (outputTemp * 9 / 5) + 32;
        consoleColours.temperature(outputTemp, fahrenheit, 'CONNECTED');

        if (outputTemp > -50 && outputTemp < 200) {
          store.updateTemperature(outputTemp, true, "CONNECTED", "HARDWARE_ACTIVE");
          if (global.hardwareMonitorInstance) {
            global.hardwareMonitorInstance.updateLastUpdate();
          }
        }
      };

      const discoveryCwd = process.cwd();
      try {
        process.chdir(assetsFolder);
        let discoverySuccess = false;

        for (const serial of knownSerials) {
          if (discoverySuccess) break;
          try {
            if (registeredCallback) koffi.unregister(registeredCallback);
            registeredCallback = koffi.register(onMeasurement, koffi.pointer(CallbackProto));

            const serialBuffer = Buffer.alloc(32);
            serialBuffer.write(serial + '\0', 'utf8');

            const result = StartDevice_Func(registeredCallback, serialBuffer);

            if (result === 0) {
              discoverySuccess = true;
              consoleColours.success(`SUCCESS: Initialised Pico ID [${serial}]`);
            }
          } catch (err) {
            consoleColours.error(`Discovery Error: ${err.message}`);
          }
        }
      } finally {
        process.chdir(discoveryCwd);
      }
    },

    stop: () => {
      if (registeredCallback) {
        try {
          koffi.unregister(registeredCallback);
          registeredCallback = null;
        } catch (err) { }
      }
    },

    // Expose internal state for testing
    _testInternals: {
      lib,
      StartDevice_Func,
      IsDeviceConnected_Func,
      assetsFolder,
      dllPath,
      koffi,
      CallbackProto
    }
  };

  return hardwareInterface;
}

// Create default instance for backward compatibility
const defaultInstance = createHardwareAbstraction();

// Export both the factory and default instance
module.exports = {
  createHardwareAbstraction,
  checkConnection: defaultInstance.checkConnection,
  start: defaultInstance.start,
  stop: defaultInstance.stop
};