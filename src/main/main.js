const { app, BrowserWindow } = require('electron');
const path = require('path');
const { initIpc } = require('./ipc/temperatureIpc');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// 1. Environment Switch (Distinction Feature)
const USE_SIMULATOR = process.env.SIMULATOR !== 'false';

// 2. Load Device Strategy
let device;
if (USE_SIMULATOR) {
  console.log('🔧 Mode: Simulator (Event-Driven)');
  device = require('./simulator');
} else {
  console.log('🔌 Mode: Real Hardware (DLL)');
  device = require('./dll/tempDll');
}

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true, // Security: High
      sandbox: true,          // Security: High
      nodeIntegration: false  // Security: High
    },
  });

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  
  // mainWindow.webContents.openDevTools(); // Uncomment to debug
};

app.whenReady().then(() => {
  initIpc(); // Initialize Secure IPC
  createWindow();
  device.start(); // Start Data Stream

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('before-quit', () => {
  device.stop();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});