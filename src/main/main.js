// Electron Main Process Entry Point - Temperature Plotter Application
// ============================================================================
process.noDeprecation = true; // Suppress N-API Deprecation Warnings on Windows
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initIpc } = require('./ipc/temperatureIpc');
const store = require('./state/temperatureStore'); // REQUIRED for 10.00 injection
const consoleColours = require('./utils/consoleColours'); // Enhanced console output

consoleColours.header('Temperature Plotter Starting');

if (require('electron-squirrel-startup')) {
    app.quit();
}

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
        consoleColours.info('Starting hardware monitoring...');
        this.checkInterval = setInterval(() => {
            this.checkHealth();
        }, 1000);
    }

    checkHealth() {
        const now = Date.now();
        const timeSinceLastUpdate = now - this.lastUpdate;
        
        if (!isHardwareMode) {
            if (now - this.lastReconnectionAttempt < 1000) return false;
            this.lastReconnectionAttempt = now;

            try {
                let hw = null;
                try {
                    hw = require('./dll/tempDll');
                } catch (e) { /* Hardware not available */ }

                if (hw && hw.checkConnection && hw.checkConnection() === 0) {
                    consoleColours.success('Hardware signal detected! Initiating switch...');
                    this.switchToHardware(hw);
                    return true;
                }

                if (!this.lastHardReset || (now - this.lastHardReset > 5000)) {
                    this.lastHardReset = now;
                    const dllPath = require.resolve('./dll/tempDll');
                    if (require.cache[dllPath]) {
                        consoleColours.status('Performing hard DLL refresh to check for new device...', 'info');
                        delete require.cache[dllPath];
                    }
                }
            } catch (e) { }
            return false;
        } 
        else {
            if (timeSinceLastUpdate > 5000) { 
                this.fallbackToSimulator();
                return false;
            }
            return true;
        }
    }

    switchToHardware(hardwareDevice) {
        consoleColours.status('Switching back to hardware mode', 'success');
        if (device && device.stop) {
            device.stop();
        }
        
        device = hardwareDevice;
        isHardwareMode = true;
        this.device = hardwareDevice;
        this.healthy = true;
        this.lastUpdate = Date.now();
        
        if (device.start) {
            device.start(); // This will trigger the 30.00 start in tempDll.js
        }
        
        notifyModeChange('hardware', 'Pico reconnected - switched to hardware mode');
    }

    updateLastUpdate() {
        this.lastUpdate = Date.now();
        this.healthy = true;
    }

    fallbackToSimulator() {
        // REQUIREMENT: Log the final "Disconnect" reading before switching
        consoleColours.warning('Hardware timeout detected. Injecting final 10.00 deg C reading.');
        store.updateTemperature(10.00); 

        if (this.checkInterval) clearInterval(this.checkInterval);
        
        if (this.device && this.device.stop) {
            try { this.device.stop(); } catch(e) { }
        }
        
        const simulator = require('./simulator');
        device = simulator;
        isHardwareMode = false;
        
        if (simulator.start) {
            simulator.start();
        }
        
        notifyModeChange('simulator', 'Hardware disconnected - automatic fallback');
        this.startMonitoring();
    }

    stop() {
        if (this.checkInterval) clearInterval(this.checkInterval);
    }
}

function notifyModeChange(mode, reason) {
    const win = BrowserWindow.getAllWindows()[0];
    if (win && !win.isDestroyed()) {
        win.webContents.send('mode:change', {
            mode,
            reason,
            timestamp: new Date().toISOString()
        });
    }
}

const USE_SIMULATOR = process.env.SIMULATOR === 'true';
let device;
let hardwareMonitor;
let isHardwareMode = false;

async function initializeDevice() {
    if (USE_SIMULATOR) {
        device = require('./simulator');
        isHardwareMode = false;
    } else {
        try {
            device = require('./dll/tempDll');
            isHardwareMode = true;
        } catch (e) {
            device = require('./simulator');
            isHardwareMode = false;
        }
    }
    
    hardwareMonitor = new HardwareMonitor(device);
    hardwareMonitor.startMonitoring();
    
    // Setup global access for IPC/DLL to update health
    global.hardwareMonitorInstance = hardwareMonitor;
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
};

app.whenReady().then(async () => {
    await initializeDevice();
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
});

app.on('before-quit', () => {
    if (hardwareMonitor) hardwareMonitor.stop();
    if (device && device.stop) device.stop();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Manual Force Hardware IPC
ipcMain.handle('force-hardware-mode', async () => {
    try {
        delete require.cache[require.resolve('./dll/tempDll')];
        const forcedDevice = require('./dll/tempDll');
        if (forcedDevice && forcedDevice.start) {
            if (device && device.stop) device.stop();
            device = forcedDevice;
            isHardwareMode = true;
            if (hardwareMonitor) hardwareMonitor.stop();
            hardwareMonitor = new HardwareMonitor(device);
            global.hardwareMonitorInstance = hardwareMonitor;
            hardwareMonitor.startMonitoring();
            device.start();
            notifyModeChange('hardware', 'Forced hardware mode activated');
            return { success: true };
        }
    } catch (e) {
        return { success: false, message: e.message };
    }
});

module.exports = {
    getCurrentDevice: () => ({ device, isHardwareMode, hardwareMonitor }),
    notifyModeChange
};