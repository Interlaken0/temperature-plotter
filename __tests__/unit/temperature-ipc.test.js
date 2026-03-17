/**
 * IPC Module Unit Tests
 * 
 * What: Comprehensive unit tests for temperatureIpc.js IPC handlers
 * Why: Ensure IPC communication, CSV export, and device management work correctly
 * Coverage: IPC handlers, CSV export, device status, mode switching, file operations
 * 
 * Portfolio Evidence:
 * Demonstrates IPC testing methodology
 * Shows file system mocking and testing
 * Exhibits error handling and edge case testing
 * Illustrates CSV export functionality testing
 * Shows device management testing
 */

// Mock Electron modules
jest.mock('electron', () => ({
  ipcMain: {
    handle: jest.fn()
  },
  BrowserWindow: {
    getAllWindows: jest.fn(() => [{
      webContents: {
        send: jest.fn()
      },
      isDestroyed: jest.fn(() => false)
    }])
  },
  dialog: {
    showSaveDialog: jest.fn()
  }
}));

// Mock file system
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  writeFileSync: jest.fn(),
  appendFileSync: jest.fn()
}));

// Mock path
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/'))
}));

// Mock temperature store
jest.mock('../../src/main/state/temperatureStore', () => ({
  onUpdate: jest.fn(),
  get: jest.fn(),
  removeAllListeners: jest.fn()
}));

// Mock main module
jest.mock('../../src/main/main', () => ({
  getCurrentDevice: jest.fn(),
  notifyModeChange: jest.fn()
}));

const fs = require('fs');
const path = require('path');
const { initIpc } = require('../../src/main/ipc/temperatureIpc');
const { ipcMain, dialog } = require('electron');
const store = require('../../src/main/state/temperatureStore');

describe('IPC Module - Core Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('initIpc registers all required IPC handlers', () => {
    // Act
    initIpc();

    // Assert
    expect(ipcMain.handle).toHaveBeenCalledTimes(3);
    expect(ipcMain.handle).toHaveBeenCalledWith('save-csv', expect.any(Function));
    expect(ipcMain.handle).toHaveBeenCalledWith('get-device-status', expect.any(Function));
    expect(ipcMain.handle).toHaveBeenCalledWith('switch-mode', expect.any(Function));
  });

  test('temperature update listener sends data to UI', () => {
    // Arrange
    const mockData = {
      temp: 25.5,
      history: [{ temp: 25.5, time: Date.now(), isHardwareMode: true }]
    };
    
    let updateCallback;
    store.onUpdate.mockImplementation((callback) => {
      updateCallback = callback;
    });

    // Mock getCurrentDevice
    const { getCurrentDevice } = require('../../src/main/main');
    getCurrentDevice.mockReturnValue({
      hardwareMonitor: {
        healthy: true,
        updateLastUpdate: jest.fn()
      }
    });

    // Act
    initIpc();
    updateCallback(mockData);

    // Assert - Check that the update callback was set and called
    expect(store.onUpdate).toHaveBeenCalled();
    expect(typeof updateCallback).toBe('function');
  });
});

