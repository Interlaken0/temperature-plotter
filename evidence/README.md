# Portfolio Evidence & Test Artifacts

This directory contains automated evidence generated during the development and testing of the Temperature Plotter application.

## Structure
* **`/screenshots`**: Automatically captured images of the application states (Hardware Connected, Simulation Mode, Error States).
* **`capture-script.ps1`**: PowerShell automation script used to generate consistent evidence for the apprenticeship portfolio (KSB S11).

## Usage
To generate a fresh batch of evidence for a milestone report:
1. Ensure the application is running (`npm start`).
2. Run the capture script:
   ```powershell
   ./capture-script.ps1