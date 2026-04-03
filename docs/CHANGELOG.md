# Changelog

All notable changes to the AMF Temperature Plotter project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-03-31

### Added
- Enterprise security hardening for Electron configuration
- Input validation for temperature readings (-50°C to 200°C range)
- Memory leak prevention with proper listener cleanup
- Security logging for rejected temperature readings
- Comprehensive test suite with 116 tests achieving 97.85% IPC coverage
- Complete documentation ecosystem (6 guides)
- Dark and light mode theme toggle
- CSV export with statistical analysis
- Automatic hardware fallback to simulator mode
- Hardware reconnection detection

### Fixed
- MAX_BUFFER constant mismatch (500 → 5000 entries)
- AMF channel exhaustion issue with `koffi.unload()`
- DLL path resolution for packaged applications
- Memory leak in IPC event listener management
- Audio context leak in theme toggle
- CSS transition blocking on lower-spec hardware
- Input validation to reject NaN and out-of-range values

### Security
- Enabled context isolation in Electron
- Enabled sandbox mode
- Disabled node integration
- Implemented secure IPC bridge via preload script
- Added input validation at all data entry points

## [1.0.0] - 2026-02-14

### Added
- Initial Electron application architecture
- Koffi DLL integration for hardware communication
- Temperature monitoring with 1Hz refresh rate
- React UI with real-time charting (Recharts)
- Hardware abstraction layer (tempDll.js)
- Interrupt simulator for fallback mode
- Temperature store with ring buffer (5000 entries)
- IPC communication between main and renderer processes
- CSV export functionality
- Status panel with dual-unit display (Celsius/Fahrenheit)
- Mode switching between hardware and simulator
- Hardware health monitoring with 5-second timeout

### Technical Foundation
- Electron 40.1.0 with Node.js 18.x
- React 18.2.0 with hooks pattern
- Tailwind CSS 3.4.17 for styling
- Koffi 2.15.1 for native DLL binding
- Jest 29.7.0 for testing framework
- Webpack 5.91.0 for module bundling

### Development Workflow
- Git repository with main/develop/feature branching
- Semantic versioning established
- Jest test framework configured
- Electron Forge packaging pipeline

---

## Sprint History

### Sprint 1 (Weeks 1-2) - Foundation
- Proof of concept validating Electron + Koffi architecture
- Basic window creation and DLL loading test
- Project structure and workflow establishment
- Technology stack finalisation

### Sprint 2 (Weeks 3-4) - Core Architecture
- Hardware abstraction layer implementation
- Temperature store with ring buffer
- IPC protocol design and implementation
- Initial UI components

### Sprint 3 (Weeks 5-6) - User Interface
- Dashboard layout and styling
- Temperature chart with Recharts
- Status panel implementation
- Dark/light mode foundation

### Sprint 4 (Weeks 7-8) - Hardware Integration
- DLL callback mechanism implementation
- AMF channel issue resolution
- Hardware discovery and initialisation
- Automatic fallback mechanism

### Sprint 5 (Weeks 9-10) - Testing and Quality
- Comprehensive test suite development
- Memory leak detection and fixes
- Input validation implementation
- Security hardening

### Sprint 6 (Weeks 11-12) - Refinement
- Performance optimisation
- Error handling improvements
- Code quality improvements
- Documentation drafting

### Sprint 7 (Weeks 13-14) - Documentation and Release
- Complete documentation ecosystem
- Final testing and verification
- Version 1.1.0 release preparation
- Portfolio evidence compilation

---

## Release Tags

- `v1.1.0` - Production release with full documentation
- `v1.0.0` - Initial stable release

## Notes

- Project duration: 14 weeks (3.5 months)
- Total commits: 47
- Test coverage: 97.85% IPC, 100% temperature store
- Documentation: 6 comprehensive guides
- Known devices: E66480454F6D2F31, E6614103E71E2122