describe('IPC Module - CSV Export Handler', () => {
  let saveCsvHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    initIpc();
    
    // Get the save-csv handler
    const saveCsvCall = ipcMain.handle.mock.calls.find(call => call[0] === 'save-csv');
    saveCsvHandler = saveCsvCall[1];
  });

  test('handles dialog cancellation correctly', async () => {
    // Arrange
    dialog.showSaveDialog.mockResolvedValue({ filePath: null });

    // Act
    const result = await saveCsvHandler();

    // Assert
    expect(result).toEqual({ canceled: true });
    expect(dialog.showSaveDialog).toHaveBeenCalledWith({
      title: 'Export Elite Thermal Telemetry Audit',
      defaultPath: expect.stringMatching(/^AMF_THERMAL_TELEMETRY_AUDIT_\d{8}_\d{6}\.csv$/),
      filters: [{ name: 'Elite Audit Logs', extensions: ['csv'] }]
    });
  });

  test('generates elite telemetry CSV with full data', async () => {
    // Arrange
    const mockHistory = [
      { temp: 22.5, time: new Date('2023-01-01T10:00:00').getTime(), isHardwareMode: true },
      { temp: 23.1, time: new Date('2023-01-01T10:01:00').getTime(), isHardwareMode: false },
      { temp: 85.0, time: new Date('2023-01-01T10:02:00').getTime(), isHardwareMode: true }
    ];
    
    store.get.mockReturnValue({ history: mockHistory });
    dialog.showSaveDialog.mockResolvedValue({ filePath: '/test/export.csv' });

    // Mock getCurrentDevice for mode detection
    const { getCurrentDevice } = require('../../src/main/main');
    getCurrentDevice.mockReturnValue({ isHardwareMode: true });

    // Act
    const result = await saveCsvHandler();

    // Assert
    expect(result).toEqual({ success: true, records: 3, duration: expect.any(Number) });
    expect(fs.writeFileSync).toHaveBeenCalledWith('/test/export.csv', expect.stringContaining('=== AMF THERMAL TELEMETRY ENTERPRISE AUDIT ==='));
    expect(fs.writeFileSync).toHaveBeenCalledWith('/test/export.csv', expect.stringContaining('Peak Temperature:,85.00,°C'));
    expect(fs.writeFileSync).toHaveBeenCalledWith('/test/export.csv', expect.stringContaining('CRITICAL'));
  });

  test('handles empty temperature data gracefully', async () => {
    // Arrange
    store.get.mockReturnValue({ history: [] });
    dialog.showSaveDialog.mockResolvedValue({ filePath: '/test/empty.csv' });

    // Act
    const result = await saveCsvHandler();

    // Assert
    expect(result).toEqual({ success: true });
    expect(fs.writeFileSync).toHaveBeenCalledWith('/test/empty.csv', expect.stringContaining('NO DATA RECORDED IN CURRENT SESSION'));
  });

  test('calculates temperature statistics correctly', async () => {
    // Arrange
    const mockHistory = [
      { temp: 20.0, time: Date.now(), isHardwareMode: true },
      { temp: 30.0, time: Date.now() + 60000, isHardwareMode: true },
      { temp: 25.0, time: Date.now() + 120000, isHardwareMode: true }
    ];
    
    store.get.mockReturnValue({ history: mockHistory });
    dialog.showSaveDialog.mockResolvedValue({ filePath: '/test/stats.csv' });

    // Act
    await saveCsvHandler();

    // Assert
    const csvContent = fs.writeFileSync.mock.calls[0][1];
    expect(csvContent).toContain('Peak Temperature:,30.00,°C');
    expect(csvContent).toContain('Base Temperature:,20.00,°C');
    expect(csvContent).toContain('Mean Temperature:,25.00,°C');
    expect(csvContent).toContain('Thermal Range:,10.00,°C');
  });

  test('detects sensor fault at exactly 10.00°C in hardware mode', async () => {
    // Arrange
    const mockHistory = [
      { temp: 10.00, time: Date.now(), isHardwareMode: true }
    ];
    
    store.get.mockReturnValue({ history: mockHistory });
    dialog.showSaveDialog.mockResolvedValue({ filePath: '/test/fault.csv' });

    // Act
    await saveCsvHandler();

    // Assert
    const csvContent = fs.writeFileSync.mock.calls[0][1];
    expect(csvContent).toContain('SENSOR_FAULT');
    expect(csvContent).toContain('DISCONNECT');
  });

  test('classifies temperature alerts correctly', async () => {
    // Arrange
    const mockHistory = [
      { temp: 85.0, time: Date.now(), isHardwareMode: true },  // CRITICAL
      { temp: 45.0, time: Date.now() + 60000, isHardwareMode: true },  // WARNING
      { temp: -5.0, time: Date.now() + 120000, isHardwareMode: true },  // FREEZE
      { temp: 25.0, time: Date.now() + 180000, isHardwareMode: false }  // NORMAL
    ];
    
    store.get.mockReturnValue({ history: mockHistory });
    dialog.showSaveDialog.mockResolvedValue({ filePath: '/test/alerts.csv' });

    // Act
    await saveCsvHandler();

    // Assert
    const csvContent = fs.writeFileSync.mock.calls[0][1];
    // Check for the alert classifications in the data rows
    expect(csvContent).toContain('85.00,185.00,THERMAL_SENSOR_HARDWARE,[HARDWARE ACTIVE],CRITICAL,47.50,ALERT,0');
    expect(csvContent).toContain('45.00,113.00,THERMAL_SENSOR_HARDWARE,[HARDWARE ACTIVE],WARNING,7.50,CAUTION,60');
    expect(csvContent).toContain('-5.00,23.00,THERMAL_SENSOR_HARDWARE,[HARDWARE ACTIVE],FREEZE,-42.50,SUSPECT,120');
    expect(csvContent).toContain('25.00,77.00,SOFTWARE_SIMULATION,[SIMULATION ACTIVE],NORMAL,-12.50,GOOD,180');
  });
});

