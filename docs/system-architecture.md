# System Architecture Design Artefacts
## Portfolio Evidence - Design Thinking and Planning

### 1. High-Level System Architecture

```mermaid
graph TB
    subgraph "Hardware Layer"
        A[Temperature Sensor] --> B[DLL TempMeasure64.dll]
    end
    
    subgraph "Electron Main Process"
        B --> C[Hardware Abstraction Layer]
        C --> D[Temperature Store]
        D --> E[CSV Logger]
        D --> F[IPC Handler]
    end
    
    subgraph "Electron Renderer Process"
        F --> G[React Frontend]
        G --> H[Temperature Chart]
        G --> I[Export Controls]
        G --> J[Real-time Display]
    end
    
    subgraph "Data Persistence"
        E --> K[temperature_telemetry.csv]
        I --> L[User Export CSV]
    end
    
    style A fill:#ff9999
    style B fill:#ffcc99
    style C fill:#99ccff
    style G fill:#99ff99
```

## 2. Component Architecture & Data Flow

### 2.1 Component Structure

```mermaid
graph TB
    subgraph "Node.js Backend (Main Process)"
        A[main.js<br/>Application Entry] --> B[simulator.js<br/>Temperature Data Generation]
        A --> C[tempDll.js<br/>Hardware Interface]
        A --> D[temperatureStore.js<br/>State Management]
        A --> E[temperatureIpc.js<br/>IPC Communication]
    end
    
    subgraph "Preload Security Layer"
        F[preload.js<br/>Security Bridge] --> G[contextBridge<br/>XSS Protection]
        F --> H[API Exposure<br/>Controlled Access]
    end
    
    subgraph "React Frontend (Renderer Process)"
        I[App.jsx<br/>Main Component] --> J[TemperatureChart.jsx<br/>Data Visualisation]
        I --> K[useTemperature.js<br/>State Hook]
        I --> L[SaveButton.jsx<br/>Export Functionality]
        I --> M[StatusPanel.jsx<br/>System Status]
        I --> N[ModeStatus.jsx<br/>Hardware/Simulator Mode]
    end
    
    E -.-> F
    F -.-> I
    
    style A fill:#ffcccc
    style F fill:#ffebcc
    style I fill:#ccffcc
```

**Strict Separation of Concerns:**
- **Main Process**: Hardware interaction, data processing, file system access
- **Preload Layer**: Security boundary, controlled API exposure
- **Renderer Process**: UI rendering, user interaction, data presentation

### 2.2 Real-Time Data Flow Sequence

```mermaid
sequenceDiagram
    participant HW as Physical Hardware
    participant DLL as TempMeasure64.dll
    participant HAL as Hardware Abstraction Layer
    participant Store as Temperature Store
    participant IPC as IPC Handler
    participant UI as React Frontend
    participant CSV as CSV Logger
    
    Note over HW,CSV: Single Temperature Reading Lifecycle
    
    HW->>DLL: Raw sensor data
    DLL->>HAL: fTemp callback (24.5°C)
    HAL->>HAL: Filter stale readings
    HAL->>Store: updateTemperature(fTemp)
    
    Store->>Store: Ring buffer management
    Store->>CSV: Background logging
    CSV->>CSV: Append to temperature_telemetry.csv
    
    Store->>IPC: temperature-update event
    IPC->>UI: Secure IPC transmission
    UI->>UI: Update TemperatureChart
    UI->>UI: Refresh ModeStatus
    
    Note over HW,CSV: Complete flow: <100ms latency
```

## 3. Data Modelling & Persistence

### 3.1 Object Mapping

```mermaid
classDiagram
    class TemperatureReading {
        +number timestamp_raw
        +string iso_time
        +float temperature_c
        +string source_mode
        +getFormattedTime()
        +toCSVRow()
    }
    
    class TemperatureSession {
        +array history
        +number max_size
        +string mode
        +addReading(reading)
        +getHistory()
        +clearHistory()
    }
    
    class DeviceStatus {
        +string status
        +string mode
        +string port
        +boolean is_connected
        +getConnectionState()
    }
    
    class CSVExport {
        +array data
        +string filename
        +generateCSV()
        +saveToFile()
    }
    
    TemperatureSession --> TemperatureReading : contains
    DeviceStatus --> TemperatureSession : manages
    CSVExport --> TemperatureReading : exports
    
    note for TemperatureReading "Physical world mapping\nEnsures data integrity"
    note for CSVExport "Excel-safe formatting\nPrevents scientific notation"
```

**Physical World to Software Mapping:**
- **TemperatureReading**: Direct sensor data representation
- **TemperatureSession**: Runtime data management with ring buffer
- **DeviceStatus**: Hardware connection state tracking
- **CSVExport**: User-triggered data export functionality

