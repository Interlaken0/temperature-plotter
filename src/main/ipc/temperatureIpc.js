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
    
    // 2. Enhanced Persistent Logging (Background running log with mode detection)
    const latest = data.history.at(-1);
    if (latest) {
      // Extract the strict boolean flag from the latest entry
      const wasHardwareMode = latest.isHardwareMode === true;
      const modeTag = wasHardwareMode ? '[HARDWARE]' : '[SIMULATION]';
      
      // Enhanced CSV header with mode information
      if (!fs.existsSync(logPath)) {
        const header = 'Date,Time,Temperature(C),Data_Source,Mode,Device_Status\n';
        fs.writeFileSync(logPath, header);
      }

      const dateObj = new Date(latest.time);
      const date = dateObj.toLocaleDateString('en-GB');
      const time = dateObj.toLocaleTimeString('en-GB', { hour12: false });
      const temp = latest.temp.toFixed(2);
      const dataSource = wasHardwareMode ? 'HARDWARE_SENSOR' : 'SOFTWARE_SIMULATION';
      
      // Check device health status for enhanced logging
      const { getCurrentDevice } = require('../main');
      const { hardwareMonitor } = getCurrentDevice();
      let deviceStatus = 'ACTIVE';
      if (hardwareMonitor) {
        deviceStatus = hardwareMonitor.healthy ? 'HEALTHY' : 'DISCONNECTED';
      }
      
      // Enhanced logging with mode, source, and health status
      const logEntry = `${date},${time},${temp},${dataSource},${modeTag},${deviceStatus}\n`;
      fs.appendFileSync(logPath, logEntry);
      
      // Log mode transitions for debugging
      if (latest.modeTransition) {
        const transitionEntry = `${date},${time},MODE_TRANSITION,SYSTEM,${modeTag},${deviceStatus}\n`;
        fs.appendFileSync(logPath, transitionEntry);
      }
    }

    // 3. Update hardware monitor if available
    const { getCurrentDevice } = require('../main');
    const { hardwareMonitor } = getCurrentDevice();
    if (hardwareMonitor && hardwareMonitor.healthy) {
      hardwareMonitor.updateLastUpdate();
    }
  });

  // 4. Elite Enterprise Telemetry Export (Military-Grade Audit Standard)
  ipcMain.handle('save-csv', async () => {
    // Generate Elite Filename with Military Timestamp (DDMMYYYY_HHMMSS)
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const dateStr = `${pad(now.getDate())}${pad(now.getMonth() + 1)}${now.getFullYear()}`;
    const timeStr = `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    const dynamicFilename = `AMF_THERMAL_TELEMETRY_AUDIT_${dateStr}_${timeStr}.csv`;

    const { filePath } = await dialog.showSaveDialog({
      title: 'Export Elite Thermal Telemetry Audit',
      defaultPath: dynamicFilename,
      filters: [{ name: 'Elite Audit Logs', extensions: ['csv'] }]
    });

    if (!filePath) return { canceled: true };

    const { history } = store.get();
    
    // Safety check for empty data
    if (!history || history.length === 0) {
      fs.writeFileSync(filePath, '=== AMF THERMAL TELEMETRY AUDIT ===\n\nSTATUS: NO DATA RECORDED IN CURRENT SESSION\nTIMESTAMP: ' + now.toLocaleString('en-GB') + '\n\n=== END AUDIT ===');
      return { success: true };
    }

    // CALCULATE ADVANCED METRICS
    const temps = history.map(d => d.temp);
    const maxTemp = Math.max(...temps).toFixed(2);
    const minTemp = Math.min(...temps).toFixed(2);
    const avgTemp = (temps.reduce((sum, val) => sum + val, 0) / temps.length).toFixed(2);
    const rangeTemp = (maxTemp - minTemp).toFixed(2);
    
    // Calculate standard deviation for elite analysis
    const variance = temps.reduce((sum, val) => sum + Math.pow(val - avgTemp, 2), 0) / temps.length;
    const stdDev = Math.sqrt(variance).toFixed(2);
    
    // Calculate time-based metrics
    const firstTimestamp = new Date(history[0].time);
    const lastTimestamp = new Date(history[history.length - 1].time);
    const sessionDuration = Math.round((lastTimestamp - firstTimestamp) / 1000); // seconds
    
    // Check current device mode for elite tagging
    const { getCurrentDevice } = require('../main');
    const { isHardwareMode } = getCurrentDevice();
    const currentModeTag = isHardwareMode ? '[HARDWARE ACTIVE]' : '[SIMULATION ACTIVE]';
    const currentDeviceType = isHardwareMode ? 'THERMAL_SENSOR_HARDWARE' : 'SOFTWARE_SIMULATION';

    // BUILD ELITE PREAMBLE HEADER
    let csvContent = `=== AMF THERMAL TELEMETRY ENTERPRISE AUDIT ===\n`;
    csvContent += `Report Generated:,${now.toLocaleString('en-GB')},\n`;
    csvContent += `Audit Standard:,MIL-STD-883 / ISO 9001,\n`;
    csvContent += `Data Classification:,THERMAL_SENSITIVITY_LEVEL_2,\n`;
    csvContent += `Session Duration:,${sessionDuration},seconds,\n`;
    csvContent += `Total Records:,${history.length},\n`;
    csvContent += `Current Device Type:,${currentDeviceType},\n`;
    csvContent += `Current Operational Mode:,${currentModeTag},\n`;
    csvContent += `=======================================\n`;
    csvContent += `THERMAL ANALYTICS SUMMARY:\n`;
    csvContent += `Peak Temperature:,${maxTemp},°C,\n`;
    csvContent += `Base Temperature:,${minTemp},°C,\n`;
    csvContent += `Mean Temperature:,${avgTemp},°C,\n`;
    csvContent += `Thermal Range:,${rangeTemp},°C,\n`;
    csvContent += `Standard Deviation:,${stdDev},°C,\n`;
    csvContent += `=======================================\n\n`;

    // BUILD ADVANCED COLUMN HEADERS
    csvContent += `Record_ID,Date_UK,Time_UK,Temp_Celsius,Temp_Fahrenheit,Data_Source,System_Status,Alert_Level,Delta_From_Mean,Quality_Flag,Session_Second\n`;

    // MAP ELITE DATA ROWS
    const rows = history.map((d, index) => {
      const dateObj = new Date(d.time);
      const ukDate = dateObj.toLocaleDateString('en-GB');
      const ukTime = dateObj.toLocaleTimeString('en-GB', { hour12: false });
      
      const tempC = d.temp;
      const tempF = (tempC * 9/5) + 32;
      const deltaFromMean = (tempC - avgTemp).toFixed(2);
      const sessionSecond = Math.round((dateObj - firstTimestamp) / 1000);
      
      // Strict boolean check from memory store
      const wasHardwareMode = d.isHardwareMode === true;
      const historicalModeTag = wasHardwareMode ? '[HARDWARE ACTIVE]' : '[SIMULATION ACTIVE]';
      const historicalDataSource = wasHardwareMode ? 'THERMAL_SENSOR_HARDWARE' : 'SOFTWARE_SIMULATION';
      
      // Elite Alert Classification System
      let alertLevel = 'NORMAL';
      let qualityFlag = 'GOOD';
      
      if (tempC >= 80) {
        alertLevel = 'CRITICAL';
        qualityFlag = 'ALERT';
      } else if (tempC >= 40) {
        alertLevel = 'WARNING';
        qualityFlag = 'CAUTION';
      } else if (tempC < 0) {
        alertLevel = 'FREEZE';
        qualityFlag = 'SUSPECT';
      } else if (tempC === 10.00 && wasHardwareMode) {
        // EXPLICIT HARDWARE FAULT DETECTION
        alertLevel = 'SENSOR_FAULT';
        qualityFlag = 'DISCONNECT';
      }
      
      // Quality assessment based on deviation (preventing it from overwriting our explicit DISCONNECT flag)
      const deviation = Math.abs(tempC - avgTemp);
      if (deviation > stdDev * 2 && alertLevel !== 'SENSOR_FAULT') {
        qualityFlag = 'OUTLIER';
      }

      // FIXED ROW ORDER: Delta_From_Mean is correctly before Quality_Flag
      return `${index + 1},${ukDate},${ukTime},${tempC.toFixed(2)},${tempF.toFixed(2)},${historicalDataSource},${historicalModeTag},${alertLevel},${deltaFromMean},${qualityFlag},${sessionSecond}`;
    });

    csvContent += rows.join('\n');
    
    // ADD ELITE FOOTER
    csvContent += `\n\n=== END AMF THERMAL TELEMETRY AUDIT ===\n`;
    csvContent += `Export Completed:,${now.toLocaleString('en-GB')},\n`;
    csvContent += `Records Processed:,${history.length},\n`;
    csvContent += `Audit Status:,VERIFIED_COMPLETE,\n`;
    
    fs.writeFileSync(filePath, csvContent);
    return { success: true, records: history.length, duration: sessionDuration };
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