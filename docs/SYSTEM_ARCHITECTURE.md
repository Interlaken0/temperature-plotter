# System Architecture - AMF Temperature Plotter

## Overview

The AMF Temperature Plotter is an enterprise-grade temperature monitoring application built with Electron, React, and Node.js. The system provides real-time temperature data visualisation with automatic hardware/simulator switching, comprehensive data logging, and professional user interface design.

## Architecture Principles

- **Security First**: Context isolation, sandboxed renderer, secure IPC communication
- **High Availability**: Automatic fallback between hardware and simulation modes
- **Memory Efficient**: Ring buffer implementation with controlled memory usage
- **Real-time Performance**: Optimised data streaming and UI updates
- **Professional Standards**: British English compliance, comprehensive testing, enterprise logging

## High-Level Architecture

```mermaid
graph TB
    subgraph "Electron Application"
        subgraph "Main Process"
            A[Application Controller] --> B[Hardware Monitor]
            A --> C[IPC Handler]
            A --> D[Device Manager]
            B --> E[Temperature Store]
            C --> F[CSV Export Service]
        end
        
        subgraph "Renderer Process"
            G[React Application] --> H[Temperature Hook]
            G --> I[UI Components]
            H --> J[Chart Component]
            I --> K[Status Panel]
            I --> L[Export Button]
        end
        
        subgraph "Preload Script"
            M[Secure IPC Bridge] --> C
            M --> G
        end
    end
    
    subgraph "External Systems"
        N[Hardware DLL] --> D
        O[Simulator Module] --> D
        P[File System] --> F
    end
    
    style A fill:#e1f5fe
    style G fill:#f3e5f5
    style M fill:#e8f5e8
```

## Component Architecture

### 1. Main Process Architecture

```mermaid
graph TB
    subgraph "Main Process Components"
        A[main.js<br/>Application Controller] --> B[HardwareMonitor<br/>Device Health Management]
        A --> C[temperatureIpc.js<br/>IPC Communication]
        A --> D[temperatureStore.js<br/>Data Management]
        
        B --> E[Device Detection]
        B --> F[Health Monitoring]
        B --> G[Automatic Fallback]
        
        C --> H[Data Streaming]
        C --> I[Mode Notifications]
        C --> J[CSV Export]
        C --> K[Device Status]
        
        D --> L[Ring Buffer<br/>5000 entries]
        D --> M[Input Validation]
        D --> N[Event Broadcasting]
    end
    
    style A fill:#ffecb3
    style B fill:#c8e6c9
    style C fill:#bbdefb
    style D fill:#f8bbd9
```

### 2. Data Flow Architecture

```mermaid
flowchart LR
    subgraph "Data Sources"
        A[Hardware DLL<br/>Real Sensor] --> D[Device Manager]
        B[Simulator<br/>Software Data] --> D
    end
    
    subgraph "Processing Layer"
        D --> E[Input Validation<br/>-50°C to 200°C]
        E --> F[Temperature Store<br/>Ring Buffer]
        F --> G[Event Broadcasting]
    end
    
    subgraph "Communication Layer"
        G --> H[IPC Bridge]
        H --> I[Renderer Process]
    end
    
    subgraph "Presentation Layer"
        I --> J[React Hook]
        J --> K[UI Components]
        K --> L[Real-time Chart]
        K --> M[Status Display]
    end
    
    subgraph "Persistence Layer"
        G --> N[CSV Logger<br/>Background Process]
        I --> O[Manual Export<br/>Enterprise Audit]
    end
    
    style A fill:#4caf50
    style B fill:#2196f3
    style E fill:#ff9800
    style H fill:#9c27b0
    style L fill:#f44336
```

### 3. Security Architecture

```mermaid
graph TB
    subgraph "Security Boundaries"
        A[Renderer Process<br/>Sandboxed] --> B[Preload Script<br/>Context Bridge]
        B --> C[Main Process<br/>Privileged Operations]
    end
    
    subgraph "Security Controls"
        D[contextIsolation: true] --> A
        E[sandbox: true] --> A
        F[nodeIntegration: false] --> A
        G[Secure IPC API] --> B
        H[Input Validation] --> C
        I[File Access Control] --> C
    end
    
    subgraph "Data Protection"
        J[Temperature Range<br/>Validation] --> H
        K[Type Checking<br/>NaN Prevention] --> H
        L[Memory Limits<br/>Ring Buffer] --> H
    end
    
    style A fill:#ffebee
    style B fill:#e8f5e8
    style C fill:#e3f2fd
    style D fill:#ffcdd2
    style E fill:#ffcdd2
    style F fill:#ffcdd2
```

## Module Architecture

### 1. Core Modules

#### Main Process Modules
- **main.js**: Application lifecycle, window management, device coordination
- **HardwareMonitor**: Device health monitoring, automatic fallback logic
- **temperatureIpc.js**: IPC communication handlers, CSV export service
- **temperatureStore.js**: Ring buffer data management, event broadcasting
- **consoleColours.js**: Professional logging utilities

#### Renderer Process Modules
- **App.jsx**: Root component, state management, layout coordination
- **useTemperature.js**: Custom hook for data streaming and management
- **Components**: UI components for charting, status, and user interaction

#### Shared Resources
- **preload.js**: Secure IPC bridge between processes
- **constants.js**: Shared application constants

### 2. Device Management Architecture

