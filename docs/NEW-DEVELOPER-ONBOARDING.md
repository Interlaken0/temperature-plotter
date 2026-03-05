# New Developer Onboarding Guide

## Overview

This guide provides a structured reading order for new developers joining the Temperature Plotter project. Following this sequence will take you from complete project ignorance to productive contributor in approximately 2.5 hours.

## Phase 1: Project Understanding (15 minutes)

### 1. README.md (Root)
**Why first:** Complete project overview and quick start

**What you'll learn:**
- What the project does and why
- How to install and run it
- Key features and capabilities
- Where to find everything

### 2. docs/COMPLETE-DOCUMENTATION-GUIDE.md
**Why second:** Navigation map for all documentation

**What you'll learn:**
- Where every document is located
- What each document contains
- How documents relate to each other
- Best reading order

## Phase 2: Technical Architecture (30 minutes)

### 3. docs/SYSTEM-ARCHITECTURE.md
**Why third:** How the system is designed

**What you'll learn:**
- System architecture diagrams
- Data flow between processes
- Component relationships
- Technical design decisions

### 4. docs/API.md
**Why fourth:** How to work with the code

**What you'll learn:**
- IPC channels and communication
- Main process APIs
- Renderer components
- Data structures and usage examples

## Phase 3: Development Setup (20 minutes)

### 5. docs/CONTRIBUTING.md
**Why fifth:** How to develop safely

**What you'll learn:**
- Development environment setup
- Code style and conventions
- Testing requirements
- Git workflow and commit standards

### 6. __tests__/README.md
**Why sixth:** How testing works

**What you'll learn:**
- Test structure and organisation
- How to run tests
- Test categories and purposes
- Coverage expectations

## Phase 4: Code Deep Dive (45 minutes)

### 7. Source Code Exploration

**Order to read:**
1. `src/main/main.js` - Application entry point
2. `src/main/state/temperatureStore.js` - Data management
3. `src/main/preload.js` - IPC bridge setup
4. `src/renderer/App.jsx` - React application root
5. `src/renderer/components/` - UI components
6. `src/renderer/hooks/` - Custom React hooks
7. `src/main/utils/consoleColours.js` - Cross-platform console utilities with ANSI colour formatting, semantic logging functions, and ASCII-safe notation for professional terminal output

### Console Utilities Deep Dive

The `consoleColours.js` module provides professional logging with 10 specialised functions:

**Core Logging Functions:**
- `success(message)` - Green [OK] prefixed messages
- `error(message)` - Red [ERROR] prefixed messages  
- `warning(message)` - Yellow [!] prefixed messages
- `info(message)` - Cyan [i] prefixed messages

**Context-Specific Functions:**
- `hardware(message)` - Blue [+] [HAL] prefixed hardware messages
- `simulator(message)` - Magenta [~] SIMULATOR formatted messages
- `temperature(celsius, fahrenheit, source = 'REAL')` - Temperature logging with source-aware colouring (defaults to 'REAL')
- `status(message, type = 'info')` - Configurable status messages with type-based colouring ('success'=green, 'error'=red, 'warning'=yellow, 'info'=blue)

**Utility Functions:**
- `separator()` - Visual separator lines for console organisation
- `header(title)` - Formatted section headers with uppercase conversion

**Exported Objects:**
- `colours` - ANSI colour code object (reset, bright, dim, red, green, yellow, blue, magenta, cyan, white, gray, bgRed, bgGreen, bgYellow, bgBlue)
- `symbols` - Symbol definitions object (success: '[OK]', error: '[ERROR]', warning: '[!]', info: '[i]', hardware: '[+]', simulator: '[~]', temperature: '[TEMP]')

**Key Features:**
- ANSI colour formatting for visual distinction
- ASCII-safe notation (deg C instead of °C symbol)
- Cross-platform terminal compatibility
- 50KB stable memory footprint
- Semantic logging with meaningful prefixes

**Usage Examples (seen in actual codebase):**
```javascript
// From main.js
consoleColours.header('AMF-Temperature-Plotter Starting');
consoleColours.info('Starting hardware monitoring...');
consoleColours.success('Hardware signal detected! Initiating switch...');
consoleColours.status('Performing hard DLL refresh to check for new device...', 'info');
consoleColours.warning('Hardware timeout detected. Injecting final 10.00 deg C reading.');

// From tempDll.js
consoleColours.hardware(`Session Start: Forcing 30.00 deg C (Sensor was: ${fTemp.toFixed(2)})`);
consoleColours.temperature(24.5, 76.1, 'REAL');
consoleColours.error('Hardware Start Error: ' + err.message);

// From simulator.js
consoleColours.temperature(22.0, 71.6, 'SIMULATOR');
consoleColours.simulator('Stopped: No final reading sent (Hardware disconnected - using simulation)');
```

## Phase 5: Advanced Topics (30 minutes)

### 8. docs/CHANGELOG.md
**Why eighth:** Project evolution and decisions

**What you'll learn:**
- Version history and changes
- Feature development timeline
- Bug fixes and improvements
- Technical debt and resolutions
- Recent evolution from static to dynamic reporting (v1.1.0)

### 9. TROUBLESHOOTING.md
**Why ninth:** Common problems and solutions

**What you'll learn:**
- Known issues and fixes
- Debugging techniques
- Hardware integration problems
- Performance optimisation tips

## Phase 6: EPA Context (Optional - 15 minutes)

### 10. EPA-PORTFOLIO-SUMMARY.md
**Why last:** Project purpose and assessment context

**What you'll learn:**
- Why the project was built
- What skills it demonstrates
- Assessment requirements met
- Business impact and value

## Quick Reference - Developer Essentials

### For Immediate Work:
- **Running the app:** README.md → Installation section
- **Making changes:** docs/CONTRIBUTING.md → Development guidelines
- **Testing:** __tests__/README.md → Test commands
- **API usage:** docs/API.md → Function references

### For Understanding Architecture:
- **Big picture:** docs/system-architecture.md → Diagrams
- **Data flow:** docs/API.md → IPC channels
- **Component structure:** Source code exploration

### For Problem Solving:
- **Common issues:** TROUBLESHOOTING.md
- **Test failures:** __tests__/README.md
- **Code style:** docs/CONTRIBUTING.md

## Total Time Investment: ~2.5 hours

This reading order takes a new developer from complete ignorance to productive contributor by building understanding progressively from high-level overview to deep technical details.

## Additional Resources

- **Project Repository:** https://github.com/Interlaken0/temperature-plotter
- **Test Evidence:** evidence/test-reports/
- **Visual Documentation:** evidence/screenshots/
- **Performance Metrics:** evidence/PERFORMANCE-METRICS.md

## Getting Help

If you need clarification after completing this onboarding sequence:
1. Check TROUBLESHOOTING.md for common issues
2. Review the test suite for usage examples
3. Examine the API documentation for technical details
4. Refer to the complete documentation guide for additional resources

---

*This document is part of the Temperature Plotter project documentation suite. For a complete list of all available documentation, see docs/COMPLETE-DOCUMENTATION-GUIDE.md.*
