# Temperature Plotter (v1.1.0)

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)
![Platform](https://img.shields.io/badge/platform-Windows_x64-blue)
![Version](https://img.shields.io/badge/version-1.1.0-blue)
![Documentation](https://img.shields.io/badge/docs-8%20files-green)

A professional real-time industrial temperature monitoring application built with Electron, React, and Node.js, featuring enhanced console utilities, dual-unit temperature support, and cross-platform compatibility.

## Project Overview

This application provides a comprehensive solution for reading, visualising, and logging temperature sensor data with professional-grade features. It features a robust IPC (Inter-Process Communication) architecture that bridges a Node.js backend (handling hardware/simulation) with a React frontend (handling visualisation), enhanced with v1.1.0 console utilities and cross-platform compatibility.

### v1.1.0 Key Enhancements
- **Console Utilities Module**: Professional colour-coded logging with ASCII-safe notation
- **Dual-Unit Support**: Pre-calculated Fahrenheit conversions with source tracking
- **Cross-Platform Encoding**: Fixed Windows PowerShell Unicode corruption issues
- **Dynamic Test Reporting**: JSON-based test summary generation (99 tests, 100% pass rate)
- **Enhanced Documentation**: 8-file professional documentation ecosystem
- **Hardware Mode Management**: Manual override and automatic mode switching

**Key Capabilities:**
- **Real-Time Visualisation**: Live graphing of sensor data (1Hz refresh rate) using Recharts
- **Dual-Unit Temperature Display**: Celsius and Fahrenheit with pre-calculated conversions
- **Persistent Telemetry**: Background logging to temperature_telemetry.csv ensures data is never lost
- **Data Export**: On-demand CSV export for reporting and analysis
- **Hardware Abstraction**: Ready for seamless DLL integration with fallback simulation mode
- **Professional Console Output**: Colour-coded logging with cross-platform compatibility

## Quick Installation

### End Users
1. Navigate to: `out/make/squirrel.windows/x64/`
2. Double-click `AMF-Temperature-PlotterSetup.exe`
3. Application installs and launches automatically
4. Desktop shortcut created for easy access

### Developers
```bash
git clone https://github.com/Interlaken0/temperature-plotter
cd temperature-plotter
npm install
npm start
```

## Development Commands

```bash
# Start development server
npm start

# Run tests (99 tests, 100% pass rate)
npm test

# Generate test summary (v1.1.0 dynamic reporting)
node scripts/generate-test-summary.js

# Build application
npm run make

# Package for distribution
npm run package

# Run with debug logging
set DEBUG=temperature-plotter:* && npm start
```

## Console Utilities

Professional colour-coded logging system with ASCII-safe notation:

```javascript
const consoleColours = require('./utils/consoleColours');

// Temperature logging with source tracking
consoleColours.temperature(24.5, 76.1, 'REAL');
// Output: [+] [REAL] 24.50 deg C (76.10 deg F)

// Hardware-specific logging
consoleColours.hardware('Device connected');
// Output: [+] [HAL] Device connected

consoleColours.simulator('Simulation started');
// Output: [~] SIMULATOR Simulation started

// Status logging with type support
consoleColours.status('Operation complete', 'success');
// Output: > Operation complete (in green)

consoleColours.status('Processing...', 'info');
// Output: > Processing... (in blue)

// Utility functions
consoleColours.separator(); // 50 dim equal signs
consoleColours.header('System Title'); // Cyan header with 50 equal signs
```

## Technical Specifications

**Dependencies:**
- **Electron 40.1.0**: Cross-platform desktop framework
- **React 18.2.0**: User interface library
- **Recharts 2.12.0**: Data visualisation
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Jest 29.7.0**: JavaScript testing framework
- **Koffi 2.15.1**: Foreign Function Interface for DLL binding

**Performance:**
- **Data Rate**: 1Hz temperature updates
- **Response Time**: <100ms UI update latency
- **Memory Usage**: Optimised for 24/7 operation (45-50MB stable)
- **Data Integrity**: 100% telemetry persistence
- **Cross-Platform**: 100% Windows PowerShell/CMD compatibility

## Documentation

Professional documentation ecosystem (8 files):

- **[docs/SYSTEM-ARCHITECTURE.md](docs/SYSTEM-ARCHITECTURE.md)** - Complete technical documentation
- **[docs/API.md](docs/API.md)** - Comprehensive API reference
- **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** - Development guidelines
- **[docs/CHANGELOG.md](docs/CHANGELOG.md)** - Version history
- **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Troubleshooting guide
- **[docs/NEW-DEVELOPER-ONBOARDING.md](docs/NEW-DEVELOPER-ONBOARDING.md)** - Onboarding pathway
- **[docs/COMPLETE-DOCUMENTATION-GUIDE.md](docs/COMPLETE-DOCUMENTATION-GUIDE.md)** - Documentation navigation
- **[docs/PROJECT-OBJECTIVES.md](docs/PROJECT-OBJECTIVES.md)** - Project objectives documentation

## Installation Troubleshooting

### Common Issues
- **PowerShell Encoding**: Run `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8` before starting
- **Missing Dependencies**: Ensure Node.js LTS 16+ is installed
- **Build Failures**: Run `npm install` and `npm run make` in clean environment

### Quick Fixes
| Problem | Solution | Time |
|---------|----------|------|
| Console garbled text | Use ASCII-safe notation (built-in) | Instant |
| Tests failing | `npm test -- --updateSnapshot` | 1 min |
| Hardware not detected | Check DLL path in docs/TROUBLESHOOTING.md | 2 min |

---

**Built with excellence for industrial temperature monitoring - v1.1.0 with enhanced professional features**
