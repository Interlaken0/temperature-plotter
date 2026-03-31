# Impact Map - AMF Temperature Plotter

## Overview
Business goals to technical deliverables for the AMF Temperature Plotter project.

## Impact Map

```mermaid
graph TD
    subgraph "Business Goals"
        A1["Improve Product Quality"]
        A2["Reduce Production Waste"]
        A3["Ensure Regulatory Compliance"]
        A4["Increase Operational Efficiency"]
        A5["Enhance Safety Standards"]
    end
    
    subgraph "User Needs"
        B1["Industrial Operator<br/>real-time monitoring and configuration"]
    end
    
    subgraph "Features"
        C1["Real-Time Dashboard<br/>with integrated alerts"]
        C2["Mode Switching<br/>hardware/simulation toggle"]
        C3["CSV Export<br/>data export functionality"]
    end
    
    subgraph "Technical Deliverables"
        D1["React Components<br/>TemperatureChart, StatusPanel, SaveButton"]
        D2["Temperature Store<br/>in-memory ring buffer"]
        D3["Hardware Interface<br/>KOFFI DLL"]
        D4["Constants Module<br/>configuration values"]
    end
    
    A1 --> B1
    A2 --> B1
    A3 --> B1
    A4 --> B1
    A5 --> B1
    
    B1 --> C1
    B1 --> C2
    B1 --> C3
    
    C1 --> D1
    C2 --> D3
    C3 --> D2
    C1 --> D4
```

## Business Goals

### Improve Product Quality
Real-time monitoring and alerts to maintain optimal temperature ranges.

### Reduce Production Waste
Early detection of temperature issues to prevent material loss.

### Ensure Regulatory Compliance
Historical data analysis and CSV export for audit requirements.

### Increase Operational Efficiency
Efficient monitoring tools and integrated configuration.

### Enhance Safety Standards
Reliable alert system and continuous monitoring capabilities.

## Feature Prioritisation

### Must Have
- Real-Time Dashboard
- Mode Switching
- CSV Export

### Should Have
- Enhanced alert configurations
- Historical analysis improvements

### Could Have
- Mobile monitoring capabilities
- Advanced visualisations

### Won't Have
- Multi-user support
- Complex reporting systems
- Database storage

## User Journey

### Industrial Operator
1. Start application
2. Monitor real-time temperature
3. Switch between hardware/simulation modes
4. Export CSV data when needed
5. Configure settings as required
