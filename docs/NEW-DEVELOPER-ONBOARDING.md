# New Developer Onboarding Guide

## Overview

This guide provides a structured onboarding experience for new developers joining the Temperature Plotter project. Following this sequence will take you from complete project ignorance to productive contributor in approximately 2.5 hours.

## Onboarding Journey Overview

```mermaid
graph TB
    subgraph "Phase 1: Project Understanding (15 min)"
        A[README.md] --> B[Documentation Guide]
    end
    
    subgraph "Phase 2: Technical Architecture (30 min)"
        C[System Architecture] --> D[API Documentation]
    end
    
    subgraph "Phase 3: Development Setup (20 min)"
        E[Contributing Guide] --> F[Testing Guide]
    end
    
    subgraph "Phase 4: Code Deep Dive (45 min)"
        G[Main Process] --> H[Renderer Process]
        H --> I[Utilities & Components]
    end
    
    subgraph "Phase 5: Advanced Topics (30 min)"
        J[Changelog] --> K[Troubleshooting]
    end
    
    subgraph "Phase 6: EPA Context (15 min)"
        L[Portfolio Summary]
    end
    
    A --> C
    B --> D
    C --> E
    D --> F
    E --> G
    F --> H
    G --> J
    H --> K
    I --> L
    
    style A fill:#e1f5fe
    style C fill:#f3e5f5
    style E fill:#e8f5e8
    style G fill:#fff3e0
    style J fill:#ffebee
    style L fill:#f3e5f5
```

## Phase 1: Project Understanding (15 minutes)

### 1. README.md (Root)
**Why first:** Complete project overview and quick start

**What you'll learn:**
- What the project does and why
- How to install and run it
- Key features and capabilities
- Where to find everything

**Key sections to focus on:**
- Project description and purpose
- Installation instructions
- Quick start guide
- Project structure overview

### 2. docs/COMPLETE-DOCUMENTATION-GUIDE.md
**Why second:** Navigation map for all documentation

**What you'll learn:**
- Where every document is located
- What each document contains
- How documents relate to each other
- Best reading order

**Navigation Strategy:**
```mermaid
graph LR
    A[Documentation Guide] --> B[Document Map]
    B --> C[Reading Order]
    C --> D[Cross-References]
    D --> E[Quick Access]
```

## Phase 2: Technical Architecture (30 minutes)

### 3. docs/SYSTEM-ARCHITECTURE.md
**Why third:** How the system is designed

**What you'll learn:**
- System architecture diagrams
- Data flow between processes
- Component relationships
- Technical design decisions

**Architecture Understanding:**
```mermaid
graph TB
    subgraph "Electron Application"
        A[Main Process] --> B[Renderer Process]
        A --> C[Hardware Layer]
        B --> D[React Components]
        C --> E[Temperature Store]
    end
    
    subgraph "Key Components"
        F[IPC Communication] --> G[Data Streaming]
        H[Security Architecture] --> I[Sandboxed Renderer]
        J[Performance Optimisation] --> K[Memory Management]
    end
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
```

### 4. docs/API.md
**Why fourth:** How to work with the code

**What you'll learn:**
- IPC channels and communication
- Main process APIs
- Renderer components
- Data structures and usage examples

**API Architecture Flow:**
```mermaid
graph TB
    subgraph "IPC Communication"
        A[Renderer Process] --> B[Preload Script]
        B --> C[Main Process]
        C --> D[Core Services]
    end
    
    subgraph "Data Flow"
        E[Temperature Updates] --> F[Real-time UI]
        G[User Actions] --> H[Device Control]
        I[Mode Changes] --> J[Status Updates]
    end
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
```

## Phase 3: Development Setup (20 minutes)

### 5. docs/CONTRIBUTING.md
**Why fifth:** How to develop safely

**What you'll learn:**
- Development environment setup
- Code style and conventions
- Testing requirements
- Git workflow and commit standards

**Development Workflow:**
```mermaid
graph LR
    A[Fork Repository] --> B[Create Feature Branch]
    B --> C[Write Code]
    C --> D[Run Tests]
    D --> E[Update Documentation]
    E --> F[Submit Pull Request]
    F --> G[Code Review]
    G --> H[Merge]
```

### 6. __tests__/README.md
**Why sixth:** How testing works

**What you'll learn:**
- Test structure and organisation
- How to run tests
- Test categories and purposes
- Coverage expectations

**Testing Architecture:**
```mermaid
graph TB
    subgraph "Test Categories"
        A[Unit Tests] --> B[Component Testing]
        C[Integration Tests] --> D[IPC Testing]
        E[Security Tests] --> F[Validation Testing]
    end
    
    subgraph "Test Execution"
        G[Jest Runner] --> H[Test Coverage]
        H --> I[Results Report]
        I --> J[Quality Gates]
    end
    
    style A fill:#e1f5fe
    style G fill:#f3e5f5
```

## Phase 4: Code Deep Dive (45 minutes)

### 7. Source Code Exploration

**Order to read:**

