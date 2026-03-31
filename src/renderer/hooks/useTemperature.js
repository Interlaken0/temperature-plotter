/**
 * @file Custom React Hook - Temperature Data Streaming Management
 * @module useTemperature
 * @description Professional hook for managing real-time temperature data with IPC communication and buffer management
 */

// CUSTOM REACT HOOK - Temperature Data Streaming Management
// ============================================================================
// Professional hook for managing real-time temperature data:
// - Handles IPC communication with main process
// - Manages state for current temperature and historical data
// - Implements buffer management for performance optimisation
// - Prevents memory leaks with proper unmount cleanup
// - Provides clean API for component consumption
// - Demonstrates custom React hook patterns
// ============================================================================

import { useEffect, useState } from 'react'; // REACT IMPORTS - Core hooks for state and lifecycle management
import { MAX_BUFFER, ALL_TIME } from '../../shared/constants.js'; // CONSTANTS IMPORT - Centralised configuration management

// TEMPERATURE HOOK STATE - Temperature data management interface
export function useTemperature() {
  // CURRENT TEMPERATURE STATE - Real-time temperature reading
  const [temp, setTemp] = useState(0); // Current temperature value for immediate display
  
  // HISTORICAL DATA BUFFER - Temperature history for charting
  const [history, setHistory] = useState([]); // Array of historical temperature data points
  const [unlimitedHistory, setUnlimitedHistory] = useState([]); // Unlimited buffer for "All Time" mode

  // IPC DATA STREAM - Real-time temperature data listener
  // ============================================================================
  // Establishes communication bridge with main process:
  // - Registers temperature update listener on component mount
  // - Updates current temperature state for immediate display
  // - Maintains both rolling buffer (MAX_BUFFER) and unlimited history
  // - Prevents memory leaks while supporting "All Time" viewing
  // - Provides seamless data flow from hardware/simulator to UI
  // ============================================================================
  useEffect(() => {
    // TEMPERATURE LISTENER - Register for real-time updates
    // MEMORY LEAK FIX: Capture the cleanup function returned by the secure IPC bridge
    const cleanup = window.api.onTemperature((data) => {
      // CURRENT UPDATE - Set immediate temperature reading
      setTemp(data.temp); // Update current temperature state for StatusPanel
      
      // DUAL BUFFER MANAGEMENT - Performance optimisation with unlimited option
      // Rolling buffer for normal operation (prevents memory overflow)
      // Unlimited buffer for "All Time" mode (complete session history)
      const newDataPoint = data.history.slice(-1)[0]; // Get newest data point
      
      setHistory((prev) => [
        ...prev.slice(-MAX_BUFFER), 
        newDataPoint
      ]);
      
      setUnlimitedHistory((prev) => [
        ...prev,
        newDataPoint
      ]);
    });

    // React automatically executes this cleanup function when the component unmounts
    return cleanup;
  }, []); // Empty dependency array - listener registered once on component mount

  // HOOK API - Return clean interface for components
  return { 
    temp, 
    history,           // Limited history for performance (MAX_BUFFER)
    unlimitedHistory    // Complete session history for "All Time" mode
  };
}