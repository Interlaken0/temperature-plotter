# Troubleshooting Guide
## Common Issues and Solutions for Temperature Plotter

Quick solutions to common problems encountered while setting up and running the Temperature Plotter application.

## Installation Issues

### "npm install fails with permission errors"
```bash
# Run as Administrator (Windows)
npm install

# Or change npm permissions
npm config set prefix ~/.npm-global
```

### "Node.js version incompatible"
```bash
# Check version (should be 16+)
node --version

# Update with nvm
nvm install 18 && nvm use 18
```

### "Python not found during build"
```bash
# Install Python and Windows Build Tools
choco install python
npm install --global --production windows-build-tools
```

## Development Setup Problems

### "npm start fails to start"
```bash
# Clean and rebuild
rm -rf .webpack/
npm start

# Check Electron installation
npm install electron --save-dev
```

### "Hot reload not working"
```bash
# Kill processes and restart
taskkill /f /im electron.exe
npm start

# Clear cache
rm -rf .webpack/cache/
```

### "Port already in use"
```bash
# Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /f
```

## Application Runtime Issues

### "Application window doesn't open"
```bash
# Check main process logs
npm start 2>&1 | tee main.log

# Verify files exist
ls src/renderer/index.html
cat src/main/preload.js
```

### "Temperature data not updating"
```bash
# Test simulator directly
node -e "require('./src/main/simulator.js').start()"

# Check DevTools console (Ctrl+Shift+I)
```

### "CSV export not working"
```bash
# Check file permissions
echo "test" > test.csv && rm test.csv

# Verify data exists
cat temperature_telemetry.csv
```

## Testing Problems

### "Tests fail with module not found"
```bash
# Check Jest configuration
cat package.json | grep -A 10 '"jest"'

# Use absolute paths in tests
require('../../src/main/simulator.js')
```

### "Coverage report not generating"
```bash
# Generate manually
npm test -- --coverage --coverageReporters=html

# Check coverage directory
ls coverage/
```

## Build and Package Issues

### "npm run make fails"
```bash
# Clean and reinstall
rm -rf node_modules/ package-lock.json
npm install
npm run make
```

### "npm run package fails"
```bash
# Clean output directory
rm -rf out/
npm run package
```

## Hardware Integration Issues

### "DLL not loading"
```bash
# Check DLL location
ls src/main/dll/

# Verify path in tempDll.js
const dllPath = path.join(__dirname, 'dll', 'TempMeasure64.dll');
```

### "Hardware not detected"
```bash
# Test DLL connection
node -e "require('./src/main/dll/tempDll.js').checkConnection()"

# Run as administrator if needed
```

## Platform-Specific Issues

### Windows Defender blocks application
- Add exclusion to Windows Security → Virus & threat protection
- Add exclusion for project directory and built executable

### Corrupted characters (┬░) in terminal
```powershell
# Force UTF-8 encoding
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
```

### Path separator issues
```javascript
// Use path module instead of hardcoded paths
const path = require('path');
const filePath = path.join(__dirname, 'data', 'file.csv');
```

## Version 1.1.0 Specific Issues

### Fahrenheit display problems
```javascript
// Check conversion function
const fahrenheit = (celsius * 9/5) + 32;

// Verify data structure
{ timestamp: 123, value: 24.5, fahrenheit: 76.1, source: "REAL" }
```

### Console output missing colours
```javascript
// Verify import
const consoleColours = require('./utils/consoleColours');
consoleColours.success('Test message');
consoleColours.hardware('Hardware test');
consoleColours.simulator('Simulator test');
consoleColours.temperature(24.5, 76.1, 'REAL');

// Force colour output
process.env.FORCE_COLOR = '1';

// Test terminal compatibility
echo -e "\033[31mRed Text\033[0m"
```

## Quick-Fix Solutions

| Problem | Quick Fix | Time |
|---------|-----------|------|
| App won't start | `npm install && npm start` | 2 mins |
| No temperature data | Check hardware connection | 1 min |
| Console garbled text | Use ASCII-safe notation | 30 secs |
| Tests failing | `npm test -- --updateSnapshot` | 1 min |
| Export not working | Check file permissions | 1 min |
| UI not updating | Restart application | 30 secs |

## Diagnostic Commands

```bash
# System health check
npm test && npm run make

# Test hardware connection
node -e "require('./src/main/dll/tempDll.js').checkConnection()"

# Test console utilities
node -e "require('./src/main/utils/consoleColours'); console.log('OK')"

# Test console functions individually
node -e "
const consoleColours = require('./src/main/utils/consoleColours');
consoleColours.success('Test success');
consoleColours.error('Test error');
consoleColours.warning('Test warning');
consoleColours.info('Test info');
consoleColours.hardware('Test hardware');
consoleColours.simulator('Test simulator');
consoleColours.temperature(24.5, 76.1, 'REAL');
consoleColours.status('Test status');
consoleColours.separator();
consoleColours.header('Test Header');
"

# Enable debug mode
set DEBUG=temperature-plotter:*
npm start
```

## Getting Help

### Debug Mode
```bash
# Enable debug logging
set DEBUG=temperature-plotter:*
npm start
```

### Log Files
- **Main process:** Check terminal output
- **Renderer:** Open DevTools (Ctrl+Shift+I) → Console tab

### Community Support
1. Search GitHub issues for similar problems
2. Create issue with error messages and system info
3. Include diagnostic output

### Related Documentation
- **API Documentation:** `docs/API.md` - IPC channels and data structures
- **System Architecture:** `docs/SYSTEM-ARCHITECTURE.md` - Design patterns
- **Development Guide:** `docs/CONTRIBUTING.md` - Setup and standards

---

*Simplified troubleshooting guide for AMF Temperature Plotter*