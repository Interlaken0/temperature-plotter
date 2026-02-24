/**
 * @file Hardware Abstraction Layer for temperature sensor integration
 * @module tempDll
 * @description Advanced FFI implementation for native DLL communication
 */

// DLL BINDING MODULE - Hardware Abstraction Layer (HAL)
// ============================================================================
// Advanced Foreign Function Interface (FFI) implementation for temperature hardware:
// - Uses Koffi library for native DLL binding
// - Provides hardware abstraction layer for temperature sensors
// - Handles real-time data streaming via callbacks
// - Implements robust error handling and connection management
// - Supports both packaged and development environments
// - Demonstrates professional native integration techniques
// ============================================================================

const koffi = require('koffi'); // Modern FFI library for native library binding
const path = require('path'); // Node.js path utilities for file system navigation
const store = require('../state/temperatureStore'); // Global temperature data store
const fs = require('fs'); // File system module for DLL existence checks

// ELECTRON ENVIRONMENT DETECTION - Development vs Production handling
// ============================================================================
// Handles both standalone testing and Electron packaged environments:
// - Detects if running within Electron app context
// - Provides fallback for standalone testing scenarios
// - Ensures consistent behaviour across development and production
// - Enables module testing without full Electron environment
// ============================================================================
let app;
try {
  app = require('electron'); // Try to load Electron app module
} catch (e) {
  // TESTING FALLBACK - Mock Electron app for standalone testing
  app = {
    isPackaged: false, // Assume development environment
    getAppPath: () => process.cwd() // Use current working directory
  };
}

// LOGGING INITIALIZATION - HAL mode identification
console.log('[HAL] Mode: Koffi Type System (Modern)'); // Log FFI system in use

// STEP 1: DLL PATH RESOLUTION - Asset location and loading
// ------------------------------------------------------------
// Handles dynamic DLL path resolution for different environments:
// - Production: Uses packaged resources path
// - Development: Uses local assets folder
// - Changes working directory for DLL loading
// - Implements robust error handling and cleanup
// ------------------------------------------------------------
// ASSETS PATH CONFIGURATION - Environment-aware DLL location
const assetsPath = app.isPackaged
  ? path.join(process.resourcesPath, 'assets') // Production: packaged resources
  : path.join(__dirname, '..', '..', 'assets'); // Development: local assets folder

// LIBRARY LOADING INFRASTRUCTURE - DLL management setup
let lib = null; // Library reference for FFI operations
const originalCwd = process.cwd(); // Store original working directory for restoration

// DLL LOADING ATTEMPT - Main library initialization sequence
try {
  console.log(`[HAL] Assets path: ${assetsPath}`); // Log resolved assets path for debugging

  if (fs.existsSync(assetsPath)) { // Verify assets folder exists
    process.chdir(assetsPath); // Change to assets directory for DLL loading

    // SAFETY UNLOAD - Clean previous DLL instances to prevent conflicts
    try { koffi.unload('TempMeasure64.dll'); } catch (e) { /* Silent cleanup failure */ }
    
    // LIBRARY LOADING - Load temperature measurement DLL via FFI
    try {
      lib = koffi.load('TempMeasure64.dll'); // Load native DLL for hardware communication
      console.log('[HAL] TempMeasure64.dll loaded successfully'); // Confirm successful load
    } catch (e) {
      console.error('[HAL] Library Load Error:', e.message); // Log loading failure
    }
  } else {
    console.error(`[HAL] Assets folder missing at ${assetsPath}`); // Log missing assets folder
  }
} catch (error) {
  console.error('[HAL] Setup Error:', error.message); // Log general setup errors
} finally {
  // WORKING DIRECTORY RESTORATION - Always restore original CWD
  try { process.chdir(originalCwd); } catch (e) { /* Silent restoration failure */ }
}

// STEP 2: DLL FUNCTION BINDING - FFI function registration
// ------------------------------------------------------------
// Establishes function pointers to native DLL functions:
// - Defines C function signatures for type safety
// - Binds StartDevice and IsDeviceConnected functions
// - Creates callback prototype for real-time data streaming
// - Implements robust error handling for binding failures
// ------------------------------------------------------------
// FUNCTION POINTER DECLARATIONS - Native function references
let StartDevice_Func = null; // Hardware device initialization function
let IsDeviceConnected_Func = null; // Connection status check function
// CALLBACK PROTOTYPE - Anonymous prototype prevents "Duplicate type" errors on module reload
const CallbackProto = koffi.proto('void __cdecl (float fTemp)'); // C callback signature for temperature data

// FUNCTION BINDING - Register native functions with FFI
if (lib) { // Only proceed if DLL loaded successfully
  try {
    // START DEVICE BINDING - Hardware initialization function
    StartDevice_Func = lib.func(
      'StartDevice', // Native function name
      'int', // Return type: integer status code
      [ koffi.pointer(CallbackProto), 'char*' ] // Parameters: callback pointer, serial number
    );

    // CONNECTION CHECK BINDING - Device status verification function
    IsDeviceConnected_Func = lib.func(
      'IsDeviceConnected', // Native function name
      'int', // Return type: integer connection status
      [] // No parameters required
    );

    console.log('[HAL] Functions bound'); // Confirm successful function binding
  } catch (err) {
    console.error('[HAL] Function Binding Failed:', err.message); // Log binding failures
  }
}

