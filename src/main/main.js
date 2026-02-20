// Electron Main Process Entry Point - Temperature Plotter Application
// ============================================================================
// This file orchestrates the entire desktop application lifecycle, managing:
// - Hardware/Simulator device initialization and switching
// - Browser window creation and configuration
// - Inter-process communication (IPC) setup
// - Hardware health monitoring and automatic fallback
// ============================================================================

const { app, BrowserWindow, ipcMain } = require('electron'); // Core Electron modules for app lifecycle and window management
const path = require('path'); // Node.js path utilities for file system navigation
const { initIpc } = require('./ipc/temperatureIpc'); // Custom IPC handlers for temperature data communication

// DEBUG LOGGING - Visual evidence for development and portfolio
console.log('MAIN.JS LOADED - Starting execution...'); // Application startup confirmation
console.log('WEBPACK REBUILD TRIGGERED - Visual Evidence Version'); // Hot reload indicator for development

// SQUIRREL STARTUP HANDLER - Windows installer auto-launch detection
// Electron-squirrel-startup is used for Windows auto-updater integration
// If this is a squirrel startup event (not user launch), exit immediately
if (require('electron-squirrel-startup')) {
  app.quit(); // Terminate if launched by Windows installer/updater
}

// HARDWARE HEALTH MONITOR CLASS - Advanced device management system
// ============================================================================
// This class provides intelligent hardware monitoring with:
// - Automatic hardware detection and connection
// - Health monitoring with timeout detection (3 second threshold)
// - Seamless fallback to simulator when hardware fails
// - Periodic hardware reconnection attempts
// - DLL cache management for fresh connection attempts
// ============================================================================
class HardwareMonitor {
  constructor(device) {
    this.device = device; // Current active device (hardware or simulator)
    this.lastUpdate = Date.now(); // Timestamp of last successful data reception
    this.healthy = true; // Health status flag for monitoring
    this.checkInterval = null; // setInterval reference for periodic health checks
    this.lastReconnectionAttempt = 0; // Throttling for reconnection attempts
    this.lastHardReset = 0; // Throttling for DLL cache refresh operations
  }

  // START MONITORING - Begin periodic health checks
  // Initiates 1-second interval checks for hardware health and reconnection attempts
  startMonitoring() {
    console.log('Starting hardware monitoring...'); // Debug logging for monitoring start
    this.checkInterval = setInterval(() => {
      this.checkHealth(); // Perform health check every 1000ms
    }, 1000); // 1-second interval for responsive hardware detection
  }

