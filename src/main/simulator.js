const EventEmitter = require('events');
const store = require('./state/temperatureStore');

class InterruptSimulator extends EventEmitter {
  constructor() {
    super();
    this.running = false;
  }

  start() {
    this.running = true;
    this.triggerInterrupt();
  }

  triggerInterrupt() {
    if (!this.running) return;

    // Simulate hardware reading with noise
    const noise = Math.random() * 2 - 1;
    const reading = 22.5 + Math.sin(Date.now() / 1000) * 5 + noise;
    
    // Direct update to store
    store.updateTemperature(reading);
    
    // Log simulator readings with clear indication
    console.log(`🔧 SIMULATOR Reading: ${reading.toFixed(2)}°C (Hardware disconnected - using simulation)`);

    // Random interval simulates hardware IRQ jitter
    const nextInterrupt = 500 + Math.random() * 500;
    setTimeout(() => this.triggerInterrupt(), nextInterrupt);
  }

  stop() {
    this.running = false;
  }
}

const sim = new InterruptSimulator();
module.exports = sim;