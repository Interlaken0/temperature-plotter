const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  // Live Data Stream
  onTemperature: (callback) => 
    ipcRenderer.on('temperature:update', (_, data) => callback(data)),

  // Secure File System Action
  saveCSV: () => ipcRenderer.invoke('save-csv')
});