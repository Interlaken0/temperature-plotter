/**
 * @file Secure IPC bridge for Electron application
 * @module preload
 * @description Context-isolated preload script for secure main/renderer communication
 */

// ELECTRON PRELOAD SCRIPT - Secure IPC Bridge Architecture
// ============================================================================
// This script creates a secure bridge between the main and renderer processes:
// - Uses contextBridge to safely expose APIs to renderer
// - Provides controlled access to system functionality
// - Implements secure IPC communication patterns
// - Prevents direct Node.js access from renderer
// - Demonstrates professional Electron security practices
// ============================================================================

const { contextBridge, ipcRenderer } = require('electron'); // Electron modules for secure IPC

// CONTEXT BRIDGE SETUP - Secure API exposure to renderer process interface
// ============================================================================
contextBridge.exposeInMainWorld('api', {
  
  // TEMPERATURE DATA STREAMING - Real-time data subscription
  // Registers callback and returns a cleanup function to prevent memory leaks
  onTemperature: (callback) => {
    const subscription = (_, data) => callback(data);
    ipcRenderer.on('temperature:update', subscription);
    // Return cleanup function to satisfy React useEffect cleanup requirements
    return () => ipcRenderer.removeListener('temperature:update', subscription);
  },

  // MODE CHANGE NOTIFICATIONS - Device status updates
  // Registers callback and returns a cleanup function to prevent memory leaks
  onModeChange: (callback) => {
    const subscription = (_, data) => callback(data);
    ipcRenderer.on('mode:change', subscription);
    // Return cleanup function
    return () => ipcRenderer.removeListener('mode:change', subscription);
  },

  // DEVICE STATUS QUERY - Current device information
  // Returns current device status, mode, and health information
  getDeviceStatus: () => ipcRenderer.invoke('get-device-status'), 

  // MANUAL MODE SWITCHING - Manual device control
  // Allows manual switching between hardware and simulator modes
  switchMode: (mode) => ipcRenderer.invoke('switch-mode', { mode }), 

  // FORCE HARDWARE MODE - Development and testing override
  // Forces hardware mode regardless of environment or hardware availability
  forceHardwareMode: () => ipcRenderer.invoke('force-hardware-mode'), 

  // SECURE FILE SYSTEM ACTION - CSV data export
  // Triggers secure CSV file save operation from main process
  saveCSV: () => ipcRenderer.invoke('save-csv') 
});