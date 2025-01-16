const MAX_SIZE = 500; // Fixed Memory Footprint
const buffer = new Array(MAX_SIZE);
let head = 0;
let size = 0;
let currentTemp = 0;
const listeners = [];

function add(value) {
  buffer[head] = { time: Date.now(), temp: value };
  head = (head + 1) % MAX_SIZE;
  if (size < MAX_SIZE) size++;
}

function getOrderedHistory() {
  if (size < MAX_SIZE) return buffer.slice(0, size);
  // Reconstruct order from ring
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