#### Core Application Flow
```mermaid
graph TB
    subgraph "Main Process Core"
        A[main.js<br/>Application Entry] --> B[temperatureStore.js<br/>Data Management]
        B --> C[preload.js<br/>IPC Bridge]
        C --> D[temperatureIpc.js<br/>Communication Handler]
    end
    
    subgraph "Hardware Abstraction"
        E[tempDll.js<br/>Hardware Interface] --> F[simulator.js<br/>Software Simulation]
        G[HardwareMonitor<br/>Device Health] --> H[Device Management]
    end
    
    subgraph "Renderer Process"
        I[App.jsx<br/>React Root] --> J[useTemperature.js<br/>Data Hook]
        J --> K[Components/<br/>UI Elements]
    end
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style I fill:#e8f5e8
```

1. `src/main/main.js` - Application entry point
2. `src/main/state/temperatureStore.js` - Data management
3. `src/main/preload.js` - IPC bridge setup
4. `src/renderer/App.jsx` - React application root
5. `src/renderer/components/` - UI components
6. `src/renderer/hooks/` - Custom React hooks
7. `src/main/utils/consoleColours.js` - Cross-platform console utilities

### Console Utilities Deep Dive

The `consoleColours.js` module provides professional logging with specialised functions:

**Console Utility Architecture:**
```mermaid
graph TB
    subgraph "Console Functions"
        A[success] --> B[Green [OK] messages]
        C[error] --> D[Red [ERROR] messages]
        E[warning] --> F[Yellow [!] messages]
        G[info] --> H[Cyan [i] messages]
    end
    
    subgraph "Context Functions"
        I[hardware] --> J[Blue [+] [HAL] messages]
        K[simulator] --> L[Magenta [~] SIMULATOR messages]
        M[temperature] --> N[Source-aware colouring]
        O[status] --> P[Type-based formatting]
    end
    
    subgraph "Utility Functions"
        Q[separator] --> R[Visual organisation]
        S[header] --> T[Section formatting]
    end
    
    style A fill:#e1f5fe
    style I fill:#f3e5f5
    style Q fill:#e8f5e8
```

**Core Logging Functions:**
- `success(message)` - Green [OK] prefixed messages
- `error(message)` - Red [ERROR] prefixed messages  
- `warning(message)` - Yellow [!] prefixed messages
- `info(message)` - Cyan [i] prefixed messages

**Context-Specific Functions:**
- `hardware(message)` - Blue [+] [HAL] prefixed hardware messages
- `simulator(message)` - Magenta [~] SIMULATOR formatted messages
- `temperature(celsius, fahrenheit, source = 'REAL')` - Temperature logging with source-aware colouring
- `status(message, type = 'info')` - Configurable status messages with type-based colouring

**Utility Functions:**
- `separator()` - Visual separator lines for console organisation
- `header(title)` - Formatted section headers with uppercase conversion

**Exported Objects:**
- `colours` - ANSI colour code object (15 colour definitions)
- `symbols` - Symbol definitions object (7 symbol definitions)

**Key Features:**
- ANSI colour formatting for visual distinction
- ASCII-safe notation (deg C instead of °C symbol)
- Cross-platform terminal compatibility
- 50KB stable memory footprint
- Semantic logging with meaningful prefixes

**Usage Examples (seen in actual codebase):**
```javascript
// From main.js
consoleColours.header('AMF-Temperature-Plotter Starting');
consoleColours.info('Starting hardware monitoring...');
consoleColours.success('Hardware signal detected! Initiating switch...');
consoleColours.status('Performing hard DLL refresh to check for new device...', 'info');
consoleColours.warning('Hardware timeout detected. Injecting final 10.00 deg C reading.');

// From tempDll.js
consoleColours.hardware(`Session Start: Forcing 30.00 deg C (Sensor was: ${fTemp.toFixed(2)})`);
consoleColours.temperature(24.5, 76.1, 'REAL');
consoleColours.error('Hardware Start Error: ' + err.message);

// From simulator.js
consoleColours.temperature(22.0, 71.6, 'SIMULATOR');
consoleColours.simulator('Stopped: No final reading sent (Hardware disconnected - using simulation)');
```

## Phase 5: Advanced Topics (30 minutes)

### 8. docs/CHANGELOG.md
**Why eighth:** Project evolution and decisions

**What you'll learn:**
- Version history and changes
- Feature development timeline
- Bug fixes and improvements
- Technical debt and resolutions
- Recent evolution from static to dynamic reporting (v1.1.0)

**Project Evolution Timeline:**
```mermaid
graph TB
    subgraph "Version History"
        A[v1.0.0<br/>Initial Release] --> B[v1.1.0<br/>Enterprise Features]
        B --> C[Future Versions<br/>Enhancements]
    end
    
    subgraph "Key Improvements"
        D[Security Overhaul] --> E[Performance Optimisation]
        E --> F[Memory Leak Prevention]
        F --> G[Accessibility Compliance]
    end
    
    style A fill:#e1f5fe
    style D fill:#f3e5f5
```

### 9. TROUBLESHOOTING.md
**Why ninth:** Common problems and solutions

**What you'll learn:**
- Known issues and fixes
- Debugging techniques
- Hardware integration problems
- Performance optimisation tips

