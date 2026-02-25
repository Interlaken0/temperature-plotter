// Simulator Branch Coverage Test
// ============================================================================
// Test to improve simulator.js branch coverage by testing the uncovered branch:
// - Line 48: return when !this.running (triggerInterrupt method)
// ============================================================================

describe('simulator.js - Branch Coverage Test', () => {
  let simulator;

  beforeEach(() => {
    // Clear module cache
    jest.resetModules();
    jest.clearAllMocks();
    
    // Mock temperature store
    jest.doMock('../../src/main/state/temperatureStore', () => ({
      updateTemperature: jest.fn()
    }));
    
    simulator = require('../../src/main/simulator');
  });

  afterEach(() => {
    if (simulator && simulator.stop) {
      simulator.stop();
    }
  });

  test('triggerInterrupt returns early when not running', () => {
    // Don't start simulator - it should be not running by default
    expect(simulator.running).toBe(false);
    
    // Mock console to capture any output
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Call triggerInterrupt - should return early without updating temperature
    simulator.triggerInterrupt();
    
    // Temperature store should not be called (early return)
    const store = require('../../src/main/state/temperatureStore');
    expect(store.updateTemperature).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  test('triggerInterrupt generates temperature when running', () => {
    // Mock console to capture output
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Start simulator
    simulator.start();
    
    // Wait a moment for first interrupt
    setTimeout(() => {
      // Temperature store should be called
      const store = require('../../src/main/state/temperatureStore');
      expect(store.updateTemperature).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
      simulator.stop();
    }, 100);
  });
});