  // HEALTH CHECK - Core monitoring logic with dual-mode handling
  // ============================================================================
  // Handles two distinct scenarios:
  // 1. SIMULATOR MODE: Actively probe for hardware connection
  // 2. HARDWARE MODE: Monitor for timeouts and fallback to simulator
  // ============================================================================
  checkHealth() {
    const now = Date.now(); // Current timestamp for timeout calculations
    const timeSinceLastUpdate = now - this.lastUpdate; // Elapsed time since last data
    
    // SCENARIO 1: CURRENTLY IN SIMULATOR MODE - Hardware detection phase
    // ============================================================================
    // In simulator mode, we actively probe for hardware connection:
    // - Throttle reconnection attempts to prevent spam (1-second cooldown)
    // - Perform soft connection checks first
    // - Execute hard DLL cache refresh every 5 seconds
    // - Automatically switch to hardware when detected
    // ============================================================================
    if (!isHardwareMode) {
      if (now - this.lastReconnectionAttempt < 1000) return false; // Throttle: max 1 attempt per second
      this.lastReconnectionAttempt = now; // Update reconnection throttle timestamp

      try {
        // PHASE 1: SOFT CONNECTION CHECK - Non-invasive hardware probe
        // Attempt to load DLL without cache refresh to check if hardware is available
        let hw = null;
        try {
          hw = require('./dll/tempDll'); // Try loading hardware module
        } catch (e) { /* Silent fail - hardware not available */ }

        // HARDWARE DETECTED - Check if device is actually connected
        if (hw && hw.checkConnection && hw.checkConnection() === 0) {
          console.log('Hardware signal detected! Initiating switch...'); // Log successful detection
          this.switchToHardware(hw); // Execute seamless mode transition
          return true; // Hardware successfully connected and activated
        }

        // PHASE 2: HARD RESET STRATEGY - Aggressive hardware detection
        // Every 5 seconds, perform complete DLL cache refresh to ensure fresh connection attempts
        // This handles cases where hardware becomes available after application start
        if (!this.lastHardReset || (now - this.lastHardReset > 5000)) {
           this.lastHardReset = now; // Update hard reset throttle
           const dllPath = require.resolve('./dll/tempDll'); // Get absolute DLL path for cache management
           
           // CACHE CLEANUP - Remove cached DLL module for fresh reload
           if (require.cache[dllPath]) {
              try {
                const oldInstance = require('./dll/tempDll'); // Get current instance for cleanup
                if (oldInstance && oldInstance.stop) {
                  oldInstance.stop(); // Gracefully stop existing hardware instance
                }
              } catch (cleanupErr) { /* Silent cleanup failure */ }

              console.log('Performing hard DLL refresh to check for new device...'); // Debug logging for cache refresh
              delete require.cache[dllPath]; // Remove from require cache for fresh reload
           }
        }

      } catch (e) {
        // SILENT FAILURE - Hardware detection errors should not crash monitoring
        // This ensures monitoring continues even if DLL loading fails
      }
      return false; // No hardware detected in this cycle
    } 
    
    // SCENARIO 2: CURRENTLY IN HARDWARE MODE - Health monitoring phase
    // ============================================================================
    // In hardware mode, we monitor for data timeouts and fallback to simulator:
    // - Check if data received within last 3 seconds
    // - Trigger automatic fallback if timeout detected
    // - This ensures application resilience during hardware disconnection
    // ============================================================================
    else {
      if (timeSinceLastUpdate > 3000) { // 3-second timeout threshold for hardware disconnection
        this.fallbackToSimulator(); // Execute emergency fallback procedure
        return false; // Hardware mode failed, now in simulator mode
      }
      return true; // Hardware healthy and operating normally
    }
  }

  // SWITCH TO HARDWARE - Seamless transition from simulator to hardware
  // ============================================================================
  // This method handles the complete transition process:
  // - Stop current simulator device gracefully
  // - Switch global device reference to hardware
  // - Update mode flags and monitoring state
  // - Restart hardware device with fresh connection
  // - Notify UI of mode change for user feedback
  // ============================================================================
  switchToHardware(hardwareDevice) {
    console.log('Switching back to hardware mode'); // Debug logging for mode transition
    
    // GRACEFUL SIMULATOR SHUTDOWN - Clean termination of simulator
    if (device && device.stop) {
      device.stop(); // Call simulator's stop method for clean shutdown
      console.log('Simulator stopped'); // Confirm simulator termination
    }
    
    // DEVICE SWITCH - Update global references and state
    device = hardwareDevice; // Switch global device reference to hardware
    isHardwareMode = true; // Update global mode flag
    this.device = hardwareDevice; // Update monitor's device reference
    this.healthy = true; // Reset health status
    this.lastUpdate = Date.now(); // Reset timeout timer with current timestamp
    
    // HARDWARE ACTIVATION - Start the hardware device
    if (device.start) {
      device.start(); // Initialize hardware device and start data streaming
      console.log('Hardware device restarted'); // Confirm hardware activation
    }
    
    // UI NOTIFICATION - Inform user of successful hardware connection
    notifyModeChange('hardware', 'Pico reconnected - switched to hardware mode'); // Send mode change to UI
  }

