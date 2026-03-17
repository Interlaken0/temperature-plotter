# Test Suite

Comprehensive test suite for the Temperature Plotter application with 116 tests achieving 97.85% IPC coverage.

## Structure

```
__tests__/
├── unit/           # Unit tests for individual components and functions
├── integration/    # Integration tests for component interactions
├── setup.js        # Jest configuration and global mocks
└── README.md       # This file
```

# Testing

```bash
# Run all tests with automatic summary generation
npm test                    # Runs tests, no coverage
npm test -- --verbose       # Runs tests with verbose output, no coverage
npm test -- --coverage      # Runs tests AND generates/updates coverage

# View Coverage Report
start coverage/lcov-report/index.html    # Open coverage in browser (Windows)
open coverage/lcov-report/index.html     # Open coverage in browser (macOS)
xdg-open coverage/lcov-report/index.html # Open coverage in browser (Linux)
# Or manually navigate to coverage/lcov-report/ and double-click index.html

# Run specific test file
npm test -- unit/main-simple.test.js
```

## Automated Test Summary

The test suite includes an automated summary generation system:

- **Script**: `scripts/generate-test-summary.js`
- **Output**: `evidence/test-reports/test-summary.txt`
- **Trigger**: Runs automatically after `npm test`
- **Features**: 
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
