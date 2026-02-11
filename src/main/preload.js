const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Live Data Stream
  onTemperature: (callback) => 
    ipcRenderer.on('temperature:update', (_, data) => callback(data)),

  // Mode change notifications
  onModeChange: (callback) =>
    ipcRenderer.on('mode:change', (_, data) => callback(data)),

  // Device status monitoring
  getDeviceStatus: () => ipcRenderer.invoke('get-device-status'),

  // Manual mode switching (for testing)
  switchMode: (mode) => ipcRenderer.invoke('switch-mode', { mode }),

  // Force hardware mode
  forceHardwareMode: () => ipcRenderer.invoke('force-hardware-mode'),

  // Secure File System Action
  saveCSV: () => ipcRenderer.invoke('save-csv')
});