### 3.2 Export Logic & Schema

```mermaid
flowchart TD
    Start([User Clicks Export]) --> Validate{Has Data?}
    Validate -- No --> Error[Show Error Alert]
    Validate -- Yes --> Format[Format for Excel]
    
    Format --> Process[Raw Timestamp Processing]
    Process --> Convert[ISO 8601 Time Conversion]
    Convert --> Dual[Add Celsius/Fahrenheit]
    Dual --> Safe[Prevent Scientific Notation]
    
    Safe --> Dialog[Open Save Dialog]
    Dialog --> Cancel{User Cancelled?}
    Cancel -- Yes --> End([Stop])
    Cancel -- No --> Write[Write CSV File]
    Write --> Success[Show Success Toast]
    
    style Start fill:#90EE90
    style Success fill:#90EE90
    style Error fill:#FFB6C1
    style End fill:#D3D3D3
```

**Excel-Safe Formatting Logic:**
- Raw timestamps prevent Excel scientific notation
- ISO 8601 format ensures proper date parsing
- Dual-unit values support international users
- String formatting preserves precision

## 4. Testing & Deployment Strategy

### 4.1 Test Pyramid

```mermaid
graph TB
    subgraph "Test Pyramid Structure"
        A[Unit Tests<br/>79 tests total<br/>Fast execution<br/>Isolated components]
        
        B[Integration Tests<br/>End-to-end workflows<br/>IPC communication<br/>Data flow validation]
        
        C[Component Tests<br/>React components<br/>UI interactions<br/>State management]
        
        D[DLL Binding Tests<br/>Native library integration<br/>Hardware simulation<br/>Error handling]
    end
    
    subgraph "Quality Assurance Metrics"
        E[100% Pass Rate]
        F[Comprehensive Coverage]
        G[Automated Reporting]
        H[Regression Prevention]
    end
    
    A --> E
    B --> F
    C --> G
    D --> H
    
    style A fill:#90EE90
    style B fill:#87CEEB
    style C fill:#DDA0DD
    style D fill:#F0E68C
```

### 4.2 Deployment Architecture

```mermaid
flowchart LR
    subgraph "Development Phase"
        A[Source Code] --> B[Webpack Build]
        B --> C[Electron Development]
        C --> D[Hot Reload Testing]
    end
    
    subgraph "Production Build"
        E[Electron Forge] --> F[Code Signing]
        F --> G[Windows Installer]
        G --> H[TemperaturePlotterSetup.exe]
    end
    
    subgraph "Distribution Pipeline"
        H --> I[Client Installation]
        I --> J[Local Runtime]
        J --> K[Automatic Updates]
    end
    
    D --> E
    
    style A fill:#FFE4B5
    style H fill:#98FB98
    style J fill:#E6E6FA
```

## 5. Agile User Stories (Phase 9)

### Story 1: Telemetry Data Export (Data Engineering)

```mermaid
flowchart TD
    A[Given: Application has recorded temperature telemetry] --> B[When: User clicks 'Export to CSV']
    B --> C[Then: System generates CSV with ISO 8601 timestamps]
    B --> D[Then: Dual-unit temperature values (Celsius/Fahrenheit)]
    B --> E[Then: Raw timestamp metadata prevents Excel scientific notation]
    
    style A fill:#E6E6FA
    style B fill:#FFE4B5
    style C fill:#90EE90
    style D fill:#90EE90
    style E fill:#90EE90
```

*As a Laboratory Analyst,*  
*I want to export the complete temperature telemetry history to a structured CSV file,*  
*So that I can perform high-precision statistical analysis in external tools like Microsoft Excel without data corruption or formatting loss.*

### Story 2: Ergonomic User Experience (UI Architecture)

```mermaid
flowchart TD
    A[Given: Application running in default state] --> B[When: User interacts with theme toggle]
    B --> C[Then: UI instantly updates to dark CSS palette]
    B --> D[Then: Recharts component updates dynamically]
    D --> E[And: Maintains optimal accessibility and contrast ratios]
    
    style A fill:#E6E6FA
    style B fill:#FFE4B5
    style C fill:#90EE90
    style D fill:#90EE90
    style E fill:#90EE90
```

*As a Shift Operator working in varying environmental conditions,*  
*I want to dynamically toggle the application interface into a high-contrast "Dark Mode,"*  
*So that I can continuously monitor real-time telemetry during low-light night shifts without experiencing visual fatigue or screen glare.*

### Story 3: Data Integrity & State Verification (System Reliability)

