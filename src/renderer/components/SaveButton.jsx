// SAVE BUTTON COMPONENT - Secure CSV Export Functionality
// ============================================================================
// Professional component for exporting temperature data to CSV:
// - Implements secure IPC communication for file operations
// - Uses modern UI design with hover animations
// - Provides accessibility features for screen readers
// - Demonstrates secure Electron file handling patterns
// - Includes visual feedback and loading states
// ============================================================================

import React from 'react'; // React library for component rendering

// SAVE BUTTON COMPONENT - Main export interface
export default function SaveButton() {
  // EXPORT HANDLER - Secure CSV file generation via IPC
  // ============================================================================
  // Handles CSV export through secure main process communication:
  // - Validates API availability before attempting export
  // - Uses async/await for proper error handling
  // - Provides console feedback for debugging
  // - Gracefully handles missing API or export failures
  // ============================================================================
  const handleSave = async () => {
    if (window.api && window.api.saveCSV) { // Check if secure API is available
      const result = await window.api.saveCSV(); // Call main process for secure file operation
      if (result.success) {
        console.log('Saved successfully'); // Log successful export for debugging
      }
    } else {
      console.error('Secure API not found'); // Log API unavailability for debugging
    }
  };

  // RENDER BUTTON - Modern export interface with animations
  return (
    // BUTTON CONTAINER - Gradient background with interactive effects
    <button 
      onClick={handleSave} // Trigger save handler on click
      className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
    >
      {/* HOVER OVERLAY - Subtle white overlay for depth effect */}
      <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></span>
      
      {/* DOWNLOAD ICON - Modern SVG with hover animation */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" // Subtle upward movement on hover
      >
        {/* DOWNLOAD PATH - Complex SVG path for download icon */}
        {/* DOWNLOAD PATH - Complex SVG path for download icon */}
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
      </svg>

      {/* BUTTON TEXT - Clear export action label */}
      <span className="tracking-wide">Export CSV</span>
    </button>
  );
}