// CALLBACK MANAGEMENT - Registered callback reference
let registeredCallback = null; // Reference to registered native callback

// STEP 3: EXPORTED HAL API - Public interface for hardware communication
// ------------------------------------------------------------
// Provides clean API for main process hardware management:
// - checkConnection: Verify hardware availability
// - start: Initialize hardware and begin data streaming
// - stop: Gracefully shutdown hardware communication
// - Implements robust error handling throughout
// ------------------------------------------------------------
module.exports = {
  /**
   * Checks if temperature hardware is connected and available
   * @function checkConnection
   * @returns {number} 0 for connected, 1 for disconnected
   * @description Calls native IsDeviceConnected function with graceful fallback
   */
  checkConnection: () => {
    if (IsDeviceConnected_Func) { // Check if function is bound
      try {
        return IsDeviceConnected_Func(); // Call native connection check
      } catch (e) { return 1; } // Return disconnected on error
    }
    return 1; // Default to disconnected if no function
  },

  /**
   * Initializes temperature hardware and begins real-time data streaming
   * @function start
   * @description Validates DLL availability, registers callbacks, starts hardware
   */
  start: () => {
    // AVAILABILITY CHECK - Ensure DLL and functions are ready
    if (!lib || !StartDevice_Func) {
      console.warn('[HAL] Cannot start: DLL not ready.'); // Log initialization failure
      return; // Exit early if not ready
    }

    // CONNECTION STATUS VERIFICATION - Check hardware before starting
    try {
      const connStatus = IsDeviceConnected_Func ? IsDeviceConnected_Func() : 1; // Get connection status
      console.log(
        `[HAL] Connection Check: ${connStatus} ${
          connStatus === 0 ? '(Connected)' : '(Not Connected)'
        }` // Log connection status
      );
    } catch (err) {
      console.error('[HAL] Connection check failed:', err.message); // Log connection check failure
    }

    // DATA HANDLER SETUP - Real-time temperature data processing
    // 2. JS Handler with Stale Data Filter
    let isFirstReading = true; // Flag for filtering stale initial data

    // TEMPERATURE CALLBACK - Real-time data processing function
    const onMeasurement = (fTemp) => {
      // STALE DATA FILTER - Remove initial 10.00°C reading from previous session
      // FILTER: If the very first reading is 10.00, it's stale data from the previous run.
      // We skip it so the logs start cleanly at 30.00.
      if (isFirstReading) {
        isFirstReading = false; // Clear first reading flag
        if (Math.abs(fTemp - 10.00) < 0.1) {
          return; // Skip stale 10.00°C reading
        }
      }

      const fahrenheit = (fTemp * 9/5) + 32; // Convert to Fahrenheit
      console.log(`[HAL] Real Reading: ${fTemp.toFixed(2)}°C (${fahrenheit.toFixed(2)}°F)`); // Log authentic hardware data
      // DATA VALIDATION - Filter out invalid temperature readings
      if (fTemp > -50 && fTemp < 200) { // Reasonable temperature range check
        store.updateTemperature(fTemp); // Update global temperature store
      }
    };

    // HARDWARE INITIALIZATION - Start device with callback registration
    try {
      console.log('[HAL] Registering callback...'); // Log callback registration attempt
      registeredCallback = koffi.register(onMeasurement, koffi.pointer(CallbackProto)); // Register JS callback with native DLL

      console.log('[HAL] Callback registered'); // Confirm successful callback registration
      console.log('[HAL] Calling StartDevice...'); // Log device initialization attempt
      
      // SERIAL NUMBER SETUP - Hardware identification for device communication
      const serialNumber = Buffer.alloc(32); // Allocate buffer for serial number
      serialNumber.write('E66480454F6D2F31', 'utf8'); // Write device serial number to buffer
      
      // DEVICE STARTUP - Initialize hardware with callback and serial number
      const startStatus = StartDevice_Func(registeredCallback, serialNumber); // Call native StartDevice function

      // START STATUS ANALYSIS - Interpret device initialization result
      if (startStatus === 0) {
        console.log('[HAL] SUCCESS: Hardware Started!'); // Log successful hardware startup
      } else {
        console.warn(`[HAL] StartDevice returned ${startStatus} (Expected for Virtual DLL)`); // Log expected virtual DLL behaviour
      }
    } catch (err) {
      console.error('[HAL] Error:', err.message); // Log initialization errors
    }
  },

  // HARDWARE SHUTDOWN - Graceful device termination
  // ============================================================================
  // Safely stops hardware communication and cleans up resources:
  // - Unregisters native callback to prevent memory leaks
  // - Clears callback reference for garbage collection
  // - Provides comprehensive error handling
  // - Ensures clean shutdown for hardware reconnection
  // ============================================================================
  stop: () => {
    if (registeredCallback) { // Check if callback is registered
      try {
        koffi.unregister(registeredCallback); // Unregister native callback
        registeredCallback = null; // Clear reference for garbage collection
        console.log('[HAL] Hardware Stopped (callback unregistered)'); // Log successful shutdown
        console.log('[HAL] Hardware Stopped (callback unregistered)'); // Log successful shutdown
      } catch (err) {
        console.error('[HAL] Stop error:', err.message); // Log shutdown errors
      }
    }
  }
};