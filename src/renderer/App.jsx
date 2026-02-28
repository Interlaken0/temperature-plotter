// REACT APPLICATION COMPONENT - Main AMF-Temperature-Plotter Interface
// ============================================================================
// This is the root component of the temperature plotting application:
// - Manages global application state (dark mode, device mode)
// - Integrates temperature data streaming via custom hook
// - Coordinates all UI components for cohesive user experience
// - Handles IPC communication with main process
// - Provides responsive layout with modern design system
// ============================================================================

import React, { useState, useEffect } from 'react'; // React hooks for state management and lifecycle
import { useTemperature } from './hooks/useTemperature'; // Custom hook for temperature data streaming
import TemperatureChart from './components/TemperatureChart'; // Real-time temperature visualisation
import StatusPanel from './components/StatusPanel'; // Current temperature and mode display
import SaveButton from './components/SaveButton'; // CSV export functionality

// MAIN APP COMPONENT - Application root with state management
export default function App() {
  // TEMPERATURE DATA - Real-time temperature streaming via custom hook
  // Returns current temperature reading and historical data array
  const { temp, history } = useTemperature(); // Custom hook manages IPC communication and data state
  
  // UI STATE - User interface preferences and device mode
  const [darkMode, setDarkMode] = useState(true); // Theme preference for light/dark mode
  const [mode, setMode] = useState('unknown'); // Current device mode (hardware/simulator）

  // IPC MODE LISTENER - Real-time mode change detection
  // ============================================================================
  // Establishes communication with main process for mode changes:
  // - Listens for hardware/simulator switching events
  // - Updates UI state when device mode changes
  // - Provides real-time feedback to user
  // - Handles graceful degradation if API unavailable
  // ============================================================================
  useEffect(() => {
    if (window.api && window.api.onModeChange) { // Check if preload script exposed API
      window.api.onModeChange((data) => { // Register mode change listener
        setMode(data.mode); // Update local mode state with new device mode
      });
    }
  }, []); // Empty dependency array - runs once on mount

  // RENDER UI - Complete application interface with responsive design
  return (
    // THEME WRAPPER - Applies dark mode class to entire application
    <div className={darkMode ? 'dark' : ''}>
      {/* MAIN CONTAINER - Full viewport with responsive layout */}
      <div className="min-h-screen bg-grey-100 dark:bg-slate-900 text-grey-900 dark:text-white transition-colours duration-300 p-8 font-sans">
        
        {/* LAYOUT CONTAINER - Centred content with optimal width */}
        <div className="max-w-5xl mx-auto space-y-6">
          {/* HEADER SECTION - Title and theme toggle */}
          <div className="flex justify-between items-centre mb-8">
            <h1 className="text-3xl font-bold tracking-tight">AMF-Temperature-Plotter</h1>
            {/* THEME TOGGLE - Dark/light mode switcher with emoji indicators */}
            <button 
              onClick={() => setDarkMode(!darkMode)} // Toggle dark mode state
              className="px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 border border-grey-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-grey-50 dark:hover:bg-slate-700 transition-all"
            >
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>

          {/* STATUS PANEL - Current temperature and device mode display */}
          <div className="glass p-8 rounded-2xl shadow-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-grey-200 dark:border-white/10">
            <StatusPanel temp={temp} /> {/* Pass current temperature for real-time display */}
          </div>

          {/* TEMPERATURE CHART - Real-time data visualisation */}
          <div className="glass p-6 rounded-2xl shadow-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-grey-200 dark:border-white/10 h-96">
            {/* CHART PROPS - Pass theme and mode for dynamic styling */}
            {/* FIX: Passing 'darkMode' and 'mode' props so the chart can change colours and styling */}
            <TemperatureChart data={history} darkMode={darkMode} mode={mode} /> {/* Historical data with visual theming */}
          </div>

          {/* EXPORT SECTION - CSV data export functionality */}
          <div className="flex justify-end pt-4">
            <SaveButton /> {/* CSV export button with secure file handling */}
          </div>
        </div>

      </div>
    </div>
  );
}