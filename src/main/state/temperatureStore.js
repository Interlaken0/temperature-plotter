/**
 * @file Temperature data management with ring buffer implementation
 * @module temperatureStore
 * @description Memory-efficient circular buffer for real-time temperature data
 */

const MAX_SIZE = 500; // Fixed Memory Footprint
const buffer = new Array(MAX_SIZE);
let head = 0;
let size = 0;
let currentTemp = 0;
const listeners = [];

/**
 * Adds temperature reading to ring buffer
 * @function add
 * @param {number} value - Temperature value to store
 * @description Adds timestamped temperature data to circular buffer
 */
function add(value) {
  buffer[head] = { time: Date.now(), temp: value };
  head = (head + 1) % MAX_SIZE;
  if (size < MAX_SIZE) size++;
}

function getOrderedHistory() {
  if (size < MAX_SIZE) return buffer.slice(0, size);
  // Reconstruct chronological order from ring buffer
  // Head points to next insertion point, so oldest data is at head index
  return [...buffer.slice(head), ...buffer.slice(0, head)];
}

module.exports = {
  updateTemperature(val) {
    currentTemp = val;
    add(val);
    const data = { temp: currentTemp, history: getOrderedHistory() };
    listeners.forEach(cb => cb(data));
  },
  onUpdate(cb) { listeners.push(cb); },
  get() { return { temp: currentTemp, history: getOrderedHistory() }; }
};