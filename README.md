# AMF Temperature Plotter (v1.1.0)

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Test Coverage](https://img.shields.io/badge/coverage-97.85%25-brightgreen)
![Platform](https://img.shields.io/badge/platform-Windows_x64-blue)
![Version](https://img.shields.io/badge/version-1.1.0-blue)
![Tests](https://img.shields.io/badge/tests-116%20passing-green)

Professional industrial temperature monitoring application built with Electron, React, and Node.js. Features real-time visualisation, hardware abstraction, and comprehensive testing with 97.85% IPC coverage.

## Key Features

- **Real-Time Visualisation**: Live temperature graphing with 1Hz refresh rate
- **Dual-Unit Display**: Celsius and Fahrenheit with pre-calculated conversions  
- **Hardware Abstraction**: DLL integration with simulation fallback
- **Professional Logging**: Colour-coded console utilities with cross-platform support
- **Data Persistence**: Automatic CSV logging and on-demand export
- **Enterprise Security**: Memory leak prevention and secure IPC architecture
- **Comprehensive Testing**: 116 tests with 97.85% IPC coverage

## Quick Start

```bash
# Clone and install
git clone https://github.com/Interlaken0/temperature-plotter
cd temperature-plotter
npm install

# Start development
npm start

# Run tests (116 passing)
npm test
```

## Development Commands

```bash
npm start              # Start development server
npm test               # Run all tests (116 passing)
npm run make          # Build application
npm run package       # Package for distribution
```

## Testing & Coverage

- **116 tests** across 12 test suites
- **97.85% IPC coverage** 
- **100% pass rate**
- Dynamic test summary generation
- HTML coverage reports in `coverage/`

View coverage: `start coverage/lcov-report/index.html`

## Architecture

**Technology Stack:**
- **Electron 40.1.0** - Cross-platform desktop framework
- **React 18.2.0** - User interface library  
- **Recharts 2.12.0** - Data visualisation
- **Tailwind CSS 3.4.17** - Styling framework
- **Jest 29.7.0** - Testing framework
- **Koffi 2.15.1** - DLL integration

**Performance:**
- 1Hz temperature updates
- <100ms UI response time
- 45-50MB stable memory usage
- 100% data persistence

## Documentation

Professional documentation ecosystem:

- **[docs/SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md)** - Technical architecture
- **[docs/API.md](docs/API.md)** - API reference
- **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Troubleshooting guide
- **[docs/PROJECT-OBJECTIVES.md](docs/PROJECT-OBJECTIVES.md)** - Project objectives
- **[docs/NEW-DEVELOPER-ONBOARDING.md](docs/NEW-DEVELOPER-ONBOARDING.md)** - Onboarding guide
- **[docs/COMPLETE-DOCUMENTATION-GUIDE.md](docs/COMPLETE-DOCUMENTATION-GUIDE.md)** - Documentation navigation

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Console garbled text | Built-in ASCII-safe notation |
| Tests failing | `npm test -- --updateSnapshot` |
| Hardware not detected | Check DLL path in troubleshooting guide |

---

**Professional industrial temperature monitoring - v1.1.0**
