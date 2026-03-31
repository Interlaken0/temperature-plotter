# Use Cases - AMF Temperature Plotter

## Overview
Use cases for the AMF Temperature Plotter standalone desktop application.

## Actors

### Primary Actor
- **Industrial Operator**: Monitors temperature readings, manages configuration, and exports data

### Secondary Actors
- **Hardware Interface**: Temperature sensors via KOFFI DLL
- **In-Memory Storage**: Ring buffer for temperature data

## Use Cases

### UC-01: Monitor Real-Time Temperature
**Actor**: Industrial Operator  
**Description**: Monitor live temperature readings from hardware sensors  
**Preconditions**: Application running, hardware connected

**Main Flow**:
1. User launches application
2. System connects to hardware
3. Real-time data displayed on dashboard
4. Continuous temperature updates
5. Status indicators shown

**Alternative Flows**:
- **A1**: Hardware unavailable - Switch to simulation mode
- **A2**: Threshold exceeded - Trigger alerts
- **A3**: Connection lost - Attempt reconnection

**Postconditions**: User can view current temperature and status

---

### UC-02: Configure Application Settings
**Actor**: Industrial Operator  
**Description**: Configure application parameters and hardware settings  
**Preconditions**: Application running

**Main Flow**:
1. Access configuration interface
2. Set temperature thresholds
3. Configure data logging intervals
4. Select hardware settings
5. Save configuration

**Alternative Flows**:
- **A1**: Invalid configuration - Show validation errors
- **A2**: Hardware not detected - Prompt for selection

**Postconditions**: Application configured with specified parameters

---

### UC-03: Analyse Historical Temperature Data
**Actor**: Industrial Operator  
**Description**: Review stored temperature data for trend analysis  
**Preconditions**: Historical data exists

**Main Flow**:
1. Access data analysis interface
2. Select date range
3. Retrieve temperature data
4. Visualise in charts
5. Export data if needed

**Alternative Flows**:
- **A1**: No data available - Notify user
- **A2**: Export fails - Show error details

**Postconditions**: User can analyse temperature trends

---

### UC-04: Switch Hardware/Simulation Modes
**Actor**: Industrial Operator  
**Description**: Toggle between hardware monitoring and simulation mode  
**Preconditions**: Application running

**Main Flow**:
1. Initiate mode switching
2. Confirm mode change
3. Update mode indicator
4. Continue monitoring

**Alternative Flows**:
- **A1**: Hardware failure - Auto-switch to simulation
- **A2**: Hardware recovery - Prompt for manual switch

**Postconditions**: System operating in selected mode

---

### UC-05: Export Temperature Data to CSV
**Actor**: Industrial Operator  
**Description**: Export temperature data to CSV format  
**Preconditions**: Historical data exists

**Main Flow**:
1. Initiate CSV export
2. Select date range
3. Format data for export
4. Generate CSV file
5. Save file and notify user

**Alternative Flows**:
- **A1**: No data available - Notify user
- **A2**: Export fails - Show error and retry options

**Postconditions**: CSV file exported successfully

---

### UC-06: Manage Theme Preferences
**Actor**: Industrial Operator  
**Description**: Switch between light and dark themes  
**Preconditions**: Application running

**Main Flow**:
1. Access theme interface
2. Toggle light/dark theme
3. Update theme preference
4. Apply theme to all components

**Alternative Flows**:
- **A1**: Theme error - Revert to default theme
- **A2**: Theme persistence fails - Show error message

**Postconditions**: Theme applied and preference saved

## Use Case Relationships

### Include Relationships
- UC-01 includes UC-04 (mode switching affects monitoring)
- UC-02 includes UC-03 (configuration affects analysis)
- UC-03 includes UC-05 (analysis supports export)

## Priority Matrix

| Use Case | Business Criticality | Technical Complexity | User Frequency | Priority |
|------------|---------------------|---------------------|------------|
| UC-01 | High | Medium | Very High | Critical |
| UC-02 | High | Low | Medium | High |
| UC-03 | Medium | Medium | Low | Medium |
| UC-04 | Medium | Low | Low | Medium |
| UC-05 | Medium | Low | Low | Medium |
| UC-06 | Low | Low | Low | Low |

## Non-Functional Requirements

### Performance
- Real-time updates within 500ms
- Historical data retrieval within 2 seconds
- System startup within 10 seconds

### Reliability
- 99.9% uptime for monitoring
- Automatic fallback to simulation mode
- Data integrity validation

### Usability
- Intuitive interface for Industrial Operators
- Clear status indicators
- Theme switching support

### Security
- Local data storage only
- Hardware communication validation
