const { ipcMain, BrowserWindow, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const store = require('../state/temperatureStore');

const logPath = path.join(process.cwd(), 'temperature_telemetry.csv');

function initIpc() {
  // 1. Push Data to UI
  store.onUpdate((data) => {
    const win = BrowserWindow.getAllWindows()[0];
    if (win && !win.isDestroyed()) {
      win.webContents.send('temperature:update', data);
    }
    
    // 2. Persistent Logging (Background Telemetry)
    const latest = data.history.at(-1);
    if (latest) {
      // Create headers if file doesn't exist
      if (!fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, 'Date,Time,Temperature(C)\n');
      }

      // Convert Timestamp to Readable Date & Time
      const dateObj = new Date(latest.time);
      const date = dateObj.toLocaleDateString('en-GB'); // DD/MM/YYYY
      const time = dateObj.toLocaleTimeString('en-GB', { hour12: false }); // HH:MM:SS
      const temp = latest.temp.toFixed(2); // Round to 2 decimals

      // Append clean data
      fs.appendFileSync(logPath, `${date},${time},${temp}\n`);
    }
  });

  // 3. Secure User Export (Formatted for Humans)
  ipcMain.handle('save-csv', async () => {
    const { filePath } = await dialog.showSaveDialog({
      title: 'Export Temperature Data',
      defaultPath: 'session_log.csv',
      filters: [{ name: 'CSV Files', extensions: ['csv'] }]
    });

    if (!filePath) return { canceled: true };

    const { history } = store.get();

    // ✅ FIX: Convert raw timestamp to readable Date/Time string
    const csvContent = "Date,Time,Temperature(C)\n" + history.map(d => {
      const dateObj = new Date(d.time);
      const date = dateObj.toLocaleDateString('en-GB'); // DD/MM/YYYY
      const time = dateObj.toLocaleTimeString('en-GB', { hour12: false }); // HH:MM:SS
      const temp = d.temp.toFixed(2); // Round to 2 decimals
      
      return `${date},${time},${temp}`;
    }).join("\n");
    
    fs.writeFileSync(filePath, csvContent);
    return { success: true };
  });
}

module.exports = { initIpc };