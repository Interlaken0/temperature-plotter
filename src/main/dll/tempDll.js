const koffi = require('koffi');
const path = require('path');
const store = require('../state/temperatureStore');
const fs = require('fs');

// Safety check for Electron app (for standalone testing)
let app;
try {
  app = require('electron');
} catch (e) {
  app = {
    isPackaged: false,
    getAppPath: () => process.cwd()
  };
}

console.log('[HAL] Mode: Koffi Type System (Modern)');

// ------------------------------------------------------------
// STEP 1: Resolve DLL path
// ------------------------------------------------------------
const assetsPath = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '..', '..', 'assets');

let lib = null;
const originalCwd = process.cwd();

try {
  console.log(`[HAL] Assets path: ${assetsPath}`);

  if (fs.existsSync(assetsPath)) {
    process.chdir(assetsPath);

    // Safety Unload
    try { koffi.unload('TempMeasure64.dll'); } catch (e) {}
    
    try {
      lib = koffi.load('TempMeasure64.dll');
      console.log('[HAL] ✓ TempMeasure64.dll loaded successfully');
    } catch (e) {
      console.error('[HAL] ✗ Library Load Error:', e.message);
    }
  } else {
    console.error(`[HAL] ✗ Assets folder missing at ${assetsPath}`);
  }
} catch (error) {
  console.error('[HAL] ✗ Setup Error:', error.message);
} finally {
  try { process.chdir(originalCwd); } catch (e) {}
}

// ------------------------------------------------------------
// STEP 2: Bind DLL functions
// ------------------------------------------------------------

let StartDevice_Func = null;
let IsDeviceConnected_Func = null;
// Anonymous prototype to prevent "Duplicate type" errors on reload
const CallbackProto = koffi.proto('void __cdecl (float fTemp)');

if (lib) {
  try {
    StartDevice_Func = lib.func(
      'StartDevice',
      'int',
      [ koffi.pointer(CallbackProto), 'char*' ]
    );

    IsDeviceConnected_Func = lib.func(
      'IsDeviceConnected',
      'int',
      []
    );

    console.log('[HAL] ✓ Functions bound');
  } catch (err) {
    console.error('[HAL] ✗ Function Binding Failed:', err.message);
  }
}

let registeredCallback = null;

// ------------------------------------------------------------
// STEP 3: Exported HAL API
// ------------------------------------------------------------
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
    if (!lib || !StartDevice_Func) {
      console.warn('[HAL] ✗ Cannot start: DLL not ready.');
      return;
    }

    try {
      const connStatus = IsDeviceConnected_Func ? IsDeviceConnected_Func() : 1;
      console.log(
        `[HAL] Connection Check: ${connStatus} ${
          connStatus === 0 ? '(Connected ✓)' : '(Not Connected ✗)'
        }`
      );
    } catch (err) {
      console.error('[HAL] ✗ Connection check failed:', err.message);
    }

    // 2. JS Handler with Stale Data Filter
    let isFirstReading = true;

    const onMeasurement = (fTemp) => {
      // FILTER: If the very first reading is 10.00, it's stale data from the previous run.
      // We skip it so the logs start cleanly at 30.00.
      if (isFirstReading) {
        isFirstReading = false;
        if (Math.abs(fTemp - 10.00) < 0.1) {
           return; 
        }
      }

      console.log(`[HAL] Real Reading: ${fTemp.toFixed(2)}°C`);
      
      if (fTemp > -50 && fTemp < 200) {
        store.updateTemperature(fTemp);
      }
    };

    try {
      console.log('[HAL] Registering callback...');
      registeredCallback = koffi.register(onMeasurement, koffi.pointer(CallbackProto));

      console.log('[HAL] ✓ Callback registered');
      console.log('[HAL] Calling StartDevice...');
      
      const serialNumber = Buffer.alloc(32); 
      serialNumber.write("E66480454F6D2F31", 'utf8'); 
      
      const startStatus = StartDevice_Func(registeredCallback, serialNumber);

      if (startStatus === 0) {
        console.log('[HAL] ✓✓✓ SUCCESS: Hardware Started! ✓✓✓');
      } else {
        console.warn(`[HAL] StartDevice returned ${startStatus} (Expected for Virtual DLL)`);
      }
    } catch (err) {
      console.error('[HAL] ✗ Error:', err.message);
    }
  },

  stop: () => {
    if (registeredCallback) {
      try {
        koffi.unregister(registeredCallback);
        registeredCallback = null;
        console.log('[HAL] ✓ Hardware Stopped (callback unregistered)');
      } catch (err) {
        console.error('[HAL] ✗ Stop error:', err.message);
      }
    }
  }
};