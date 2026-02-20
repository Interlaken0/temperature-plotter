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
// Exposes a controlled set of APIs to the renderer process:
// - Temperature data streaming with event listeners
// - Mode change notifications for UI updates
// - Device status monitoring and management
// - Manual mode switching for testing scenarios
// - Force hardware mode for development
// CSV EXPORT - Secure file system accessrations
// ============================================================================
contextBridge.exposeInMainWorld('api', {
  // TEMPERATURE DATA STREAMING - Real-time data subscriptionure updates
  // Registers callback for continuous temperature data from hardware/simulator
  onTemperature: (callback) => 
    ipcRenderer.on('temperature:update', (_, data) => callback(data)), // Forward temperature data to callback

  // MODE CHANGE NOTIFICATIONS - Device status updates/simulator mode updates
  // Registers callback for mode change events (hardware simulator switching)
  onModeChange: (callback) =>
    ipcRenderer.on('mode:change', (_, data) => callback(data)), // Forward mode changes to callback

  // DEVICE STATUS QUERY - Current device information
  // Returns current device status, mode, and health information
  getDeviceStatus: () => ipcRenderer.invoke('get-device-status'), // Query device status from main process

  // MANUAL// MODE SWITCHING - Manual device control
  // Allows manual switching between hardware and simulator modes
  switchMode: (mode) => ipcRenderer.invoke('switch-mode', { mode }), // Request mode change to main process

  // FORCE HARDWARE MODE - Development and testing override
  // Forces hardware mode regardless of environment or hardware availability
  forceHardwareMode: () => ipcRenderer.invoke('force-hardware-mode'), // HARDWARE MODE FORCE - Direct hardware connection

  // SECURE FILE SYSTEM ACTION - CSV data export
  // Triggers secure CSV file save operation from main process
  saveCSV: () => ipcRenderer.invoke('save-csv') // Request CSV export with secure file access
});