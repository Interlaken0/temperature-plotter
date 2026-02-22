const { ipcMain, BrowserWindow, dialogue } = require('electron');
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
    
    // 2. Persistent Logging
    const latest = data.history.at(-1);
    if (latest) {
      if (!fs.existsSync(logPath)) {
        fs.writeFileSync(logPath, 'Date,Time,Temperature(C)\n');
      }

      const dateObj = new Date(latest.time);
      const date = dateObj.toLocaleDateString('en-GB');
      const time = dateObj.toLocaleTimeString('en-GB', { hour12: false });
      const temp = latest.temp.toFixed(2);

      fs.appendFileSync(logPath, `${date},${time},${temp}\n`);
    }

    // 3. Update hardware monitor if available
    const { getCurrentDevice } = require('../main');
    const { hardwareMonitor } = getCurrentDevice();
    if (hardwareMonitor && hardwareMonitor.healthy) {
      hardwareMonitor.updateLastUpdate();
    }
  });

  // 4. Secure User Export
  ipcMain.handle('save-csv', async () => {
    const { filePath } = await dialogue.showSaveDialogue({
      title: 'Export Temperature Data',
      defaultPath: 'session_log.csv',
      filters: [{ name: 'CSV Files', extensions: ['csv'] }]
    });

    if (!filePath) return { canceled: true };

    const { history } = store.get();

    const csvContent = 'Date,Time,Temperature(C)\n' + history.map(d => {
      const dateObj = new Date(d.time);
      const date = dateObj.toLocaleDateString('en-GB');
      const time = dateObj.toLocaleTimeString('en-GB', { hour12: false });
      const temp = d.temp.toFixed(2);
      
      return `${date},${time},${temp}`;
    }).join('\n');
    
    fs.writeFileSync(filePath, csvContent);
    return { success: true };
  });

  // 5. Get current device status
  ipcMain.handle('get-device-status', async () => {
    const { getCurrentDevice } = require('../main');
    const { device, isHardwareMode, hardwareMonitor } = getCurrentDevice();
    
    return {
      mode: isHardwareMode ? 'hardware' : 'simulator',
      healthy: hardwareMonitor ? hardwareMonitor.healthy : true,
      lastUpdate: hardwareMonitor ? hardwareMonitor.lastUpdate : Date.now(),
      deviceType: device.constructor.name
    };
  });

  // 6. Manual mode switch (for testing)
  ipcMain.handle('switch-mode', async (event, { mode }) => {
    const { getCurrentDevice, notifyModeChange } = require('../main');
    const { hardwareMonitor } = getCurrentDevice();
    
    // Stop current monitoring
    if (hardwareMonitor) {
      hardwareMonitor.stop();
    }
    
    // Switch device
    let newDevice;
    if (mode === 'simulator') {
      newDevice = require('../simulator');
      notifyModeChange('simulator', 'Manual switch to simulator');
    } else {
      try {
        newDevice = require('../dll/tempDll');
        notifyModeChange('hardware', 'Manual switch to hardware');
      } catch (e) {
        newDevice = require('../simulator');
        notifyModeChange('simulator', 'Hardware unavailable, switched to simulator');
      }
    }
    
    // Update global device reference
    const mainModule = require('../main');
    mainModule.device = newDevice;
    
    return { success: true, mode: mode === 'simulator' ? 'simulator' : 'hardware' };
  });
}

module.exports = { initIpc };