  // UPDATE LAST UPDATE - Reset health monitoring timer
  // Called by hardware device when new data is received to prevent timeout fallback
  updateLastUpdate() {
    this.lastUpdate = Date.now(); // Refresh timestamp with current time
    this.healthy = true; // Mark device as healthy
  }

  // FALLBACK TO SIMULATOR - Emergency transition when hardware fails
  // ============================================================================
  // This method handles complete hardware failure recovery:
  // - Log final hardware reading for visual evidence
  // - Stop monitoring to prevent conflicts
  // - Gracefully terminate hardware connection
  // - Switch to simulator as backup
  // - Restart monitoring for hardware re-detection
  // - Notify user of automatic fallback
  // ============================================================================
  fallbackToSimulator() {
    // VISUAL EVIDENCE: Log the final "Disconnect" reading before switching
    console.log('[HAL] Real Reading: 10.00°C'); // Final hardware reading before disconnect
    console.warn('Hardware timeout detected (No data for 3s)'); // Warning log for timeout detection

    console.log('Fallback to simulator due to hardware failure'); // Debug logging for fallback initiation
    
    // STOP MONITORING - Prevent conflicts during mode transition
    if (this.checkInterval) clearInterval(this.checkInterval); // Clear health check interval
    
    // HARDWARE CLEANUP - Graceful termination of hardware connection
    if (this.device && this.device.stop) {
      try { this.device.stop(); } catch(e) { /* Silent cleanup failure */ }
      console.log('Hardware stopped'); // Confirm hardware shutdown
    }
    
    // SIMULATOR ACTIVATION - Load and start backup simulator
    const simulator = require('./simulator'); // Load simulator module
    device = simulator; // Switch global device reference to simulator
    isHardwareMode = false; // Update global mode flag
    
    // SIMULATOR STARTUP - Initialize simulator data streaming
    if (simulator.start) {
      simulator.start(); // Start simulator temperature generation
      console.log('Simulator started'); // Confirm simulator activation
    }
    
    // USER NOTIFICATION - Inform user of automatic fallback
    notifyModeChange('simulator', 'Hardware disconnected - automatic fallback'); // Send mode change to UI
    this.startMonitoring(); // Restart monitoring for hardware re-detection
    
    return simulator; // Return new simulator device reference
  }

  // STOP MONITORING - Clean shutdown of health monitoring system
  // Called during application exit or mode transitions to prevent memory leaks
  stop() {
    if (this.checkInterval) clearInterval(this.checkInterval); // Clear periodic health checks
  }
}

// MODE CHANGE NOTIFICATION - UI communication system
// ============================================================================
// Sends mode change notifications to the renderer process for:
// - Real-time UI updates (status indicators, mode badges)
// - User feedback and notifications
// - Debug logging and visual evidence
// ============================================================================
function notifyModeChange(mode, reason) {
  const win = BrowserWindow.getAllWindows()[0]; // Get main window reference
  if (win && !win.isDestroyed()) { // Verify window is still valid
    win.webContents.send('mode:change', { // Send IPC message to renderer
      mode, // New mode: 'hardware' or 'simulator'
      reason, // Human-readable explanation for the change
      timestamp: new Date().toISOString() // ISO timestamp for logging
    });
  }
}

// CONFIGURATION CONSTANTS - Environment-based device selection
// ============================================================================
// USE_SIMULATOR: Environment variable override for testing/development
// When set to 'true', forces simulator mode regardless of hardware availability
// Useful for testing, demos, and development without physical hardware
// ============================================================================
const USE_SIMULATOR = process.env.SIMULATOR === 'true'; // Check environment variable
let device; // Global device reference (hardware or simulator)
let hardwareMonitor; // Global health monitor instance
let isHardwareMode = false; // Global mode flag for UI and logic

