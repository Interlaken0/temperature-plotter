// STATUS PANEL COMPONENT - Real-time Temperature Display
// ============================================================================
// Simple but effective component for displaying current temperature:
// - Shows real-time temperature with precise formatting
// - Theme-aware styling for dark/light mode compatibility
// - Clean, minimalist design for focus on data
// - Responsive typography for optimal readability
// - Demonstrates component composition patterns
// ============================================================================

import React from 'react'; // React library for component rendering

// STATUS PANEL COMPONENT - Main temperature display interface
export default function StatusPanel({ temp }) { // Receive current temperature as prop
  return (
    // TEMPERATURE DISPLAY - Formatted real-time data temperature reading
    // FIX: "text-grey-900" is Black (Light Mode), "dark:text-white" is White (Dark Mode)
    // This ensures proper contrast and readability across both themes
    <div className="text-4xl font-mono text-grey-900 dark:text-white transition-colours duration-300">
      {/* TEMPERATURE FORMATTING - Precise display with fallback */}
      {typeof temp === 'number' ? temp.toFixed(2) : '0.00'} °C
    </div>
  );
}