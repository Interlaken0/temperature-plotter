# API Documentation
## Temperature Plotter Application Interface Reference

This document provides a comprehensive reference for the Temperature Plotter application's APIs, including IPC channels, main functions, and component interfaces.

## Table of Contents

- [IPC Channels](#ipc-channels)
- [Main Process APIs](#main-process-apis)
- [Renderer Components](#renderer-components)
- [Data Structures](#data-structures)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Performance Considerations](#performance-considerations)
- [Migration Guide](#migration-guide-100--110)
- [Debugging](#debugging)
- [Security Considerations](#security-considerations)

## IPC Channels

### Temperature Data Channels

#### `temperature-update`
**Direction:** Main → Renderer  
**Frequency:** 1Hz  
**Data:** Temperature reading object

```javascript
{
  timestamp: 1715694820123,    // Unix timestamp
  iso_time: "2024-02-20T14:45:32.123Z",  // ISO 8601
  value: 24.5,                   // Temperature in Celsius
  fahrenheit: 76.1,              // Pre-calculated Fahrenheit
  source: "REAL"                 // "REAL" or "SIMULATED"
}
```

#### `mode:change`
**Direction:** Main → Renderer   
**Purpose:** Instant notification when the system swaps between Hardware and Simulator (e.g., on timeout or reconnection).

```javascript
{
  mode: "simulator", 
  reason: "Hardware timeout detected",
  timestamp: "2026-02-26T16:20:00.000Z"
}
```

#### `temperature-status`
**Direction:** Main → Renderer  
**Purpose:** Hardware connection status updates

```javascript
{
  connected: true,               // Connection status
  mode: "simulator",           // "simulator" or "hardware"
  port: "COM3"                 // Communication port (hardware mode)
}
```

### User Action Channels

#### `export-csv`
**Direction:** Renderer → Main  
**Purpose:** Request CSV export of temperature data

```javascript
// Request (no payload)
window.api.exportCsv()

// Response
{
  success: true,
  filepath: "C:\\Users\\User\\Downloads\\temperature_export_20240220.csv",
  recordCount: 1440
}
```

#### `force-hardware-mode`
**Direction:** Renderer → Main   
**Purpose:** Manually trigger a DLL refresh and attempt to re-establish hardware connection.

```javascript
// Request
const result = await window.api.invoke('force-hardware-mode');

// Response
{ success: true } // or { success: false, message: "Error details" }
```

#### `get-historical-data`
**Direction:** Renderer → Main  
**Purpose:** Retrieve historical temperature data

```javascript
// Request
window.api.getHistoricalData()

// Response
{
  success: true,
  data: [
    { timestamp: 1715694820123, iso_time: "2024-02-20T14:45:32.123Z", value: 24.5 },
    // ... more records
  ]
}
```

## Main Process APIs

### Console Utilities (`src/utils/consoleColours.js`)

#### `logTemperature(temperatureData)`
Logs temperature data with colour-coded formatting and ASCII-safe notation.

**Parameters:**
- `temperatureData` (object): Temperature reading object
  - `value` (number): Temperature in Celsius
  - `fahrenheit` (number): Temperature in Fahrenheit
  - `source` (string): Data source ("REAL" or "SIMULATED")
  - `timestamp` (number): Unix timestamp

**Returns:** void

**Example:**
```javascript
const { logTemperature } = require('./utils/consoleColours');
logTemperature({
  value: 24.5,
  fahrenheit: 76.1,
  source: "REAL",
  timestamp: Date.now()
});
// Output: ✓ [REAL] 24.5°C (76.1°F) at 2026-02-26T16:20:00.000Z
```

#### `logStatus(message, type)`
Logs status messages with appropriate colour coding.

**Parameters:**
- `message` (string): Status message to display
- `type` (string): Log type ("info", "success", "warning", "error")

**Returns:** void

**Example:**
```javascript
const { logStatus } = require('./utils/consoleColours');
logStatus("Hardware connected", "success");
logStatus("Connection timeout", "warning");
logStatus("DLL not found", "error");
```

#### `celsiusToFahrenheit(celsius)`
Converts Celsius to Fahrenheit with proper formatting.

**Parameters:**
- `celsius` (number): Temperature in Celsius

**Returns:** number - Temperature in Fahrenheit

**Example:**
```javascript
const { celsiusToFahrenheit } = require('./utils/consoleColours');
const fahrenheit = celsiusToFahrenheit(24.5); // 76.1
```

### Temperature Store (`src/main/state/temperatureStore.js`)

#### `updateTemperature(temperature)`
Updates the temperature store with new reading.

**Parameters:**
- `temperature` (number): Temperature value in Celsius

**Returns:** boolean - Success status

#### `getHistoricalData(limit)`
Retrieves historical temperature data.

**Parameters:**
- `limit` (number, optional): Maximum number of records to return

**Returns:** Array of temperature objects

#### `getStatus()`
Gets current store status.

**Returns:** Object with connection status and statistics

### Hardware Abstraction Layer (`src/main/dll/tempDll.js`)

#### `initialize()`
Initializes hardware connection.

**Returns:** Promise<boolean> - Connection success

#### `startMonitoring()`
Starts real-time temperature monitoring.

**Returns:** Promise<void>

#### `stopMonitoring()`
Stops temperature monitoring.

**Returns:** Promise<void>

#### `getTemperature()`
Gets current temperature reading.

**Returns:** Promise<number> - Temperature in Celsius

### Simulator (`src/main/simulator.js`)

#### `start()`
Starts temperature simulation.

**Returns:** void

#### `stop()`
Stops temperature simulation.

**Returns:** void

#### `setFrequency(frequency)`
Sets simulation frequency.

**Parameters:**
- `frequency` (number): Update frequency in milliseconds

**Returns:** void

## Renderer Components

### TemperatureChart Component
**Location:** `src/renderer/components/TemperatureChart.jsx`

**Props:**
```javascript
{
  data: Array<TemperatureReading>,  // Temperature data array
  width: number,                    // Chart width
  height: number,                    // Chart height
  showGrid: boolean,                 // Grid visibility
  timeRange: number                  // Time range in minutes
}
```

**Usage Example:**
```jsx
import TemperatureChart from './components/TemperatureChart';

<TemperatureChart
  data={temperatureData}
  width={800}
  height={400}
  showGrid={true}
  timeRange={60}
/>
```

### useTemperature Hook
**Location:** `src/renderer/hooks/useTemperature.js`

**Returns:**
```javascript
{
  currentTemperature: number,          // Latest temperature
  temperatureHistory: Array,         // Historical data
  isConnected: boolean,             // Connection status
  mode: string,                    // "simulator" or "hardware"
  exportCsv: () => Promise,        // Export function
  getHistoricalData: () => Promise  // Historical data function
}
```

**Usage Example:**
```jsx
import { useTemperature } from './hooks/useTemperature';

function TemperatureDisplay() {
  const { currentTemperature, isConnected, exportCsv } = useTemperature();
  
  return (
    <div>
      <p>Current: {currentTemperature}°C</p>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <button onClick={exportCsv}>Export CSV</button>
    </div>
  );
}
```

## Data Structures

### TemperatureReading
```javascript
interface TemperatureReading {
  timestamp: number;      // Unix timestamp (milliseconds)
  iso_time: string;       // ISO 8601 formatted time
  value: number;          // Temperature in Celsius
  fahrenheit?: number;    // Temperature in Fahrenheit (optional)
  source?: string;        // Data source: "REAL" or "SIMULATED" (optional)
}
```

### ConnectionStatus
```javascript
interface ConnectionStatus {
  connected: boolean;     // Connection state
  mode: string;          // "simulator" or "hardware"
  port?: string;         // Communication port (hardware mode only)
  lastUpdate?: number;    // Last update timestamp
}
```

### ExportResult
```javascript
interface ExportResult {
  success: boolean;       // Export success status
  filepath?: string;      // Export file path (success only)
  recordCount?: number;   // Number of records exported
  error?: string;         // Error message (failure only)
}
```

## Usage Examples

### Basic Temperature Monitoring
```javascript
// In renderer process
import { useTemperature } from './hooks/useTemperature';

function App() {
  const { currentTemperature, isConnected } = useTemperature();
  
  useEffect(() => {
    // Component automatically receives temperature updates
  }, [currentTemperature]);
  
  return (
    <div>
      <h1>Temperature: {currentTemperature}°C</h1>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
    </div>
  );
}
```

### CSV Export Implementation
```javascript
// In renderer process
async function handleExport() {
  try {
    const result = await window.api.exportCsv();
    if (result.success) {
      alert(`Exported ${result.recordCount} records to ${result.filepath}`);
    } else {
      alert('Export failed');
    }
  } catch (error) {
    alert('Export error: ' + error.message);
  }
}
```

### Hardware Integration
```javascript
// In main process
const tempDll = require('./dll/tempDll');

async function initializeHardware() {
  try {
    const connected = await tempDll.initialize();
    if (connected) {
      await tempDll.startMonitoring();
      console.log('Hardware monitoring started');
    } else {
      console.log('Using simulator mode');
    }
  } catch (error) {
    console.error('Hardware initialization failed:', error);
  }
}
```

## Error Handling

### Common Error Codes
- `ECONNREFUSED`: Hardware connection failed
- `ETIMEDOUT`: Hardware response timeout
- `EACCES`: Permission denied (hardware access)
- `ENOENT`: File not found (DLL or data file)
- `EENCODING`: Console encoding corruption (┬░ characters)
- `ECONVERSION`: Fahrenheit conversion failed
- `EMODESWITCH`: Hardware mode switching failed
- `ECONSOLEUTIL`: Console utilities not available

### 1.1.0 Specific Error Responses

#### Console Encoding Error
```javascript
{
  success: false,
  error: "EENCODING",
  message: "Console encoding corrupted - use ASCII-safe notation",
  solution: "Ensure consoleColours.js is used for terminal output"
}
```

#### Mode Switch Error
```javascript
{
  success: false,
  error: "EMODESWITCH",
  message: "Failed to switch to hardware mode",
  details: "Hardware timeout after 5000ms"
}
```

### Standard Error Response Format
```javascript
{
  success: false,
  error: "ERROR_CODE",
  message: "Human-readable error description",
  details?: "Additional technical details",
  solution?: "Suggested fix or workaround"
}
```

## Security Considerations

- All IPC communication uses `contextBridge` for security
- No Node.js APIs are exposed directly to renderer
- File operations are sandboxed and validated
- User input is sanitized before processing

## Performance Considerations

### Rate Limiting
- **Temperature Updates**: Limited to 1Hz to prevent UI overload
- **Hardware Polling**: Maximum 10 requests per second
- **Console Output**: Buffered to prevent terminal spam

### Memory Management
- **Ring Buffer**: Fixed 1000-entry limit for temperature history
- **Console Logs**: Automatic cleanup of old entries
- **IPC Messages**: Payload size limited to 1KB

### CPU Usage
- **Temperature Conversion**: Optimised for minimal overhead
- **Chart Rendering**: Debounced to 60fps maximum
- **File Operations**: Asynchronous to prevent blocking

## Migration Guide (1.0.0 → 1.1.0)

### Breaking Changes
None - all 1.0.0 APIs remain compatible.

### New Features
1. **Fahrenheit Support**: Temperature objects now include `fahrenheit` field
2. **Source Tracking**: Temperature objects now include `source` field
3. **Mode Notifications**: New `mode:change` IPC channel
4. **Console Utilities**: New `consoleColours.js` module available

### Recommended Updates
```javascript
// Before (1.0.0)
console.log(`Temperature: ${temp.value}°C`);

// After (1.1.0)
const { logTemperature } = require('./utils/consoleColours');
logTemperature(temp);
```

## Debugging

### IPC Communication Debugging
```javascript
// Enable IPC logging in main process
process.env.DEBUG_IPC = 'true';

// Monitor IPC traffic in renderer
window.api.on('debug-ipc', (event, data) => {
  console.log('IPC Debug:', data);
});
```

### Console Output Debugging
```javascript
// Test console utilities
const { testColours } = require('./utils/consoleColours');
testColours(); // Outputs colour test pattern

// Verify ASCII-safe notation
const { logTemperature } = require('./utils/consoleColours');
logTemperature({
  value: 24.5,
  fahrenheit: 76.1,
  source: "TEST",
  timestamp: Date.now()
});
```

### Hardware Debugging
```javascript
// Test hardware connection directly
const tempDll = require('./dll/tempDll');
tempDll.testConnection()
  .then(result => console.log('Hardware test:', result))
  .catch(error => console.error('Hardware error:', error));
```

---

**Last Updated:** February 2026  
**Version:** 1.1.0  
**For:** Temperature Plotter Application

For detailed implementation examples, see the source code in the respective modules.
