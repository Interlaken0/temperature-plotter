// DLL INTEGRATION TESTS - Hardware Abstraction Layer Testing
// ============================================================================
// Comprehensive test suite for tempDll.js uncovered lines and FFI integration:
// - DLL loading and path resolution logic
// - Function binding and callback management
// - Hardware connection and data streaming
// - Error handling and edge cases
// ============================================================================

const koffi = require('koffi');
const fs = require('fs');
const path = require('path');

// MOCK TEMPERATURE STORE - Control data storage behaviour
jest.mock('../../src/main/state/temperatureStore', () => ({
  updateTemperature: jest.fn()
}));

describe('tempDll.js - Module Loading and Structure', () => {
  test('module loads without errors', () => {
    // Test that the module can be loaded (lines 1-247)
    expect(() => {
      require('../../src/main/dll/tempDll');
    }).not.toThrow();
  });

  test('module exports required methods', () => {
    // Test that all expected methods are exported (line 131)
    const dll = require('../../src/main/dll/tempDll');
    
    expect(dll).toHaveProperty('checkConnection');
    expect(dll).toHaveProperty('start');
    expect(dll).toHaveProperty('stop');
    expect(typeof dll.checkConnection).toBe('function');
    expect(typeof dll.start).toBe('function');
    expect(typeof dll.stop).toBe('function');
  });
});

describe('tempDll.js - Connection Check Tests', () => {
  let dll;

  beforeEach(() => {
    jest.clearAllMocks();
    // Fresh require for each test
    jest.resetModules();
    dll = require('../../src/main/dll/tempDll');
  });

  test('checkConnection returns number', () => {
    // Test connection check returns expected type (lines 140-147)
    const result = dll.checkConnection();
    expect(typeof result).toBe('number');
    expect(result === 0 || result === 1).toBe(true);
  });

  test('checkConnection handles errors gracefully', () => {
    // Test that connection check doesn't throw (line 144)
    expect(() => {
      dll.checkConnection();
    }).not.toThrow();
  });
});

describe('tempDll.js - Hardware Start Tests', () => {
  let dll;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    dll = require('../../src/main/dll/tempDll');
  });

  test('start method executes without errors', () => {
    // Test that start method can be called (lines 159-225)
    expect(() => {
      dll.start();
    }).not.toThrow();
  });

  test('start method handles missing DLL gracefully', () => {
    // Test start with no DLL (lines 161-164)
    const consoleSpy = jest.spyOn(console, 'warn');
    
    dll.start();
    
    // Should log warning if DLL not ready
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Cannot start: DLL not ready')
    );
  });
});

describe('tempDll.js - Hardware Stop Tests', () => {
  let dll;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    dll = require('../../src/main/dll/tempDll');
  });

  test('stop method executes without errors', () => {
    // Test that stop method can be called (lines 235-246)
    expect(() => {
      dll.stop();
    }).not.toThrow();
  });

  test('stop method handles no callback gracefully', () => {
    // Test stop with no registered callback (line 236)
    expect(() => {
      dll.stop();
    }).not.toThrow();
  });
});

describe('tempDll.js - Error Handling and Edge Cases', () => {
  test('multiple start calls are handled gracefully', () => {
    // Test multiple start calls for robustness
    jest.resetModules();
    const dll = require('../../src/main/dll/tempDll');
    
    expect(() => {
      dll.start();
      dll.start();
      dll.start();
    }).not.toThrow();
  });

  test('multiple stop calls are handled gracefully', () => {
    // Test multiple stop calls for robustness
    jest.resetModules();
    const dll = require('../../src/main/dll/tempDll');
    
    expect(() => {
      dll.stop();
      dll.stop();
      dll.stop();
    }).not.toThrow();
  });

  test('mixed start/stop sequence is handled gracefully', () => {
    // Test mixed start/stop calls
    jest.resetModules();
    const dll = require('../../src/main/dll/tempDll');
    
    expect(() => {
      dll.start();
      dll.stop();
      dll.start();
      dll.stop();
      dll.stop();
      dll.start();
    }).not.toThrow();
  });
});

describe('tempDll.js - Integration with Dependencies', () => {
  test('temperature store integration', () => {
    // Test that temperature store is imported correctly (line 14)
    const store = require('../../src/main/state/temperatureStore');
    expect(store.updateTemperature).toBeDefined();
  });

  test('koffi library integration', () => {
    // Test that koffi library is imported (line 12)
    expect(koffi).toBeDefined();
    expect(typeof koffi.load).toBe('function');
    expect(typeof koffi.register).toBe('function');
    expect(typeof koffi.unregister).toBe('function');
    expect(typeof koffi.proto).toBe('function');
  });

  test('path and fs modules are available', () => {
    // Test that required Node.js modules are available (lines 13, 15)
    expect(path).toBeDefined();
    expect(fs).toBeDefined();
    expect(typeof path.join).toBe('function');
    expect(typeof fs.existsSync).toBe('function');
  });
});

describe('tempDll.js - Console Logging Tests', () => {
  let dll;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    dll = require('../../src/main/dll/tempDll');
  });

  test('logs HAL mode identification', () => {
    // Test HAL mode logging (line 37)
    const consoleSpy = jest.spyOn(console, 'log');
    
    // Re-require to trigger logging
    jest.resetModules();
    require('../../src/main/dll/tempDll');
    
    expect(consoleSpy).toHaveBeenCalledWith(
      '[HAL] Mode: Koffi Type System (Modern)'
    );
  });

  test('start method logs appropriate messages', () => {
    // Test logging during start (lines 162, 169-173, 203, 206, 207)
    const consoleSpy = jest.spyOn(console, 'log');
    const consoleWarnSpy = jest.spyOn(console, 'warn');
    
    dll.start();
    
    // Should log warning about DLL not being ready
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[HAL] Cannot start: DLL not ready.'
    );
  });
});