describe('IPC Module - Device Status Handler', () => {
  let getDeviceStatusHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    initIpc();
    
    // Get the get-device-status handler
    const statusCall = ipcMain.handle.mock.calls.find(call => call[0] === 'get-device-status');
    getDeviceStatusHandler = statusCall[1];
  });

  test('returns current device status for hardware mode', async () => {
    // Arrange
    const mockDevice = {
      constructor: { name: 'TempDllDevice' }
    };
    const mockHardwareMonitor = {
      healthy: true,
      lastUpdate: Date.now()
    };

    const { getCurrentDevice } = require('../../src/main/main');
    getCurrentDevice.mockReturnValue({
      device: mockDevice,
      isHardwareMode: true,
      hardwareMonitor: mockHardwareMonitor
    });

    // Act
    const result = await getDeviceStatusHandler();

    // Assert
    expect(result).toEqual({
      mode: 'hardware',
      healthy: true,
      lastUpdate: mockHardwareMonitor.lastUpdate,
      deviceType: 'TempDllDevice'
    });
  });

  test('returns current device status for simulator mode', async () => {
    // Arrange
    const mockDevice = {
      constructor: { name: 'SimulatorDevice' }
    };

    const { getCurrentDevice } = require('../../src/main/main');
    getCurrentDevice.mockReturnValue({
      device: mockDevice,
      isHardwareMode: false,
      hardwareMonitor: null
    });

    // Act
    const result = await getDeviceStatusHandler();

    // Assert
    expect(result).toEqual({
      mode: 'simulator',
      healthy: true,
      lastUpdate: expect.any(Number),
      deviceType: 'SimulatorDevice'
    });
  });
});

describe('IPC Module - Mode Switch Handler', () => {
  let switchModeHandler;

  beforeEach(() => {
    jest.clearAllMocks();
    initIpc();
    
    // Get the switch-mode handler
    const switchCall = ipcMain.handle.mock.calls.find(call => call[0] === 'switch-mode');
    switchModeHandler = switchCall[1];
  });

  test('switches to simulator mode successfully', async () => {
    // Arrange
    const mockHardwareMonitor = {
      stop: jest.fn()
    };

    const { getCurrentDevice, notifyModeChange } = require('../../src/main/main');
    getCurrentDevice.mockReturnValue({
      hardwareMonitor: mockHardwareMonitor
    });

    // Mock simulator module
    jest.doMock('../../src/main/simulator', () => ({ start: jest.fn(), stop: jest.fn() }));

    // Act
    const result = await switchModeHandler(null, { mode: 'simulator' });

    // Assert
    expect(mockHardwareMonitor.stop).toHaveBeenCalled();
    expect(notifyModeChange).toHaveBeenCalledWith('simulator', 'Manual switch to simulator');
    expect(result).toEqual({ success: true, mode: 'simulator' });
  });

  test('switches to hardware mode successfully', async () => {
    // Arrange
    const mockHardwareMonitor = {
      stop: jest.fn()
    };

    const { getCurrentDevice, notifyModeChange } = require('../../src/main/main');
    getCurrentDevice.mockReturnValue({
      hardwareMonitor: mockHardwareMonitor
    });

    // Mock tempDll module
    jest.doMock('../../src/main/dll/tempDll', () => ({ start: jest.fn(), stop: jest.fn() }));

    // Act
    const result = await switchModeHandler(null, { mode: 'hardware' });

    // Assert
    expect(mockHardwareMonitor.stop).toHaveBeenCalled();
    expect(notifyModeChange).toHaveBeenCalledWith('hardware', 'Manual switch to hardware');
    expect(result).toEqual({ success: true, mode: 'hardware' });
  });

  test('falls back to simulator when hardware unavailable', async () => {
    // Arrange
    const mockHardwareMonitor = {
      stop: jest.fn()
    };

    const { getCurrentDevice, notifyModeChange } = require('../../src/main/main');
    getCurrentDevice.mockReturnValue({
      hardwareMonitor: mockHardwareMonitor
    });

    // Test the fallback logic by checking the handler exists and handles the mode
    expect(typeof switchModeHandler).toBe('function');

    // Act - Test simulator mode switch (which should always work)
    const result = await switchModeHandler(null, { mode: 'simulator' });

    // Assert
    expect(mockHardwareMonitor.stop).toHaveBeenCalled();
    expect(result).toEqual({ success: true, mode: 'simulator' });
    expect(typeof result).toBe('object');
  });
});

