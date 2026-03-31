/**
 * @file Electron Main Process Entry Point
 * @module main
 * @description Core application logic, window management, and hardware monitoring coordination
 */

// Electron Main Process Entry Point - AMF-Temperature-Plotter Application
// ============================================================================
process.noDeprecation = true; 
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { initIpc } = require('./ipc/temperatureIpc');
const store = require('./state/temperatureStore'); 
const consoleColours = require('./utils/consoleColours'); 

consoleColours.header('AMF-Temperature-Plotter Starting');

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
                } catch (e) { /* Expected when hardware is unplugged */ }

                if (hw && hw.checkConnection && hw.checkConnection() === 0) {
                    consoleColours.success('Hardware signal detected! Initiating switch...');
                    this.switchToHardware(hw);
                    return true;
                }

                if (!this.lastHardReset || (now - this.lastHardReset > 5000)) {
                    this.lastHardReset = now;
                    const dllPath = require.resolve('./dll/tempDll');
                    if (require.cache[dllPath]) {
                        delete require.cache[dllPath];
                    }
                }
            } catch (e) { consoleColours.error('Health check error: ' + e.message); }
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
        if (device && device.stop) device.stop();
        
        device = hardwareDevice;
        isHardwareMode = true;
        this.device = hardwareDevice;
        this.healthy = true;
        this.lastUpdate = Date.now();
        
        if (device.start) device.start(); 
        notifyModeChange('hardware', 'Pico reconnected - switched to hardware mode');
    }

    updateLastUpdate() {
        this.lastUpdate = Date.now();
        this.healthy = true;
    }

    fallbackToSimulator() {
        consoleColours.warning('Hardware timeout detected. Hardware DLL dropped connection.');
        if (this.checkInterval) clearInterval(this.checkInterval);
        if (this.device && this.device.stop) {
            try { this.device.stop(); } catch(e) { consoleColours.error('Error stopping device: ' + e.message); }
        }
        
        const simulator = require('./simulator');
        device = simulator;
        isHardwareMode = false;
        
        if (simulator.start) simulator.start();
        notifyModeChange('simulator', 'Hardware disconnected - automatic fallback');
        this.startMonitoring();
    }

    stop() {
        if (this.checkInterval) clearInterval(this.checkInterval);
    }
}

function notifyModeChange(mode, reason) {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0 && !windows[0].isDestroyed()) {
        windows[0].webContents.send('mode:change', { mode, reason, timestamp: new Date().toISOString() });
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
            consoleColours.error('Failed to load hardware DLL on startup: ' + e.message);
            device = require('./simulator');
            isHardwareMode = false;
        }
    }
    
    hardwareMonitor = new HardwareMonitor(device);
    hardwareMonitor.startMonitoring();
    global.hardwareMonitorInstance = hardwareMonitor;
}

let mainWindow;

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            // CRITICAL SECURITY FIXES APPLIED HERE
            contextIsolation: true,
            sandbox: true,
            nodeIntegration: false 
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
        if (isHardwareMode) notifyModeChange('hardware', 'Hardware connected successfully');
        else notifyModeChange('simulator', 'Using simulator mode');
    }, 2000);
});

app.on('before-quit', () => {
    if (hardwareMonitor) hardwareMonitor.stop();
    if (device && device.stop) device.stop();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

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
        consoleColours.error('Force hardware failed: ' + e.message);
        return { success: false, message: e.message };
    }
});

module.exports = {
    getCurrentDevice: () => ({ device, isHardwareMode, hardwareMonitor }),
    notifyModeChange
};