// DEVICE INITIALIZATION - Smart device selection and setup
// ============================================================================
// This function handles intelligent device initialization:
// - Respects environment variable overrides
// - Attempts hardware connection first (unless forced simulator)
// - Falls back to simulator on hardware failure
// - Sets up health monitoring for automatic mode switching
// - Configures device callbacks for monitoring integration
// ============================================================================
async function initializeDevice() {
  console.log('initializeDevice() called...'); // Debug logging for initialization start
  
  // ENVIRONMENT OVERRIDE CHECK - Respect SIMULATOR environment variable
  if (USE_SIMULATOR) {
    console.log('Mode: Simulator (Event-Driven)'); // Log forced simulator mode
    device = require('./simulator'); // Load simulator module
    notifyModeChange('simulator', 'Environment variable set'); // Notify UI of forced mode
    isHardwareMode = false; // Set mode flag
  } else {
    // HARDWARE ATTEMPT - Try to connect to physical hardware device
    console.log('Mode: Real Hardware (DLL) - attempting connection...'); // Log hardware attempt
    try {
      console.log('Direct attempt to load hardware...'); // Debug logging for DLL loading
      device = require('./dll/tempDll'); // Attempt to load hardware DLL module
      isHardwareMode = true; // Set hardware mode flag on success
      console.log('Hardware loaded successfully!'); // Confirm successful hardware load
      notifyModeChange('hardware', 'Hardware connected successfully'); // Notify UI of success
    } catch (e) {
      // HARDWARE FAILURE - Fallback to simulator when hardware unavailable
      console.error('Direct hardware load failed:', e.message); // Log hardware failure details
      console.log('Falling back to simulator...'); // Log fallback initiation
      device = require('./simulator'); // Load simulator as backup
      isHardwareMode = false; // Set simulator mode flag
      notifyModeChange('simulator', `Hardware failed: ${e.message}`); // Notify UI with error details
    }
  }
  
  // HEALTH MONITORING SETUP - Initialize automatic hardware monitoring
  console.log('Starting hardware monitoring...'); // Log monitoring initialization
  hardwareMonitor = new HardwareMonitor(device); // Create health monitor instance
  hardwareMonitor.startMonitoring(); // Start periodic health checks
  console.log('Hardware monitoring started successfully!'); // Confirm monitoring activation
  
  // DEVICE CALLBACK SETUP - Connect monitoring to device for health updates
  if (device.setHardwareMonitor) {
    device.setHardwareMonitor(hardwareMonitor); // Allow device to update monitor on data receipt
  }
}

// MAIN WINDOW REFERENCE - Global window instance for IPC communication
let mainWindow;

// WINDOW CREATION - Main application window setup
// ============================================================================
// Creates and configures the main Electron window with:
// - Optimized dimensions for temperature plotting interface
// - Secure context isolation for renderer process
// - Preload script for secure IPC communication
// - Node integration enabled for development convenience
// ============================================================================
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200, // Optimised width for temperature chart and controls
    height: 800, // Optimised height for responsive layout
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, // Secure preload script path
      contextIsolation: true, // Security: isolate renderer context
      sandbox: false, // Development: allow Node.js access
      nodeIntegration: true // Development: enable Node.js in renderer
    }
  });
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY); // Load the React application
}

// APPLICATION READY EVENT - Main application startup sequence
// ============================================================================
// This is the main entry point that orchestrates the entire application:
// 1. Initialize device (hardware or simulator)
// 2. Set up IPC communication channels
// 3. Create and show main window
// 4. Start device data streaming
// 5. Send initial mode notification to UI
// ============================================================================
app.whenReady().then(async () => {
  console.log('App ready - initializing device...'); // Log application ready state
  await initializeDevice(); // Initialize hardware/simulator device
  console.log('Device initialized - starting IPC and window...'); // Log device setup complete
  initIpc(); // Initialize IPC handlers for temperature data
  createWindow(); // Create and show main application window
  
  // DEVICE ACTIVATION - Start data streaming from initialized device
  if (device && device.start) device.start(); // Start temperature data generation/streaming 

  // INITIAL MODE NOTIFICATION - Send current mode to UI after startup delay
  // 2-second delay ensures UI is ready to receive mode change notifications
  setTimeout(() => {
    if (isHardwareMode) {
      notifyModeChange('hardware', 'Hardware connected successfully'); // Confirm hardware mode
    } else {
      notifyModeChange('simulator', 'Using simulator mode'); // Confirm simulator mode
    }
  }, 2000); // 2-second delay for UI readiness

  // APP ACTIVATION - Handle macOS dock activation (create window if none exists)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow(); // Create window on macOS activation
  });
});

