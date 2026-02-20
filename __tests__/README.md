# Test Suite

Comprehensive test suite for the Temperature Plotter application.

## Structure

```
__tests__/
├── unit/           # Unit tests for individual components and functions
├── integration/    # Integration tests for component interactions
├── setup.js        # Jest configuration and global mocks
└── README.md       # This file
```

## Running Tests

```bash
# Run all tests with automatic summary generation
npm test

# Run tests with coverage
npm test -- --coverage

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
  - Generates British English compliant documentation
  - Updates EPA evidence automatically

The summary file is tracked by Git to provide current testing evidence for portfolio assessment.

## Test Categories

### Unit Tests
- **main-simple.test.js** - Core application logic
- **main-monitor.test.js** - Temperature monitoring functionality
- **main-branch.test.js** - Conditional logic and branching
- **temperature-chart.test.js** - Chart component rendering
- **use-temperature-simple.test.js** - Custom hook functionality
- **tempDll.test.js** - DLL binding and native integration

### Integration Tests
- **dll-binding.test.js** - Hardware integration workflows
- **realtime-pico.test.js** - Real-time data processing
- **simulator-basic.test.js** - Temperature simulation
- **temperature-workflow.test.js** - End-to-end temperature workflows

## Setup

Tests use Jest with React Testing Library. Global mocks are configured in `setup.js` to simulate Electron APIs and browser environments.

## Coverage

Current test coverage targets 75% pass rate with comprehensive unit and integration testing.
