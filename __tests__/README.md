# Test Suite

Comprehensive test suite for the Temperature Plotter application with **116 tests** achieving **97.85% IPC coverage** and **100% pass rate**.

## Structure

```
__tests__/
├── unit/           # Unit tests for components and functions
├── integration/    # Integration tests for component interactions
├── setup.js        # Jest configuration and global mocks
└── README.md       # This file
```

## Test Results

- **Total Tests**: 116 passing
- **Test Suites**: 12
- **IPC Coverage**: 97.85%
- **Pass Rate**: 100%
- **Coverage Reports**: HTML in `coverage/`

## Running Tests

```bash
# Run all tests with coverage
npm test

# Run tests with verbose output
npm test -- --verbose

# Generate coverage report only
npm test -- --coverage

# View coverage report
start coverage/lcov-report/index.html
```

## Coverage Areas

- **Unit Tests**: Individual component testing
- **Integration Tests**: Cross-component functionality
- **IPC Communication**: Main/renderer process testing
- **Error Handling**: Edge cases and failure scenarios
- **UI Components**: React component testing

## Automated Test Summary

- **Script**: `scripts/generate-test-summary.js`
- **Output**: `evidence/test-reports/test-summary.txt`
- **Trigger**: Runs automatically after `npm test`
- **Features**: Dynamic JSON-based reporting with test metrics: 
  - Captures current test results and execution metrics
  - Includes timestamp for Git change detection
  - Updates EPA evidence automatically

The summary file is tracked by Git to provide current testing evidence for portfolio assessment.

## Test Categories

### Unit Tests
- **main-simple.test.js** - Core application logic
- **main-monitor.test.js** - Temperature monitoring functionality
- **main-branch.test.js** - Conditional logic and branching
- **simulator-branch.test.js** - Simulator branching logic
- **temperature-chart.test.js** - Chart component rendering
- **use-temperature-simple.test.js** - Custom hook functionality
- **tempDll.test.js** - DLL binding and native integration
- **temperature-ipc.test.js** - IPC handlers and communication

### Integration Tests
- **dll-binding.test.js** - Hardware integration workflows
- **realtime-pico.test.js** - Real-time data processing
- **simulator-basic.test.js** - Temperature simulation
- **temperature-workflow.test.js** - End-to-end temperature workflows

## Setup

Tests use Jest with React Testing Library. Global mocks are configured in `setup.js` to simulate Electron APIs and browser environments.

## Coverage

The test suite maintains comprehensive coverage across all application components:

- **Total Tests**: 116 passing (100% pass rate)
- **IPC Coverage**: 97.85% statements, 83.33% branches, 100% functions
- **New Addition**: temperature-ipc.test.js with 17 comprehensive test cases
- **Coverage Improvement**: From 26.42% to 97.85% for IPC module

This dramatic coverage improvement ensures robust IPC communication and data integrity across the application.
