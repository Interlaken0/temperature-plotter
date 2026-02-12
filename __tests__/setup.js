// Jest setup file for test environment configuration
import '@testing-library/jest-dom';

// Mock Electron APIs for testing
global.electronAPI = {
  getTemperature: jest.fn(),
  startSimulation: jest.fn(),
  stopSimulation: jest.fn(),
  onTemperatureUpdate: jest.fn(),
  removeTemperatureListener: jest.fn()
};

// Mock ResizeObserver for Recharts compatibility
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};
