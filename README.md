# 🌡️ Temperature Plotter (v1.0.0)

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![Test Status](https://img.shields.io/badge/tests-100%25-brightgreen) ![Platform](https://img.shields.io/badge/platform-win32--x64-blue)

**A real-time industrial temperature monitoring application built with Electron, React, and Node.js.**

## 📖 Project Overview
This application provides a "Vertical Slice" solution for reading, visualizing, and logging temperature sensor data. It features a robust **IPC (Inter-Process Communication)** architecture that bridges a Node.js backend (handling hardware/simulation) with a React frontend (handling visualization).

**Key Capabilities:**
* **Real-Time Visualization:** Live graphing of sensor data (1Hz refresh rate) using Recharts.
* **Persistent Telemetry:** Background logging to `temperature_telemetry.csv` ensures data is never lost, even if the UI is closed.
* **Data Export:** On-demand CSV export for reporting and analysis.
* **Hardware Abstraction:** Currently operating in **Simulation Mode** (Sine Wave Generator), ready for seamless DLL integration.

## 🚀 Installation (End User)
To install the production version of the application:

1.  Navigate to the build directory: `out/make/squirrel.windows/x64/`
2.  Double-click **`TemperaturePlotterSetup.exe`**.
3.  The application will install and launch automatically.
4.  A shortcut will be created on your Desktop.

## 🛠️ Development Guide

### Prerequisites
* Node.js (v18 or higher)
* npm (v9 or higher)

### Setup
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install