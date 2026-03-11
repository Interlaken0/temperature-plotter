/**
 * @file Temperature data management with ring buffer implementation
 * @module temperatureStore
 */

// FIXED CONSTANT MISMATCH: Aligned with intended 5000 limit
const MAX_SIZE = 5000; 
const buffer = new Array(MAX_SIZE);
let head = 0;
let size = 0;
let currentTemp = 0;
const listeners = [];

function add(value, isHardware) {
  buffer[head] = { time: Date.now(), temp: value, isHardwareMode: isHardware };
  head = (head + 1) % MAX_SIZE;
  if (size < MAX_SIZE) size++;
}

function getOrderedHistory() {
  if (size < MAX_SIZE) return buffer.slice(0, size);
  return [...buffer.slice(head), ...buffer.slice(0, head)];
}

module.exports = {
  updateTemperature(val, isHardware = false) {
    // CRITICAL SECURITY: Input Validation
    if (typeof val !== 'number' || isNaN(val) || val < -50 || val > 200) {
      console.warn(`[SECURITY] Rejected invalid temperature reading: ${val}`);
      return;
    }

    currentTemp = val;
    add(val, isHardware);
    const data = { temp: currentTemp, history: getOrderedHistory() };
    listeners.forEach(cb => cb(data));
  },
  
  onUpdate(cb) { 
    listeners.push(cb); 
  },
  
  // MEMORY LEAK FIX: Allow components to unmount safely
  removeListener(cb) {
    const index = listeners.indexOf(cb);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  },
  
  get() { return { temp: currentTemp, history: getOrderedHistory() }; }
};