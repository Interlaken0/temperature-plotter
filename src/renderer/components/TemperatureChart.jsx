// TEMPERATURE CHART COMPONENT - Advanced Real-time Data Visualization
// ============================================================================
// Sophisticated charting component for temperature data with:
// - Real-time data streaming and updates
// - Dynamic theming based on dark/light mode
// - Mode-based visual differentiation (hardware vs simulator)
// - Responsive design with performance optimisations
// - Professional data visualization using Recharts library
// ============================================================================

import React, { useState, useEffect } from 'react'; // React hooks for state and lifecycle management
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"; // Charting library components

// CHART RENDERING - Main visualization component
export default function TemperatureChart({ data, darkMode, mode }) { // Accept props for data and theming
  const buffer = data || []; // Safe data handling with fallback to empty array
  const [forceUpdate, setForceUpdate] = useState(0); // Force re-render trigger for mode changes

  // MODE CHANGE HANDLER - Force re-render when device mode changes
  // ============================================================================
  // Ensures chart updates visual styling when switching between:
  // - Hardware mode (green solid line)
  // - Simulator mode (amber dashed line)
  // This prevents cached styling issues during mode transitions
  // ============================================================================
  useEffect(() => {
    setForceUpdate(prev => prev + 1); // Increment trigger to force React re-render
  }, [mode]); // Dependency on mode prop ensures execution on mode changes

  // THEME COLOUR SYSTEM - Dynamic colour configuration
  // ============================================================================
  // Provides adaptive theming based on dark/light mode preference:
  // - Dark Mode: Light grey colours for contrast on dark background
  // - Light Mode: Dark colours for visibility on light background
  // - Ensures readability and visual consistency across themes
  // ============================================================================
  const axisColour = darkMode ? "#94a3b8" : "#000000"; // Axis lines and labels
  const tooltipBg = darkMode ? "#1e293b" : "#ffffff"; // Tooltip background
  const tooltipBorder = darkMode ? "#475569" : "#e2e8f0"; // Tooltip border
  const tooltipText = darkMode ? "#f8fafc" : "#0f172a"; // Tooltip text colour

  // MODE-BASED STYLING - Visual differentiation for data sources
  // ============================================================================
  // Provides clear visual indication of data source:
  // - Simulator Mode: Amber colour with dashed line (indicates simulated data)
  // - Hardware Mode: Green colour with solid line (indicates real data)
  // This helps users immediately understand data authenticity
  // ============================================================================
  const getLineColor = () => {
    if (mode === 'simulator') {
      return '#f59e0b'; // Amber colour for simulation mode (warning/indication)
    } else {
      return '#10b981'; // Green colour for hardware mode (success/authentic)
    }
  };

  const getLineStrokeDasharray = () => {
    return mode === 'simulator' ? '5 5' : '0'; // Dashed line for simulator, solid for hardware
  };

  // DATE/TIME FORMATTER - Human-readable timestamp conversion
  // ============================================================================
  // Converts Unix timestamps to localized date/time strings:
  // - Uses en-GB locale for consistent formatting (DD/MM/YYYY)
  // - 24-hour format for technical accuracy
  // - Includes seconds for precise timing analysis
  // - Handles null/undefined timestamps gracefully
  // ============================================================================
  const formatDateTime = (timestamp) => {
    if (!timestamp) return ""; // Graceful handling of missing timestamps
    const date = new Date(timestamp); // Convert timestamp to Date object
    return date.toLocaleString('en-GB', { 
      hour12: false, // Use 24-hour format
      year: 'numeric', // Full year (2024)
      month: '2-digit', // Two-digit month (01-12)
      day: '2-digit', // Two-digit day (01-31)
      hour: '2-digit', // Two-digit hour (00-23)
      minute: '2-digit', // Two-digit minute (00-59)
      second: '2-digit' // Two-digit second (00-59)
    });
  };

  // TEMPERATURE FORMATTER - Precise temperature display
  // ============================================================================
  // Formats temperature values for consistent display:
  // - Ensures numeric input validation
  // - Formats to 1 decimal place for precision
  // - Adds °C unit symbol for clarity
  // - Handles non-numeric values gracefully
  // ============================================================================
  const formatTemp = (value) => {
    if (typeof value !== 'number') return ""; // Validate input is numeric
    return `${value.toFixed(1)} °C`; // Format to 1 decimal place with unit
  };

  // MODE LABEL GENERATOR - User-friendly mode identification
  // ============================================================================
  // Provides descriptive labels for data source:
  // - Simulator Mode: Clear indication of simulated data
  // - Hardware Mode: Professional "Real-Time" label for authentic data
  // - Used in tooltips to inform users about data source
  // ============================================================================
  const getModeLabel = () => {
    if (mode === 'simulator') return 'Simulation Mode'; // Clear simulator indication
    return 'Real-Time Temperature'; // Professional hardware mode label
  };

  // STYLE CALCULATIONS - Pre-compute dynamic styles for performance
  const lineColour = getLineColor(); // Current line colour based on mode
  const dashArray = getLineStrokeDasharray(); // Current line style based on mode

  // CHART RENDER - Complete temperature visualization interface
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer>
        <LineChart data={buffer}>
          <XAxis 
            dataKey="time" 
            hide 
            domain={['auto', 'auto']} 
            type="number" 
          />
          
          <YAxis 
            domain={['auto', 'auto']} 
            stroke={axisColour} 
            tick={{ fill: axisColour }} 
            tickLine={{ stroke: axisColour }} 
          />

          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              border: `1px solid ${tooltipBorder}`, 
              borderRadius: '8px', 
              colour: tooltipText, 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
            itemStyle={{ colour: lineColour }} // Data point colour matches line
            labelStyle={{ colour: axisColour, marginBottom: '0.25rem', fontSize: '0.9rem' }} // Timestamp styling
            labelFormatter={(label) => formatDateTime(label)} // Format timestamp display
            formatter={(value) => [formatTemp(value), getModeLabel()]} // Format temperature with mode label
          />

          {/* TEMPERATURE LINE - Main data visualization with mode-based styling */}
          <Line 
            dataKey="temp" // Temperature data field
            type="monotone" // Smooth curve interpolation
            stroke={lineColour} // Dynamic colour based on mode
            strokeWidth={3} // Bold line for visibility
            strokeDasharray={dashArray} // Dashed for simulator, solid for hardware
            dot={false} // No data points for cleaner line
            isAnimationActive={false} // Disable animations for real-time performance
            key={`${mode}-${forceUpdate}`} // Force re-render when mode changes
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}