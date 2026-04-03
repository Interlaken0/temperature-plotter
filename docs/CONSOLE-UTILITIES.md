# Console Utilities Documentation
## AMF Temperature Plotter - Complete API Reference

**File:** `src/main/utils/consoleColours.js`  
**Purpose:** Enhanced terminal output with colour coding and structured formatting for application logging.

---

## Exported Objects

### colours Object

15 ANSI colour codes for terminal output:

| Property | ANSI Code | Purpose |
|----------|-----------|---------|
| reset | `\x1b[0m` | Reset all formatting |
| bright | `\x1b[1m` | Bold/bright text |
| dim | `\x1b[2m` | Dimmed text |
| red | `\x1b[31m` | Error messages |
| green | `\x1b[32m` | Success messages |
| yellow | `\x1b[33m` | Warning messages |
| blue | `\x1b[34m` | Hardware messages, info status |
| magenta | `\x1b[35m` | Simulator messages |
| cyan | `\x1b[36m` | Info messages, headers |
| white | `\x1b[37m` | Default text |
| gray | `\x1b[90m` | Secondary text |
| bgRed | `\x1b[41m` | Red background |
| bgGreen | `\x1b[42m` | Green background |
| bgYellow | `\x1b[43m` | Yellow background |
| bgBlue | `\x1b[44m` | Blue background |

### symbols Object

7 symbol definitions for message prefixes:

| Property | Symbol | Usage |
|----------|--------|-------|
| success | `[OK]` | Success messages |
| error | `[ERROR]` | Error messages |
| warning | `[!]` | Warning messages |
| info | `[i]` | Info messages |
| hardware | `[+]` | Hardware-related messages |
| simulator | `[~]` | Simulator-related messages |
| temperature | `[TEMP]` | Temperature readings |

---

## Logging Functions

### success(message)
**Output:** Green with [OK] prefix  
**Format:** `[OK] {message}`

**Actual Console Calls:**
- `success('Hardware HAL: DLL loaded from ${assetsFolder}')` - tempDll.js:61
- `success('SUCCESS: Initialised Pico ID [${serial}]')` - tempDll.js:137
- `success('Hardware signal detected! Initiating switch...')` - main.js:54

---

### error(message)
**Output:** Red with [ERROR] prefix  
**Format:** `[ERROR] {message}`

**Actual Console Calls:**
- `error('Koffi load failed: ${err.message}')` - tempDll.js:23
- `error('Hardware HAL: Function binding failed: ' + err.message)` - tempDll.js:76
- `error('Discovery Error: ${err.message}')` - tempDll.js:140
- `error('Health check error: ' + e.message)` - main.js:66
- `error('Error stopping device: ' + e.message)` - main.js:101
- `error('Failed to load hardware DLL on startup: ' + e.message)` - main.js:139
- `error('Force hardware failed: ' + e.message)` - main.js:206

---

### warning(message)
**Output:** Yellow with [!] prefix  
**Format:** `[!] {message}`

**Actual Console Calls:**
- `warning('Hardware HAL Failure: ${e.message}')` - tempDll.js:66
- `warning('Hardware timeout detected. Hardware DLL dropped connection.')` - main.js:98

---

### info(message)
**Output:** Cyan with [i] prefix  
**Format:** `[i] {message}`

**Actual Console Calls:**
- `info('Starting hardware monitoring...')` - main.js:33

---

### hardware(message)
**Output:** Blue with [+] [HAL] prefix  
**Format:** `[+] [HAL] {message}`

**Actual Console Calls:**
- `hardware('Handshake Success: Forcing 30.00°C')` - tempDll.js:103

---

### simulator(message)
**Output:** Magenta with [~] SIMULATOR prefix  
**Format:** `[~] SIMULATOR {message}`

**Actual Console Calls:**
- `simulator('Stopped: No final reading sent (Hardware disconnected - using simulation)')` - simulator.js:58

---

### temperature(celsius, fahrenheit, source)
**Parameters:**
- `celsius` (number): Temperature in Celsius
- `fahrenheit` (number): Temperature in Fahrenheit
- `source` (string): Data source - either `'CONNECTED'` or `'SIMULATOR'`

