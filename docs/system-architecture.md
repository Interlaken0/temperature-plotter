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

### 2. Data Flow Sequence

```mermaid
sequenceDiagram
    participant HW as Hardware Sensor
    participant DLL as TempMeasure64.dll
    participant HAL as Hardware Abstraction Layer
    participant Store as Temperature Store
    participant IPC as IPC Handler
    participant UI as React Frontend
    
    Note over HW,UI: Real-time Data Collection (1Hz)
    
    HW->>DLL: Temperature Reading
    DLL->>HAL: Callback with fTemp
    HAL->>HAL: Filter stale data
    HAL->>Store: updateTemperature(fTemp)
    Store->>Store: Ring buffer management
    Store->>IPC: IPC Channel emit
    IPC->>UI: temperature-update event
    UI->>UI: Update chart display
    
    Note over HW,UI: Background Logging
    Store->>Store: CSV logging (continuous)
    
    Note over HW,UI: User Export Action
    UI->>IPC: export-csv request
    IPC->>Store: getHistoricalData()
    Store->>IPC: Temperature array
    IPC->>UI: CSV data response
    UI->>UI: Download CSV file
```

### 3. Component Architecture

```mermaid
graph LR
    subgraph "Main Process Components"
        A[main.js] --> B[simulator.js]
        A --> C[tempDll.js]
        A --> D[temperatureStore.js]
    end
    
    subgraph "Renderer Components"
        E[App.js] --> F[TemperatureChart.js]
        E --> G[useTemperature.js]
        E --> H[ExportButton.js]
    end
    
    subgraph "Shared Utilities"
        I[IPC Bridge] --> J[contextBridge]
        I --> K[preload.js]
    end
    
    A -.-> I
    I -.-> E
    
    style A fill:#ffcccc
    style E fill:#ccffcc
    style I fill:#ccccff
```

### 4. Testing Strategy

```mermaid
graph TD
    subgraph "Test Pyramid"
        A[Unit Tests<br/>Comprehensive test suite<br/>Detailed reporting]
        B[Integration Tests<br/>End-to-end workflows]
        C[Component Tests<br/>React components]
        D[DLL Binding Tests<br/>Native integration]
    end
    
    subgraph "Coverage Metrics"
        E[Detailed coverage analysis available]
        F[Visual coverage reports]
        G[Comprehensive test reporting]
    end
    
    A --> E
    B --> F
    C --> G
    D --> A
    
    style A fill:#90EE90
    style B fill:#87CEEB
    style C fill:#DDA0DD
    style D fill:#F0E68C
```

### 5. Deployment Architecture

```mermaid
graph TB
    subgraph "Development Environment"
        A[Source Code] --> B[Webpack Build]
        B --> C[Electron Dev]
    end
    
    subgraph "Production Build"
        D[Electron Forge] --> E[Windows Installer]
        E --> F[TemperaturePlotterSetup.exe]
    end
    
    subgraph "Runtime Environment"
        F --> G[Installed Application]
        G --> H[Local Assets]
        G --> I[temperature_telemetry.csv]
    end
    
    A --> D
    
    style A fill:#FFE4B5
    style F fill:#98FB98
    style G fill:#E6E6FA
```

## Design Rationale

### Hardware Abstraction Layer (HAL)
- **Purpose**: Isolate hardware-specific code from business logic
- **Benefit**: Enables seamless switching between simulation and real hardware
- **KSB Demonstration**: S7 (Problem solving), K11 (Software designs)

### IPC Architecture
- **Purpose**: Secure communication between Node.js backend and React frontend
- **Implementation**: contextBridge for security, preload script for API exposure
- **KSB Demonstration**: K8 (Security), S2 (Effective user interfaces)

### Ring Buffer Data Structure
- **Purpose**: Memory-efficient storage of temperature history
- **Implementation**: Fixed-size circular buffer with automatic overflow handling
- **KSB Demonstration**: K9 (Data structures), S16 (Algorithms and logic)

### Testing Strategy
- **Purpose**: Ensure reliability and maintainability
- **Implementation**: Comprehensive test suite with mocking and coverage reporting
- **KSB Demonstration**: S4 (Unit testing), S5 (Integration testing), S13 (Testing frameworks)

## Portfolio Evidence Mapping

| Design Decision | KSB Demonstrated | Evidence Location |
|----------------|------------------|-------------------|
| Mermaid Architecture Diagrams | K7 (Design patterns) | This document |
| Hardware Abstraction Layer | S7 (Problem solving) | `src/main/dll/tempDll.js` |
| IPC Security Implementation | K8 (Security) | `src/main/preload.js` |
| Comprehensive Test Suite | S4, S5, S13 (Testing) | `__tests__/` directory |
| Ring Buffer Data Structure | K9 (Data structures) | `src/main/state/temperatureStore.js` |
| Semantic Git History | S14 (Version control) | Git commit history |

Created: February 2026
Purpose: Portfolio Evidence - Design Thinking and Software Architecture