```mermaid
stateDiagram-v2
    [*] --> Initialising
    Initialising --> HardwareMode: Hardware Available
    Initialising --> SimulatorMode: Hardware Unavailable
    
    HardwareMode --> Monitoring: Device Started
    Monitoring --> HardwareMode: Healthy
    Monitoring --> SimulatorMode: Timeout/Fault
    
    SimulatorMode --> Monitoring: Simulator Active
    Monitoring --> HardwareMode: Hardware Detected
    
    state Monitoring {
        [*] --> HealthCheck
        HealthCheck --> UpdateTimestamp: Device Responding
        HealthCheck --> FallbackTrigger: No Response
        UpdateTimestamp --> HealthCheck
        FallbackTrigger --> [*]
    }
```

## Data Architecture

### 1. Temperature Data Structure

```typescript
interface TemperatureReading {
    time: number;           // Unix timestamp
    temp: number;           // Temperature in Celsius
    isHardwareMode: boolean; // Data source indicator
}

interface TemperatureData {
    temp: number;           // Current temperature
    history: TemperatureReading[]; // Historical data array
}
```

### 2. Storage Architecture

```mermaid
graph TB
    subgraph "Memory Storage"
        A[Ring Buffer<br/>5000 entries] --> B[Circular Array]
        B --> C[Head Pointer]
        B --> D[Size Counter]
    end
    
    subgraph "Event System"
        E[Update Event] --> F[Listener Array]
        F --> G[IPC Broadcasting]
        F --> H[CSV Logging]
    end
    
    subgraph "Persistence"
        H --> I[Background CSV<br/>Real-time Logging]
        J[Manual Export] --> K[Enterprise Audit<br/>Enhanced Analytics]
    end
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style I fill:#e8f5e8
```

## Communication Architecture

### 1. IPC Channel Architecture

```mermaid
graph LR
    subgraph "Main → Renderer"
        A[temperature:update] --> B[Real-time Data]
        C[mode:change] --> D[Device Status]
    end
    
    subgraph "Renderer → Main"
        E[get-device-status] --> F[Status Query]
        G[switch-mode] --> H[Mode Control]
        I[force-hardware-mode] --> J[Hardware Override]
        K[save-csv] --> L[Export Request]
    end
    
    style A fill:#4caf50
    style C fill:#2196f3
    style E fill:#ff9800
    style G fill:#9c27b0
```

### 2. Component Communication

```mermaid
graph TB
    subgraph "React Component Tree"
        A[App.jsx] --> B[useTemperature Hook]
        A --> C[ThemeButton]
        A --> D[StatusPanel]
        A --> E[TemperatureChart]
        A --> F[SaveButton]
        
        B --> G[IPC Bridge]
        G --> H[Data Updates]
        H --> I[State Updates]
        I --> J[Component Re-render]
    end
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style G fill:#e8f5e8
```

## Technology Stack

### Core Technologies
- **Electron v40.1.0**: Desktop application framework
- **React v18.2.0**: User interface library
- **Node.js**: Backend runtime environment
- **Webpack v5.91.0**: Module bundler

### Supporting Libraries
- **Recharts v2.12.0**: Data visualisation
- **Koffi v2.15.1**: Foreign Function Interface for hardware DLL
- **TailwindCSS v3.4.17**: Utility-first CSS framework
- **Jest v29.7.0**: Testing framework

### Development Tools
- **Electron Forge v7.3.0**: Application packaging
- **Babel**: JavaScript transpilation
- **PostCSS**: CSS processing

## Performance Considerations

### 1. Memory Management
- Ring buffer limits memory usage to 5000 entries
- Automatic cleanup of event listeners
- Lazy loading of hardware DLL

### 2. Real-time Performance
- Optimised IPC communication
- Efficient React rendering with hooks
- Debounced UI updates

### 3. Resource Optimisation
- Background CSV logging without blocking UI
- Hardware health monitoring with configurable intervals
- Automatic fallback prevents application crashes

## Security Architecture

### 1. Process Isolation
- Renderer process sandboxing
- Context isolation enabled
- Node integration disabled

### 2. Data Validation
- Temperature range validation (-50°C to 200°C)
- Type checking and NaN prevention
- Input sanitisation for all data sources

### 3. File System Security
- Controlled file access through main process
- Secure CSV export with user confirmation
- Path validation for file operations

## Testing Architecture

### 1. Test Coverage
- 99 comprehensive tests covering all modules
- Unit tests for core functionality
- Integration tests for IPC communication
- UI component testing with React Testing Library

### 2. Test Categories
- **Unit Tests**: Individual function testing
- **Integration Tests**: Module interaction testing
- **Security Tests**: Input validation and boundary testing
- **Performance Tests**: Memory and timing validation

## Deployment Architecture

### 1. Build Process
```mermaid
graph LR
    A[Source Code] --> B[Webpack Bundling]
    B --> C[Electron Packaging]
    C --> D[Squirrel Installer]
    D --> E[Windows Distribution]
```

### 2. Distribution
- Squirrel-based Windows installer
- Automatic update capability
- Version management and rollback

## Maintenance and Monitoring

### 1. Logging System
- Professional console output with colour coding
- Background CSV logging for audit trails
- Error tracking and reporting

### 2. Health Monitoring
- Hardware connection monitoring
- Application performance tracking
- Memory usage optimisation

### 3. Error Handling
- Graceful degradation on hardware failure
- Comprehensive error logging
- User-friendly error messages

## Future Scalability

### 1. Extensible Architecture
- Plugin-based device support
- Configurable data sources
- Modular component design

### 2. Data Expansion
- Multiple sensor support
- Enhanced analytics capabilities
- Cloud integration readiness

### 3. UI Enhancements
- Responsive design improvements
- Accessibility compliance
- Internationalisation support

---

*This architecture document reflects the current implementation of the AMF Temperature Plotter as of version 1.1.0, following British English standards and enterprise development practices.*
