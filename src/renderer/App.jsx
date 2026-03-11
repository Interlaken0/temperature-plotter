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
import ThemeButton from './components/ThemeButton'; // Elite theme toggle functionality

// MAIN APP COMPONENT - Application root with state management
export default function App() {
  // TEMPERATURE DATA - Real-time temperature streaming via custom hook
  // Returns current temperature reading and historical data arrays
  const { temp, history, unlimitedHistory } = useTemperature(); 
  
  // UI STATE - User interface preferences and device mode
  const [darkMode, setDarkMode] = useState(true); 
  const [mode, setMode] = useState('unknown'); 

  // IPC MODE LISTENER - Real-time mode change detection
  // ============================================================================
  // Establishes communication with main process for mode changes:
  // - Listens for hardware/simulator switching events
  // - Updates UI state when device mode changes
  // - Provides real-time feedback to user
  // - Handles graceful degradation if API unavailable
  // ============================================================================
  useEffect(() => {
    if (window.api && window.api.onModeChange) { 
      // MEMORY LEAK FIX: Capture the cleanup function returned by the preload script
      const cleanup = window.api.onModeChange((data) => { 
        setMode(data.mode); 
      });
      
      // React will automatically run this when the component unmounts
      return cleanup; 
    }
  }, []); 

  // RENDER UI - Complete application interface with responsive design
  return (
    // THEME WRAPPER - Applies dark mode class to entire application
    <div className={darkMode ? 'dark' : ''}>
      {/* MAIN CONTAINER - Full viewport with responsive layout */}
      <div className="min-h-screen bg-grey-100 dark:bg-slate-900 text-grey-900 dark:text-white transition-colours duration-300 p-8 font-sans">
        
        {/* LAYOUT CONTAINER - Centred content with optimal width */}
        <div className="max-w-5xl mx-auto space-y-6">
          {/* HEADER SECTION - Title and elite theme toggle */}
          <div className="flex justify-between items-centre mb-8">
            <h1 className="text-3xl font-bold tracking-tight">AMF-Temperature-Plotter</h1>
            {/* ELITE THEME TOGGLE - Premium theme switcher with animations and sound */}
            <ThemeButton darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          </div>

          {/* STATUS PANEL - Current temperature and device mode display */}
          <div className="glass p-8 rounded-2xl shadow-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-grey-200 dark:border-white/10">
            <StatusPanel temp={temp} /> 
          </div>

          {/* TEMPERATURE CHART - Real-time data visualisation */}
          <div className="glass p-6 rounded-2xl shadow-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-grey-200 dark:border-white/10 h-96">
            <TemperatureChart data={history} unlimitedHistory={unlimitedHistory} darkMode={darkMode} mode={mode} /> 
          </div>

          {/* EXPORT SECTION - CSV data export functionality */}
          <div className="flex justify-end pt-4">
            <SaveButton /> 
          </div>
        </div>

      </div>
    </div>
  );
}