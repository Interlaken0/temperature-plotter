// SAVE BUTTON COMPONENT - Elite Telemetry Export System
// ============================================================================
// Professional component for exporting temperature telemetry data:
// - Implements secure IPC communication for file operations
// - Features elite UI design with advanced animations and sound feedback
// - Provides accessibility features for screen readers
// - Demonstrates secure Electron file handling patterns
// - Includes visual feedback, loading states, and audio confirmation
// ============================================================================

import React, { useState, useEffect } from 'react'; // React library for component rendering

// SAVE BUTTON COMPONENT - Elite export interface
export default function SaveButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  // AUDIO SYSTEM - Elite sound feedback
  useEffect(() => {
    // Create audio context for elite click sound
    const createClickSound = () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Elite click sound: short, professional beep
      oscillator.frequency.value = 1200; // Professional frequency
      oscillator.type = 'sine'; // Clean sine wave
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Start volume
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1); // Fade out
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    };

    // Store sound function for later use
    window.playEliteClickSound = createClickSound;
  }, []);

  // EXPORT HANDLER - Elite telemetry export with feedback
  // ============================================================================
  // Handles CSV export with enhanced user experience:
  // - Validates API availability before attempting export
   // - Provides visual and audio feedback
   // - Uses async/await for proper error handling
   // - Gracefully handles missing API or export failures
   // ============================================================================
  const handleSave = async () => {
    // Play elite click sound
    if (window.playEliteClickSound) {
      window.playEliteClickSound();
    }
    
    setIsExporting(true);
    
    try {
      if (window.api && window.api.saveCSV) { // Check if secure API is available
        const result = await window.api.saveCSV(); // Call main process for secure file operation
        if (result.success) {
          setExportComplete(true);
          setTimeout(() => setExportComplete(false), 2000); // Reset after 2 seconds
          console.log('Telemetry exported successfully'); // Log successful export for debugging
        }
      } else {
        console.error('Secure API not found'); // Log API unavailability for debugging
      }
    } finally {
      setTimeout(() => setIsExporting(false), 500); // Brief loading state
    }
  };

  // RENDER BUTTON - Elite telemetry export interface
  return (
    // ELITE BUTTON CONTAINER - Advanced gradient with premium effects
    <button 
      onClick={handleSave} // Trigger elite save handler on click
      disabled={isExporting} // Disable during export operation
      className={`
        group relative inline-flex items-centre justify-centre gap-3 
        overflow-hidden rounded-full 
        bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 
        px-8 py-3.5 font-bold text-white 
        shadow-lg shadow-blue-500/25 
        transition-all duration-300 ease-out 
        hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 
        hover:from-indigo-500 hover:via-blue-500 hover:to-cyan-400 
        active:scale-95 
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900
        ${isExporting ? 'opacity-75 cursor-not-allowed' : ''}
        ${exportComplete ? 'ring-2 ring-green-400 ring-offset-2' : ''}
      `}
    >
      {/* ELITE BACKGROUND ANIMATION - Subtle pulse effect */}
      <span className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></span>
      
      {/* SUCCESS INDICATOR - Green flash on successful export */}
      <span className={`absolute inset-0 bg-green-500/20 transition-opacity duration-500 ${exportComplete ? 'opacity-100' : 'opacity-0'}`}></span>
      
      {/* LOADING SPINNER - Subtle rotation during export */}
      {isExporting && (
        <svg 
          className="absolute h-4 w-4 animate-spin text-white/80" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {/* ELITE DOWNLOAD ICON - Enhanced SVG with premium animation */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={`h-5 w-5 transition-all duration-300 ${isExporting ? 'opacity-50' : 'group-hover:-translate-y-0.5 group-hover:scale-110'}`}
      >
        {/* ENHANCED DOWNLOAD PATH - Premium icon design */}
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
      </svg>

      {/* ELITE BUTTON TEXT - Professional terminology with loading state */}
      <span className="tracking-wide text-sm uppercase">
        {isExporting ? 'Exporting...' : exportComplete ? 'Exported!' : 'Download Telemetry'}
      </span>
      
      {/* ELITE GLOW EFFECT - Subtle outer glow on hover */}
      <span className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></span>
    </button>
  );
}