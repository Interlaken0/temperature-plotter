// CUSTOM REACT HOOK - Temperature Data Streaming Management
// ============================================================================
// Professional hook for managing real-time temperature data:
// - Handles IPC communication with main process
// - Manages state for current temperature and historical data
// - Implements buffer management for performance optimisation
// - Provides clean API for component consumption
// - Demonstrates custom React hook patterns
// ============================================================================

import { useEffect, useState } from 'react'; // REACT IMPORTS - Core hooks for state and lifecycle management

// TEMPERATURE HOOK STATE - Temperature data management interface
export function useTemperature() {
  // CURRENT TEMPERATURE STATE - Real-time temperature reading
  const [temp, setTemp] = useState(0); // Current temperature value for immediate display
  
  // HISTORICAL DATA BUFFER - Temperature history for charting
  const [history, setHistory] = useState([]); // Array of historical temperature data points

  // IPC DATA STREAM - Real-time temperature data listener
  // ============================================================================
  // Establishes communication bridge with main process:
  // - Registers temperature update listener on component mount
  // - Updates current temperature state for immediate display
  // - Maintains rolling buffer of historical data (last 300 points)
  // - Prevents memory leaks through buffer size management
  // - Provides seamless data flow from hardware/simulator to UI
  // ============================================================================
  useEffect(() => {
    // TEMPERATURE LISTENER - Register for real-time updates
    window.api.onTemperature((data) => {
      // CURRENT UPDATE - Set immediate temperature reading
      setTemp(data.temp); // Update current temperature state for StatusPanel
      
      // BUFFER MANAGEMENT - Performance optimisation rolling buffer with size limit
      // Keep last 300 existing data points to prevent memory overflow
      // Add only the newest data point from incoming batch to avoid duplicates
      setHistory((prev) => [
        ...prev.slice(-300), 
        ...data.history.slice(-1) 
      ]);
    });
  }, []); // Empty dependency array - listener registered once on component mount

  // HOOK API - Return clean interface for components
  return { temp, history }; // Provide current temperature and historical data to consuming components
}
