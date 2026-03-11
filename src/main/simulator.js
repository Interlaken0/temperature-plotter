// TEMPERATURE SIMULATOR - Hardware Interrupt Emulation System
// ============================================================================
// Advanced temperature sensor simulation with realistic patterns:
// - Event-driven architecture mimicking hardware interrupts
// - Realistic temperature patterns with sine wave and noise
// - Variable timing jitter for authentic hardware behaviour
// - Integration with global temperature store for data consistency
// - Demonstrates professional simulation techniques
// ============================================================================

const EventEmitter = require('events'); // Node.js event system for interrupt simulation
const store = require('./state/temperatureStore'); // Global temperature data store
const consoleColours = require('./utils/consoleColours'); // Enhanced console output

class InterruptSimulator extends EventEmitter {
  constructor() {
    super(); // Initialize EventEmitter parent class
    this.running = false; // Simulation state flag for start/stop control
    this.readingCount = 0; // Track number of readings for debugging purposes
  }

  start() {
    this.running = true; 
    this.readingCount = 0; 
    this.triggerInterrupt(); 
  }

  triggerInterrupt() {
    if (!this.running) return; 

    let reading;
    this.readingCount++; 
    
    const noise = Math.random() * 2 - 1; 
    reading = 22.5 + Math.sin(Date.now() / 1000) * 5 + noise; 

    // DATA STORE UPDATE - Persist temperature reading
    // EXPLICIT SIMULATOR TAG ADDED HERE (false)
    store.updateTemperature(reading, false); 

    const fahrenheit = (reading * 9/5) + 32; 
    consoleColours.temperature(reading, fahrenheit, 'SIMULATOR');

    const nextInterrupt = 500 + Math.random() * 500; 
    setTimeout(() => this.triggerInterrupt(), nextInterrupt); 
  }

  stop() {
    this.running = false; 
    
    const fahrenheit = (22.5 * 9/5) + 32; 
    consoleColours.simulator('Stopped: No final reading sent (Hardware disconnected - using simulation)');
  }
}

const sim = new InterruptSimulator(); 
module.exports = sim;