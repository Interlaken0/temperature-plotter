# API Documentation
## Temperature Plotter Application Interface Reference

Temperature monitoring application API reference for IPC channels, main functions, and components.

## IPC Channels

### Temperature Data Channels

#### `temperature:update`
**Direction:** Main → Renderer  
**Frequency:** 1Hz  
**Data:** Temperature reading object

```javascript
{
  temp: 24.5,                   // Temperature in Celsius
  history: [                   // Historical temperature array
    { time: 1715694820123, temp: 24.3 },
    { time: 1715694821123, temp: 24.5 }
  ]
}
```

#### `mode:change`
**Direction:** Main → Renderer   
**Purpose:** Notification when system swaps between Hardware and Simulator

```javascript
{
  mode: "simulator", 
  reason: "Hardware timeout detected",
  timestamp: "2026-02-26T16:20:00.000Z"
}
```

### User Action Channels

#### `save-csv`
**Direction:** Renderer → Main  
**Purpose:** Request CSV export

```javascript
// Request
window.api.saveCSV()

// Response
{
  success: true,
  canceled: false
}
```

#### `get-device-status`
**Direction:** Renderer → Main  
**Purpose:** Get device status

```javascript
// Request
window.api.getDeviceStatus()

// Response
{
  mode: "simulator",           // "simulator" or "hardware"
  healthy: true,               // Device health status
  lastUpdate: 1715694820123,   // Last update timestamp
  deviceType: "Simulator"      // Device class name
}
```

#### `switch-mode`
**Direction:** Renderer → Main   
**Purpose:** Switch between hardware and simulator modes

```javascript
// Request
const result = await window.api.switchMode({ mode: 'simulator' });

// Response
{ success: true, mode: "simulator" }
```

#### `force-hardware-mode`
**Direction:** Renderer → Main   
**Purpose:** Force hardware mode for testing

```javascript
// Request
const result = await window.api.forceHardwareMode();

// Response
{ success: true } // or { success: false, message: "Error details" }
```

## Main Process APIs

### Console Utilities (`src/main/utils/consoleColours.js`)

#### Logging Functions
- **success(message)**: Green output with [OK] prefix
- **error(message)**: Red output with [ERROR] prefix  
- **warning(message)**: Yellow output with [!] prefix
- **info(message)**: Cyan output with [i] prefix
- **hardware(message)**: Blue output with [+] [HAL] prefix
- **simulator(message)**: Magenta output with [~] SIMULATOR prefix
- **temperature(celsius, fahrenheit, source = 'REAL')**: Dynamic colour based on source (green for REAL, magenta for SIMULATOR)
- **status(message, type = 'info')**: Type-dependent colour with > prefix (blue default)
- **separator()**: 50 equal signs with dim formatting
- **header(title)**: Cyan header with 50 equal borders and uppercase conversion

#### Exported Objects
- **colours**: 15 ANSI colour codes (reset, bright, dim, red, green, yellow, blue, magenta, cyan, white, gray, bgRed, bgGreen, bgYellow, bgBlue)
- **symbols**: 7 symbol definitions (success, error, warning, info, hardware, simulator, temperature)

### Temperature Store (`src/main/state/temperatureStore.js`)
- **updateTemperature(val, isHardware = false)**: Add new reading with input validation
- **onUpdate(cb)**: Register temperature update listener
- **removeListener(cb)**: Remove specific listener (memory leak prevention)
- **removeAllListeners()**: Clear all listeners (testing utility)
- **get()**: Get current temperature and history
- **Features**: Ring buffer (5000 entries), input validation (-50°C to 200°C), event broadcasting

### Hardware Layer (`src/main/dll/tempDll.js`)
- **start()**: Start hardware monitoring
- **stop()**: Stop hardware monitoring

### Simulator (`src/main/simulator.js`)
- **start()**: Start temperature simulation
- **stop()**: Stop temperature simulation

## Renderer Components

### Core Components
- **App.jsx**: Root component and state management
- **TemperatureChart**: Real-time temperature chart
- **StatusPanel**: Current temperature display
- **ModeStatus**: Device mode and health display
- **SaveButton**: CSV export functionality
- **ThemeButton**: Dark/light mode toggle

### useTemperature Hook
**Location:** `src/renderer/hooks/useTemperature.js`

**Returns:**
```javascript
{
  temp: number,                     // Current temperature
  history: Array<TemperatureReading>, // Limited history for performance
  unlimitedHistory: Array<TemperatureReading> // Complete session history
}
```

**Usage:**
```javascript
const { temp, history, unlimitedHistory } = useTemperature();
```

## Data Structures

### TemperatureReading
```javascript
{
  time: number,          // Unix timestamp
  temp: number,         // Temperature in Celsius
  isHardwareMode: boolean // Data source indicator
}
```

### DeviceStatus
```javascript
{
  mode: string,         // "simulator" or "hardware"
  healthy: boolean,     // Device health status
  lastUpdate: number,   // Last update timestamp
  deviceType: string    // Device class name
}
```

## Usage Examples

### Basic Temperature Monitoring
```javascript
import { useTemperature } from './hooks/useTemperature';

function App() {
  const { temp, history } = useTemperature();
  
  return (
    <div>
      <h1>Temperature: {temp}°C</h1>
      <p>History: {history.length} readings</p>
    </div>
  );
}
```

### CSV Export
```javascript
async function handleExport() {
  try {
    const result = await window.api.saveCSV();
    if (result.success) {
      alert('CSV exported successfully');
    }
  } catch (error) {
    alert('Export error: ' + error.message);
  }
}
```

### Device Status Check
```javascript
async function checkDeviceStatus() {
  const status = await window.api.getDeviceStatus();
  console.log(`Device mode: ${status.mode}`);
  console.log(`Device healthy: ${status.healthy}`);
}
```

### Mode Switching
```javascript
async function switchToSimulator() {
  const result = await window.api.switchMode({ mode: 'simulator' });
  if (result.success) {
    console.log('Switched to simulator mode');
  }
}
```

## Error Handling

### Common Error Codes
- `ECONNREFUSED`: Hardware connection failed
- `ETIMEDOUT`: Hardware response timeout
- `EACCES`: Permission denied
- `ENOENT`: File not found
- `EENCODING`: Console encoding corruption

### Error Response Format
```javascript
{
  success: false,
  error: "ERROR_CODE",
  message: "Human-readable error description"
}
```

## Security

- Renderer process sandboxing
- Context isolation enabled
- Node integration disabled
- Input validation (-50°C to 200°C)
- Secure file access controls

## Performance

- **Temperature Updates**: Limited to 1Hz
- **Memory**: Ring buffer with 5000-entry limit
- **CPU**: Optimised temperature conversion
- **UI**: Debounced chart rendering at 60fps

---

*Simplified API reference for AMF Temperature Plotter*