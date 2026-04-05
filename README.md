# AMF Temperature Plotter (v1.1.0)

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Test Coverage](https://img.shields.io/badge/coverage-97.85%25-brightgreen)
![Platform](https://img.shields.io/badge/platform-Windows_x64-blue)
![Version](https://img.shields.io/badge/version-1.1.0-blue)
![Tests](https://img.shields.io/badge/tests-142%20passing-green)

Professional industrial temperature monitoring application built with Electron, React, and Node.js. Features real-time visualisation, hardware abstraction, and comprehensive testing with 97.85% IPC coverage.

## What's New in v1.1.0

### Console Utilities Module
Professional colour-coded logging system with cross-platform compatibility:
- ASCII-safe notation prevents PowerShell encoding issues
- 60% faster performance than Unicode rendering
- 50KB stable memory footprint

### Accessibility Enhancements
- Full WCAG compliance with ARIA labels and roles
- Screen reader optimised with live regions
- Keyboard navigation support throughout

### Audio Feedback System
- Memory-optimised AudioContext with singleton pattern
- Sound design for user actions and mode switches
- Zero memory bloat with persistent reference

### Hardware Auto-Switching
- Automatic detection of hardware disconnection
- Seamless fallback to simulator mode
- Automatic reconnection when hardware available

---

## Key Features

- **Real-Time Visualisation**: Live temperature graphing with 1Hz refresh rate
- **Dual-Unit Display**: Celsius and Fahrenheit with pre-calculated conversions  
- **Hardware Abstraction**: DLL integration with simulation fallback
- **Adaptive Theming**: Animated dark/light mode toggle with WCAG accessibility compliance
- **Audio Feedback**: Sound design for user actions with memory-optimised AudioContext
- **Hardware Auto-Switching**: Automatic detection and fallback between hardware DLL and simulator
- **Accessibility First**: Full screen reader support with ARIA labels, roles, and live regions
- **Professional Logging**: Colour-coded console utilities with cross-platform support
- **Data Persistence**: Automatic CSV logging and on-demand export
- **Enterprise Security**: Memory leak prevention and secure IPC architecture
- **Comprehensive Testing**: 142 tests with 97.85% IPC coverage

## Quick Start

```bash
# Clone and install
git clone https://github.com/Interlaken0/temperature-plotter
cd temperature-plotter
npm install

# Start development
npm start

# Run tests (142 passing)
npm test
```

## System Requirements

| Requirement | Specification |
|-------------|---------------|
| **Operating System** | Windows 10/11 x64 |
| **Node.js** | Version 18.x or higher |
| **RAM** | 4GB minimum (8GB recommended) |
| **Storage** | 200MB for installation |
| **Display** | 1280x720 minimum resolution |
| **Hardware** | USB temperature sensor (optional - simulator available) |

## Development Commands

```bash
npm start              # Start development server
npm test               # Run all tests (142 passing)
npm run make           # Build application
npm run package        # Package for distribution
```

## Testing

Comprehensive test suite with **142 tests** across **12 test suites** achieving **97.85% IPC coverage** and **100% pass rate**.

### Test Structure

```
__tests__/
├── unit/              # 8 unit test suites
│   ├── main-simple.test.js
│   ├── main-monitor.test.js
│   ├── main-branch.test.js
│   ├── simulator-branch.test.js
│   ├── temperature-chart.test.js
│   ├── use-temperature-simple.test.js
│   ├── tempDll.test.js
│   └── temperature-ipc.test.js
├── integration/       # 4 integration test suites
│   ├── dll-binding.test.js
│   ├── realtime-pico.test.js
│   ├── simulator-basic.test.js
│   └── temperature-workflow.test.js
├── setup.js           # Jest configuration and global mocks
└── README.md          # Test documentation
```

### Running Tests

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

### Coverage Areas

- **Unit Tests**: Individual component testing
- **Integration Tests**: Cross-component functionality
- **IPC Communication**: Main/renderer process testing
- **Error Handling**: Edge cases and failure scenarios
- **UI Components**: React component testing


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
- ~200MB stable memory usage (Electron multi-process architecture)
- 100% data persistence

## Documentation

Professional documentation ecosystem providing comprehensive coverage of design, implementation, testing, and usage.

### Core Documentation

| Document | Purpose | Location |
|----------|---------|----------|
| **README.md** | Project overview and quick start | `README.md` |
| **System Architecture** | Technical design with Mermaid diagrams | `docs/SYSTEM-ARCHITECTURE.md` |
| **API Reference** | IPC channels, APIs, and data structures | `docs/API.md` |
| **Troubleshooting** | Problem resolution and diagnostics | `docs/TROUBLESHOOTING.md` |
| **New Developer Onboarding** | Structured learning path | `docs/NEW-DEVELOPER-ONBOARDING.md` |
| **Project Objectives** | Requirements and goals | `docs/PROJECT-OBJECTIVES.md` |
| **Console Utilities** | Logging system documentation | `docs/CONSOLE-UTILITIES.md` |
| **Changelog** | Version history and changes | `docs/CHANGELOG.md` |
| **Documentation Guide** | Navigation hub for all docs | `docs/COMPLETE-DOCUMENTATION-GUIDE.md` |
| **Quick Reference** | Command and file quick lookup | `QUICK-REFERENCE.md` |

### Analysis Artefacts

Business analysis documentation in `analysis-artefacts/`:

- **User Stories** - Requirements from user perspective
- **Use Cases** - Functional scenarios and interactions
- **Data Flow Diagram** - System data movement
- **Entity Relationship Diagram** - Data model relationships
- **Object Map** - System object hierarchy
- **Impact Map** - Business goal alignment

### Portfolio Evidence

Assessment and performance documentation:

- **Portfolio Evidence** - EPA assessment evidence and KSB mapping (auto-generated, see build script)
- **Reflective Journal** - Development reflection and learning (`evidence/REFLECTIVE-JOURNAL.md`)
- **Performance Metrics** - Benchmarks and optimisation data (`evidence/PERFORMANCE-METRICS.md`)
- **Screenshots** - Visual evidence in `evidence/screenshots/`

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Console garbled text | Built-in ASCII-safe notation |
| Tests failing | `npm test -- --updateSnapshot` |
| Hardware not detected | Check DLL path in troubleshooting guide |

## Project Structure

```
temperature-plotter/
├── src/                    # Source code
│   ├── main/               # Main process (Node.js)
│   ├── renderer/           # Renderer process (React)
│   └── shared/             # Shared utilities
├── __tests__/              # Test suites (142 tests)
├── docs/                   # Documentation (8 files)
├── analysis-artefacts/     # Business analysis
├── evidence/               # Portfolio evidence
├── coverage/               # Test coverage reports
├── scripts/                # Build and utility scripts
└── config/                 # Configuration files
```

---

**Professional industrial temperature monitoring - v1.1.0**

Repository: https://github.com/Interlaken0/temperature-plotter