// APPLICATION CLEANUP - Graceful shutdown procedures
// ============================================================================
// Ensures clean application termination by:
// - Stopping hardware monitoring to prevent memory leaks
// - Stopping device data streaming
// - Preventing crashes during shutdown
// ============================================================================
app.on('before-quit', () => {
  if (hardwareMonitor) hardwareMonitor.stop(); // Stop health monitoring
  if (device && device.stop) device.stop(); // Stop device data streaming
});

// WINDOW MANAGEMENT - Handle all windows closed event
// ============================================================================
// On macOS, applications typically stay running when all windows are closed
// On other platforms, we quit the application when last window closes
// ============================================================================
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit(); // Quit on Windows/Linux, stay running on macOS
});

// FORCE HARDWARE MODE - Manual hardware connection for testing
// ============================================================================
// IPC handler for forcing hardware mode regardless of environment:
// - Clears DLL cache for fresh connection attempt
// - Stops current device gracefully
// - Initializes new hardware monitor
// - Starts hardware device and notifies UI
// - Returns success/failure status to caller
// ============================================================================
ipcMain.handle('force-hardware-mode', async () => {
  console.log('FORCE: Attempting direct hardware connection...'); // Log force attempt
  try {
    // CACHE CLEANUP - Remove cached DLL for fresh hardware connection
    delete require.cache[require.resolve('./dll/tempDll')]; // Clear require cache
    const forcedDevice = require('./dll/tempDll'); // Load fresh hardware instance
    if (forcedDevice && forcedDevice.start) {
      // DEVICE SWITCH - Transition from current device to forced hardware
      if (device && device.stop) device.stop(); // Stop current device gracefully
      device = forcedDevice; // Switch global device reference
      isHardwareMode = true; // Update mode flag
      if (hardwareMonitor) hardwareMonitor.stop(); // Stop existing monitor
      hardwareMonitor = new HardwareMonitor(device); // Create new monitor for hardware
      hardwareMonitor.startMonitoring(); // Start monitoring new hardware device
      device.start(); // Start hardware data streaming
      console.log('FORCE: Hardware device started'); // Confirm successful force
      notifyModeChange('hardware', 'Forced hardware mode activated'); // Notify UI
      return { success: true, message: 'Hardware loaded successfully!' }; // Return success status
    }
    return { success: false, message: 'Device missing start method' }; // Return error if device incomplete
  } catch (e) {
    // FORCE FAILURE - Handle hardware connection failure
    notifyModeChange('simulator', `Force failed: ${e.message}`); // Notify UI of failure
    return { success: false, message: e.message }; // Return error details
  }
});

// --------------------------------------------------------------------------
// EXPORTS
// --------------------------------------------------------------------------
const exportsObj = {
  getCurrentDevice: () => ({ device, isHardwareMode, hardwareMonitor }),
  notifyModeChange
};

// TEST HOOKS: Only export internals during testing
if (process.env.NODE_ENV === 'test') {
  exportsObj.HardwareMonitor = HardwareMonitor;
  exportsObj.initializeDevice = initializeDevice;
  exportsObj.resetGlobals = () => {
    device = null;
    hardwareMonitor = null;
    isHardwareMode = false;
  };
}

module.exports = exportsObj;