**Troubleshooting Flow:**
```mermaid
graph TB
    subgraph "Problem Categories"
        A[Hardware Issues] --> B[Connection Problems]
        C[Performance Issues] --> D[Memory Problems]
        E[UI Issues] --> F[Rendering Problems]
    end
    
    subgraph "Resolution Process"
        G[Identify Issue] --> H[Check Documentation]
        H --> I[Apply Solution]
        I --> J[Verify Fix]
        J --> K[Update Knowledge Base]
    end
    
    style A fill:#ffebee
    style G fill:#e8f5e8
```

## Phase 6: EPA Context (Optional - 15 minutes)

### 10. EPA-PORTFOLIO-SUMMARY.md
**Why last:** Project purpose and assessment context

**What you'll learn:**
- Why the project was built
- What skills it demonstrates
- Assessment requirements met
- Business impact and value

**Assessment Context:**
```mermaid
graph TB
    subgraph "Skills Demonstrated"
        A[Software Development] --> B[System Architecture]
        C[Security Implementation] --> D[Performance Optimisation]
        E[Testing Strategy] --> F[Documentation Standards]
    end
    
    subgraph "Business Value"
        G[Industrial Monitoring] --> H[Real-time Data Processing]
        I[Hardware Integration] --> J[Professional Standards]
    end
    
    style A fill:#e1f5fe
    style G fill:#f3e5f5
```

## Quick Reference - Developer Essentials

### For Immediate Work:
- **Running the app:** README.md → Installation section
- **Making changes:** docs/CONTRIBUTING.md → Development guidelines
- **Testing:** __tests__/README.md → Test commands
- **API usage:** docs/API.md → Function references

### For Understanding Architecture:
- **Big picture:** docs/SYSTEM-ARCHITECTURE.md → Diagrams
- **Data flow:** docs/API.md → IPC channels
- **Component structure:** Source code exploration

### For Problem Solving:
- **Common issues:** TROUBLESHOOTING.md
- **Test failures:** __tests__/README.md
- **Code style:** docs/CONTRIBUTING.md

## Development Environment Setup

### Prerequisites Installation Flow
```mermaid
graph LR
    A[Node.js] --> B[ npm/yarn]
    B --> C[Electron Forge]
    C --> D[Development Dependencies]
    D --> E[Testing Framework]
    E --> F[Ready to Develop]
```

### First-Time Setup Commands
```bash
# Clone repository
git clone https://github.com/Interlaken0/temperature-plotter.git
cd temperature-plotter

# Install dependencies
npm install

# Run application
npm start

# Run tests
npm test
```

## Code Quality Standards

### British English Compliance
- Use British English spelling only (colour, behaviour, organised, etc.)
- Professional UK English terminology throughout
- No American English spellings in any files
- Consistent grammar and punctuation

### Code Style Requirements
- Follow existing code patterns
- Use semantic variable naming
- Maintain consistent indentation
- Add meaningful comments

### Security Standards
- Follow Electron security best practices
- Maintain context isolation
- Use secure IPC patterns
- Validate all inputs

## Total Time Investment: ~2.5 hours

This reading order takes a new developer from complete ignorance to productive contributor by building understanding progressively from high-level overview to deep technical details.

## Learning Path Summary

```mermaid
graph TB
    subgraph "Knowledge Building"
        A[Project Context] --> B[Technical Architecture]
        B --> C[Development Environment]
        C --> D[Code Implementation]
        D --> E[Advanced Topics]
        E --> F[Business Context]
    end
    
    subgraph "Skill Development"
        G[Reading Documentation] --> H[Understanding Code]
        H --> I[Running Tests]
        I --> J[Making Changes]
        J --> K[Contributing Features]
    end
    
    style A fill:#e1f5fe
    style G fill:#f3e5f5
```

## Additional Resources

- **Project Repository:** https://github.com/Interlaken0/temperature-plotter
- **Test Evidence:** evidence/test-reports/
- **Visual Documentation:** evidence/screenshots/
- **Performance Metrics:** evidence/PERFORMANCE-METRICS.md

## Getting Help

If you need clarification after completing this onboarding sequence:

1. **Check TROUBLESHOOTING.md** for common issues
2. **Review the test suite** for usage examples
3. **Examine the API documentation** for technical details
4. **Refer to the complete documentation guide** for additional resources

## Next Steps After Onboarding

1. **Explore the codebase** independently
2. **Run the test suite** to understand testing patterns
3. **Make a small contribution** to practice the workflow
4. **Review recent pull requests** to understand development patterns
5. **Join team discussions** to stay informed about project direction

## Success Indicators

You've successfully completed onboarding when you can:

- ✅ Explain the system architecture to another developer
- ✅ Run the application and all tests locally
- ✅ Make and test a simple code change
- ✅ Navigate the documentation efficiently
- ✅ Understand the project's business context
- ✅ Follow the contribution guidelines correctly

---

*This document is part of the Temperature Plotter project documentation suite. For a complete list of all available documentation, see docs/COMPLETE-DOCUMENTATION-GUIDE.md.*