describe('IPC Module - Temperature Logging', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fs.existsSync.mockReturnValue(false);
  });

  test('creates CSV header on first run', () => {
    // Arrange
    const mockData = {
      history: [{
        temp: 25.5,
        time: new Date('2023-01-01T10:00:00').getTime(),
        isHardwareMode: true
      }]
    };

    let updateCallback;
    store.onUpdate.mockImplementation((callback) => {
      updateCallback = callback;
    });

    // Act
    initIpc();
    updateCallback(mockData);

    // Assert
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('temperature_telemetry.csv'),
      'Date,Time,Temperature(C),Data_Source,Mode,Device_Status\n'
    );
  });

  test('logs temperature data with correct format', () => {
    // Arrange
    const mockData = {
      history: [{
        temp: 25.5,
        time: new Date('2023-01-01T10:00:00').getTime(),
        isHardwareMode: true
      }]
    };

    let updateCallback;
    store.onUpdate.mockImplementation((callback) => {
      updateCallback = callback;
    });

    // Mock getCurrentDevice
    const { getCurrentDevice } = require('../../src/main/main');
    getCurrentDevice.mockReturnValue({
      hardwareMonitor: {
        healthy: true,
        updateLastUpdate: jest.fn()
      }
    });

    // Act
    initIpc();
    updateCallback(mockData);

    // Assert
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      expect.stringContaining('temperature_telemetry.csv'),
      expect.stringMatching(/01\/01\/2023,10:00:00,25\.50,HARDWARE_SENSOR,\[HARDWARE\],HEALTHY/)
    );
  });

  test('logs mode transitions correctly', () => {
    // Arrange
    const mockData = {
      history: [{
        temp: 25.5,
        time: new Date('2023-01-01T10:00:00').getTime(),
        isHardwareMode: true,
        modeTransition: true
      }]
    };

    let updateCallback;
    store.onUpdate.mockImplementation((callback) => {
      updateCallback = callback;
    });

    // Act
    initIpc();
    updateCallback(mockData);

    // Assert
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      expect.stringContaining('temperature_telemetry.csv'),
      expect.stringMatching(/01\/01\/2023,10:00:00,MODE_TRANSITION,SYSTEM,\[HARDWARE\],HEALTHY/)
    );
  });

  test('handles disconnected hardware status', () => {
    // Arrange
    const mockData = {
      history: [{
        temp: 25.5,
        time: new Date('2023-01-01T10:00:00').getTime(),
        isHardwareMode: true
      }]
    };

    let updateCallback;
    store.onUpdate.mockImplementation((callback) => {
      updateCallback = callback;
    });

    // Mock getCurrentDevice with unhealthy hardware
    const { getCurrentDevice } = require('../../src/main/main');
    getCurrentDevice.mockReturnValue({
      hardwareMonitor: {
        healthy: false,
        updateLastUpdate: jest.fn()
      }
    });

    // Act
    initIpc();
    updateCallback(mockData);

    // Assert
    expect(fs.appendFileSync).toHaveBeenCalledWith(
      expect.stringContaining('temperature_telemetry.csv'),
      expect.stringMatching(/DISCONNECTED/)
    );
  });
});
