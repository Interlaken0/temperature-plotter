# API Documentation
## Temperature Plotter Application Interface Reference

This document provides a comprehensive reference for the Temperature Plotter application's APIs, including IPC channels, main functions, and component interfaces.

## Table of Contents

- [IPC Channels](#ipc-channels)
- [Main Process APIs](#main-process-apis)
- [Renderer Components](#renderer-components)
- [Data Structures](#data-structures)
- [Usage Examples](#usage-examples)

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
  value: 24.5                    // Temperature in Celsius
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

### Error Response Format
```javascript
{
  success: false,
  error: "ECONNREFUSED",
  message: "Failed to connect to temperature sensor"
}
```

## Security Considerations

- All IPC communication uses `contextBridge` for security
- No Node.js APIs are exposed directly to renderer
- File operations are sandboxed and validated
- User input is sanitized before processing

---

**Last Updated:** February 2026  
**Version:** 1.0.0  
**For:** Temperature Plotter Application

For detailed implementation examples, see the source code in the respective modules.