```mermaid
stateDiagram-v2
    [*] --> Hardware: DLL connected
    Hardware --> Simulator: Hardware disconnects
    Hardware --> Simulator: 5-second timeout
    Simulator --> Hardware: DLL reconnects
    
    note right of Hardware
        Green 'Hardware' badge
        Real telemetry data
        High integrity
    end note
    
    note right of Simulator
        Amber 'Simulator' badge
        Fallback telemetry
        Clear visual indicator
    end note
```

*As a Quality Assurance Technician,*  
*I want an immediate, unambiguous visual indicator of the active data stream source (Hardware vs. Simulator),*  
*So that I can guarantee the integrity of my experimental data and never accidentally submit simulated fallback telemetry for compliance reporting.*

## 6. Design Rationale

### Hardware Abstraction Layer (HAL)
```mermaid
graph LR
    A[Hardware Sensor] --> B[DLL Interface]
    B --> C[HAL Abstraction]
    C --> D[Business Logic]
    
    subgraph "Benefits"
        E[Hardware Independence]
        F[Easy Testing]
        G[Simulation Mode]
    end
    
    C --> E
    C --> F
    C --> G
    
    style C fill:#99ccff
```
- **Purpose**: Isolates hardware-specific code from business logic, enabling seamless switching between simulation and real hardware without rewriting the UI.
- **KSB Demonstration**: S7 (Problem solving), K11 (Software designs)

### IPC Architecture
```mermaid
graph TB
    A[Main Process] --> B[contextBridge]
    B --> C[Preload Script]
    C --> D[Renderer Process]
    
    subgraph "Security Features"
        E[XSS Protection]
        F[API Whitelisting]
        G[Secure Channel]
    end
    
    B --> E
    B --> F
    B --> G
    
    style B fill:#ffcc99
```
- **Purpose**: Ensures secure communication between the Node.js backend and React frontend using contextBridge to prevent cross-site scripting (XSS) and unauthorised API access.
- **KSB Demonstration**: K8 (Security), S2 (Effective user interfaces)

### Ring Buffer Data Structure
```mermaid
graph LR
    A[New Reading] --> B[Ring Buffer]
    B --> C[Fixed Size: 1000]
    B --> D[Automatic Overflow]
    B --> E[Memory Efficient]
    
    subgraph "Performance Benefits"
        F[O(1) Operations]
        G[No Memory Leaks]
        H[24/7 Operation]
    end
    
    B --> F
    B --> G
    B --> H
    
    style B fill:#99ff99
```
- **Purpose**: Provides memory-efficient storage of temperature history using a fixed-size circular buffer with automatic overflow handling to prevent memory leaks during long 24/7 logging sessions.
- **KSB Demonstration**: K9 (Data structures), S16 (Algorithms and logic)

### Testing Strategy
```mermaid
graph TD
    A[Comprehensive Jest Suite] --> B[79 Tests]
    B --> C[100% Pass Rate]
    C --> D[Automated Coverage]
    D --> E[Regression Prevention]
    
    subgraph "Test Categories"
        F[Unit Tests]
        G[Integration Tests]
        H[Component Tests]
        I[DLL Binding Tests]
    end
    
    B --> F
    B --> G
    B --> H
    B --> I
    
    style A fill:#90EE90
    style C fill:#90EE90
```
- **Purpose**: Ensures reliability and maintainability via a comprehensive Jest test suite with mocking and coverage reporting to catch regressions early.
- **KSB Demonstration**: S4 (Unit testing), S5 (Integration testing), S13 (Testing frameworks)

## 7. Portfolio Evidence Mapping (KSBs)

| Design Decision | KSB Demonstrated | Evidence Location |
|----------------|------------------|-------------------|
| **Elite Mermaid Architecture Diagrams** | K7 (Design patterns) | This document |
| **Hardware Abstraction Layer** | S7 (Problem solving) | `src/main/dll/tempDll.js` |
| **IPC Security Implementation** | K8 (Security) | `src/main/preload.js` |
| **Ring Buffer Data Structure** | K9 (Data structures) | `src/main/state/temperatureStore.js` |
| **Comprehensive Test Suite** | S4, S5, S13 (Testing) | `__tests__/` directory |
| **Component Architecture** | S2 (Effective UI) | `src/renderer/components/` |
| **Real-Time Data Flow** | S16 (Algorithms) | IPC communication patterns |
| **Export Schema Design** | K11 (Software specs) | CSV export logic |
| **Deployment Pipeline** | S10 (Build & deploy) | Electron Forge configuration |
| **User Story Implementation** | S9 (Analysis artefacts) | Story acceptance criteria |
| **Semantic Git History** | S14 (Version control) | Git commit history |
| **Professional Documentation** | B7 (Communication) | Complete docs ecosystem |

---

**Created:** February 2026  
**Purpose:** Portfolio Evidence - Elite System Architecture & Design Thinking  
**Standards:** British English, Professional Documentation, 100% Mermaid Coverage