**Output Format:**
- Connected/Hardware: Green with [+] prefix - `[+] [CONNECTED] XX.XX deg C (XX.XX deg F)`
- Simulator: Magenta with [~] prefix - `[~] [SIMULATOR] XX.XX deg C (XX.XX deg F)`

**Actual Console Calls:**
- `temperature(outputTemp, fahrenheit, 'CONNECTED')` - tempDll.js:109
- `temperature(reading, fahrenheit, 'SIMULATOR')` - simulator.js:48

---

### status(message, type = 'info')
**Parameters:**
- `message` (string): Status message to display
- `type` (string): Message type - 'success', 'error', 'warning', or 'info' (default)

**Colour Mapping:**
- success: Green
- error: Red
- warning: Yellow
- info: Blue (default)

**Output Format:** `> {message}`

**Actual Console Calls:**
- `status('Switching back to hardware mode', 'success')` - main.js:79

---

### separator()
**Output:** 50 equal signs with dim formatting  
**Format:** `==================================================` (dimmed)

**Purpose:** Visual separator for console output sections

---

### header(title)
**Output:** Cyan header with uppercase conversion and 50-equal borders  
**Format:**
```
==================================================
  {TITLE IN UPPERCASE}
==================================================
```

**Actual Console Calls:**
- `header('AMF-Temperature-Plotter Starting')` - main.js:16

---

## Complete Console Message Inventory

### Hardware Layer Messages (tempDll.js)

| Function | Message | Line |
|----------|---------|------|
| error | `Koffi load failed: ${err.message}` | 23 |
| success | `Hardware HAL: DLL loaded from ${assetsFolder}` | 61 |
| warning | `Hardware HAL Failure: ${e.message}` | 66 |
| error | `Hardware HAL: Function binding failed: ${err.message}` | 76 |
| hardware | `Handshake Success: Forcing 30.00°C` | 103 |
| temperature | `temperature(outputTemp, fahrenheit, 'CONNECTED')` | 109 |
| success | `SUCCESS: Initialised Pico ID [${serial}]` | 137 |
| error | `Discovery Error: ${err.message}` | 140 |

### Simulator Messages (simulator.js)

| Function | Message | Line |
|----------|---------|------|
| temperature | `temperature(reading, fahrenheit, 'SIMULATOR')` | 48 |
| simulator | `Stopped: No final reading sent (Hardware disconnected - using simulation)` | 58 |

### Main Process Messages (main.js)

| Function | Message | Line |
|----------|---------|------|
| header | `AMF-Temperature-Plotter Starting` | 16 |
| info | `Starting hardware monitoring...` | 33 |
| success | `Hardware signal detected! Initiating switch...` | 54 |
| status | `Switching back to hardware mode` (type: 'success') | 79 |
| warning | `Hardware timeout detected. Hardware DLL dropped connection.` | 98 |
| error | `Error stopping device: ${e.message}` | 101 |
| error | `Failed to load hardware DLL on startup: ${e.message}` | 139 |
| error | `Force hardware failed: ${e.message}` | 206 |
| error | `Health check error: ${e.message}` | 66 |

---

## Usage Examples

```javascript
const consoleColours = require('./utils/consoleColours');

// Basic logging
consoleColours.success('Operation completed');
consoleColours.error('Something went wrong');
consoleColours.warning('Please check configuration');
consoleColours.info('Processing started');

// Hardware and simulator specific
consoleColours.hardware('Device connected');
consoleColours.simulator('Fallback mode activated');

// Temperature readings
consoleColours.temperature(25.5, 77.9, 'CONNECTED');
consoleColours.temperature(22.5, 72.5, 'SIMULATOR');

// Status messages
consoleColours.status('System ready', 'success');
consoleColours.status('Connection lost', 'error');
consoleColours.status('Retrying...', 'warning');
consoleColours.status('Processing data', 'info'); // default

// Visual formatting
consoleColours.separator();
consoleColours.header('System Initialisation');
```

---

## Implementation Notes

- All functions use `console.log()` for output
- Colours are applied using ANSI escape codes
- The `bright` attribute is combined with colour codes for emphasis
- All functions automatically reset formatting after output
- Temperature values are formatted to 2 decimal places using `.toFixed(2)`
- Header function converts the title to uppercase

---

*Zero Tolerance Documentation - This file accurately reflects the implementation in src/main/utils/consoleColours.js*
