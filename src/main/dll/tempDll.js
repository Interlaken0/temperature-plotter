/**
 * @file Hardware Abstraction Layer - Channel Exhaustion Fix
 * @module tempDll
 */

const { app } = require('electron');
const path = require('path');
const fs = require('fs');
const store = require('../state/temperatureStore');
const consoleColours = require('../utils/consoleColours');

// 1. ISOLATE AND LOCATE THE KOFFI LIBRARY
let koffi;
try {
    const koffiPath = app.isPackaged
        ? path.join(process.resourcesPath, 'koffi') 
        : 'koffi';                                  

    koffi = typeof __non_webpack_require__ !== 'undefined' 
        ? __non_webpack_require__(koffiPath) 
        : require(koffiPath);
} catch (err) {
    consoleColours.error(`Koffi load failed: ${err.message}`);
    throw err; 
}

// 2. RESOLVE ASSETS FOLDER
let assetsFolder = app.isPackaged
  ? path.join(process.resourcesPath, 'assets') 
  : path.join(app.getAppPath(), 'assets');

let dllPath = path.join(assetsFolder, 'TempMeasure64.dll');

if (app.isPackaged && !fs.existsSync(dllPath)) {
    assetsFolder = process.resourcesPath;
    dllPath = path.join(assetsFolder, 'TempMeasure64.dll');
}

// 3. WINDOWS DLL PATH INJECTION
process.env.PATH = `${assetsFolder};${process.env.PATH}`;

let lib = null;
let StartDevice_Func = null;
let IsDeviceConnected_Func = null;
const CallbackProto = koffi.proto('void __cdecl (float fTemp)');

// 4. LOAD DLL & PREVENT AMF CHANNEL EXHAUSTION
const originalCwd = process.cwd();
try {
    if (fs.existsSync(dllPath)) {
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

if (lib) {
    try {
        StartDevice_Func = lib.func('StartDevice', 'int', [koffi.pointer(CallbackProto), 'char*']);
        IsDeviceConnected_Func = lib.func('IsDeviceConnected', 'int', []);
    } catch (err) {
        consoleColours.error('Hardware HAL: Function binding failed: ' + err.message);
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
            
            const fahrenheit = (outputTemp * 9/5) + 32;
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
            } catch (err) {}
        }
    }
};