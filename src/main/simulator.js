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

// INTERRUPT SIMULATOR CLASS - Hardware behaviour emulation
// ============================================================================
// Simulates hardware interrupt-driven temperature sensors:
// - Extends EventEmitter for event-based architecture
// - Generates realistic temperature readings with patterns
// - Provides start/stop control for simulation lifecycle
// - Integrates with global temperature store for data persistence
// - Allows seamless switching between simulator and hardware
// ============================================================================
class InterruptSimulator extends EventEmitter {
  constructor() {
    super(); // Initialize EventEmitter parent class
    this.running = false; // Simulation state flag for start/stop control
    this.readingCount = 0; // Track number of readings to implement start/end pattern
  }

  // START SIMULATION - Begin temperature data generation
  // Initiates continuous temperature reading simulation with realistic patterns
  start() {
    this.running = true; // Set simulation state to active
    this.readingCount = 0; // Reset reading count for start/end pattern
    this.triggerInterrupt(); // Start first interrupt cycle
  }

  // TRIGGER INTERRUPT - Simulate hardware interrupt event
  // ============================================================================
  // This method simulates a hardware interrupt by:
  // - Generating realistic temperature readings with mathematical patterns
  // - Adding random noise for authentic sensor behaviour
  // - Updating global temperature store
  // - Scheduling next interrupt with variable timing
  // - Providing detailed logging for debugging and evidence
  // ============================================================================
  triggerInterrupt() {
    if (!this.running) return; // Exit if simulation stopped

    // TEMPERATURE GENERATION - Realistic sensor data patterns simulation
    // Creates authentic temperature patterns with signature start/end values:
    // - First reading: 30°C (signature start value for real reading identification)
    // - Subsequent readings: realistic patterns with sine wave and noise
    // - Base temperature of 22.5°C (room temperature)
    // - Sine wave variation (±5°C) simulating daily temperature cycles
    // - Random noise (±1°C) simulating sensor reading uncertainty
    // - Time-based sine wave creates smooth, realistic temperature changes
    let reading;
    this.readingCount++; // Increment reading counter
    
    if (this.readingCount === 1) {
      reading = 30.00; // First reading always 30°C - signature start value
    } else {
      const noise = Math.random() * 2 - 1; // Random noise between -1 and +1 degrees
      reading = 22.5 + Math.sin(Date.now() / 1000) * 5 + noise; // Base + wave + noise
    }

    // DATA STORE UPDATE - Persist temperature reading
    // Direct update to global temperature store for UI consumption
    store.updateTemperature(reading); // Store reading for chart updates and logging

    // MODULE IMPORTS - Dependencies and configuration of simulated data
    // Provides visual evidence that data is from simulator, not hardware
    // Essential for debugging and portfolio documentation
    const fahrenheit = (reading * 9/5) + 32; // Convert to Fahrenheit
    console.log(`SIMULATOR Reading: ${reading.toFixed(2)}°C (${fahrenheit.toFixed(2)}°F) (Hardware disconnected - using simulation)`);

    // VARIABLE TIMING - Simulate hardware interrupt jitter
    // Real hardware doesn't trigger at perfect intervals:
    // - Base interval of 500ms (2 Hz sampling rate)
    // - Random variation up to 500ms (0-1 second total interval)
    // - Simulates real hardware timing irregularities
    const nextInterrupt = 500 + Math.random() * 500; // 500-1000ms variable interval
    setTimeout(() => this.triggerInterrupt(), nextInterrupt); // Schedule next interrupt
  }

  // STOP SIMULATION - Graceful termination of data generation
  // Sets running flag to false, preventing further interrupt scheduling
  // Sends final signature reading of 10°C for real reading identification
  stop() {
    this.running = false; // Halt simulation by clearing state flag
    
    // Send final signature reading of 10°C before stopping
    const finalReading = 10.00; // Signature end value for real reading identification
    store.updateTemperature(finalReading); // Store final reading
    
    const fahrenheit = (finalReading * 9/5) + 32; // Convert to Fahrenheit
    console.log(`SIMULATOR Final Reading: ${finalReading.toFixed(2)}°C (${fahrenheit.toFixed(2)}°F) (Hardware disconnected - using simulation)`);
  }
}

// SIMULATOR INSTANCE - Global export for main process
// ============================================================================
// Creates and exports singleton simulator instance:
// - Ensures single simulator instance across application
// - Provides consistent interface for main process device management
// - Allows seamless switching between simulator and hardware
// ============================================================================
const sim = new InterruptSimulator(); // Create singleton simulator instance
module.exports = sim; // Export for use in main process