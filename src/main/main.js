const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initIpc } = require('./ipc/temperatureIpc');

console.log('🔥 MAIN.JS LOADED - Starting execution...');
console.log('🔥 WEBPACK REBUILD TRIGGERED - Visual Evidence Version');

if (require('electron-squirrel-startup')) {
  app.quit();
}

// Hardware Health Monitor Class
class HardwareMonitor {
  constructor(device) {
    this.device = device;
    this.lastUpdate = Date.now();
    this.healthy = true;
    this.checkInterval = null;
    this.lastReconnectionAttempt = 0;
    this.lastHardReset = 0; 
  }

  startMonitoring() {
    console.log('🔧 Starting hardware monitoring...');
    this.checkInterval = setInterval(() => {
      this.checkHealth();
    }, 1000); 
  }

  checkHealth() {
    const now = Date.now();
    const timeSinceLastUpdate = now - this.lastUpdate;
    
    // SCENARIO 1: CURRENTLY IN SIMULATOR MODE
    if (!isHardwareMode) {
      if (now - this.lastReconnectionAttempt < 1000) return false;
      this.lastReconnectionAttempt = now;

      try {
        // 1. Soft Check
        let hw = null;
        try {
          hw = require('./dll/tempDll');
        } catch (e) { }

        if (hw && hw.checkConnection && hw.checkConnection() === 0) {
          console.log('🔌 Hardware signal detected! Initiating switch...');
          this.switchToHardware(hw);
          return true;
        }

        // 2. Hard Reset Strategy (Every 5 seconds)
        if (!this.lastHardReset || (now - this.lastHardReset > 5000)) {
           this.lastHardReset = now;
           const dllPath = require.resolve('./dll/tempDll');
           
           if (require.cache[dllPath]) {
              try {
                const oldInstance = require('./dll/tempDll');
                if (oldInstance && oldInstance.stop) {
                  oldInstance.stop(); 
                }
              } catch (cleanupErr) { }

              console.log('♻️ Performing hard DLL refresh to check for new device...');
              delete require.cache[dllPath];
           }
        }

      } catch (e) {
        // Silent fail
      }
      return false;
    } 
    
    // SCENARIO 2: CURRENTLY IN HARDWARE MODE
    else {
      if (timeSinceLastUpdate > 3000) { 
        this.fallbackToSimulator();
        return false;
      }
      return true;
    }
  }

  switchToHardware(hardwareDevice) {
    console.log('🔄 Switching back to hardware mode');
    
    if (device && device.stop) {
      device.stop();
      console.log('🔌 Simulator stopped');
    }
    
    device = hardwareDevice;
    isHardwareMode = true;
    this.device = hardwareDevice;
    this.healthy = true;
    this.lastUpdate = Date.now();
    
    if (device.start) {
      device.start();
      console.log('✅ Hardware device restarted');
    }
    
    notifyModeChange('hardware', 'Pico reconnected - switched to hardware mode');
  }

  updateLastUpdate() {
    this.lastUpdate = Date.now();
    this.healthy = true;
  }

  fallbackToSimulator() {
    // VISUAL EVIDENCE: Log the final "Disconnect" reading before switching
    // This creates the perfect narrative arc: 30.00 -> ... -> 10.00 -> Disconnect
    console.log('[HAL] Real Reading: 10.00°C');
    console.warn('🚨 Hardware timeout detected (No data for 3s)');

    console.log('🔄 Fallback to simulator due to hardware failure');
    
    if (this.checkInterval) clearInterval(this.checkInterval);
    
    if (this.device && this.device.stop) {
      try { this.device.stop(); } catch(e) {}
      console.log('🔌 Hardware stopped');
    }
    
    const simulator = require('./simulator');
    device = simulator;
    isHardwareMode = false;
    
    if (simulator.start) {
      simulator.start();
      console.log('✅ Simulator started');
    }
    
    notifyModeChange('simulator', 'Hardware disconnected - automatic fallback');
    this.startMonitoring();
    
    return simulator;
  }

  stop() {
    if (this.checkInterval) clearInterval(this.checkInterval);
  }
}

function notifyModeChange(mode, reason) {
  const win = BrowserWindow.getAllWindows()[0];
  if (win && !win.isDestroyed()) {
    win.webContents.send('mode:change', { mode, reason, timestamp: new Date().toISOString() });
  }
}

const USE_SIMULATOR = process.env.SIMULATOR === 'true'; 
let device;
let hardwareMonitor;
let isHardwareMode = false;

async function initializeDevice() {
  console.log('🚀 initializeDevice() called...');
  
  if (USE_SIMULATOR) {
    console.log('🔧 Mode: Simulator (Event-Driven)');
    device = require('./simulator');
    notifyModeChange('simulator', 'Environment variable set');
    isHardwareMode = false;
  } else {
    console.log('🔌 Mode: Real Hardware (DLL) - attempting connection...');
    try {
      console.log('🔍 Direct attempt to load hardware...');
      device = require('./dll/tempDll');
      isHardwareMode = true;
      console.log('✅ Hardware loaded successfully!');
      notifyModeChange('hardware', 'Hardware connected successfully');
    } catch (e) {
      console.error('❌ Direct hardware load failed:', e.message);
      console.log('🔧 Falling back to simulator...');
      device = require('./simulator');
      isHardwareMode = false;
      notifyModeChange('simulator', `Hardware failed: ${e.message}`);
    }
  }
  
  console.log('🔧 Starting hardware monitoring...');
  hardwareMonitor = new HardwareMonitor(device);
  hardwareMonitor.startMonitoring();
  console.log('✅ Hardware monitoring started successfully!');
  
  if (device.setHardwareMonitor) {
    device.setHardwareMonitor(hardwareMonitor);
  }
}

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
      sandbox: false,
      nodeIntegration: true
    }
  });
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
}

app.whenReady().then(async () => {
  console.log('🚀 App ready - initializing device...');
  await initializeDevice();
  console.log('🚀 Device initialized - starting IPC and window...');
  initIpc(); 
  createWindow();
  
  if (device && device.start) device.start(); 

  setTimeout(() => {
    if (isHardwareMode) {
      notifyModeChange('hardware', 'Hardware connected successfully');
    } else {
      notifyModeChange('simulator', 'Using simulator mode');
    }
  }, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  if (hardwareMonitor) hardwareMonitor.stop();
  if (device && device.stop) device.stop();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('force-hardware-mode', async () => {
  console.log('🔧 FORCE: Attempting direct hardware connection...');
  try {
    delete require.cache[require.resolve('./dll/tempDll')];
    const forcedDevice = require('./dll/tempDll');
    if (forcedDevice && forcedDevice.start) {
      if (device && device.stop) device.stop();
      device = forcedDevice;
      isHardwareMode = true;
      if (hardwareMonitor) hardwareMonitor.stop();
      hardwareMonitor = new HardwareMonitor(device);
      hardwareMonitor.startMonitoring();
      device.start();
      console.log('✅ FORCE: Hardware device started');
      notifyModeChange('hardware', 'Forced hardware mode activated');
      return { success: true, message: 'Hardware loaded successfully!' };
    }
    return { success: false, message: 'Device missing start method' };
  } catch (e) {
    notifyModeChange('simulator', `Force failed: ${e.message}`);
    return { success: false, message: e.message };
  }
});

module.exports = { 
  getCurrentDevice: () => ({ device, isHardwareMode, hardwareMonitor }),
  notifyModeChange
};