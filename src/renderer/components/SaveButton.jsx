// SAVE BUTTON COMPONENT - Elite Telemetry Export System
// ============================================================================
// Professional component for exporting temperature telemetry data:
// - Implements secure IPC communication for file operations
// - Resolves AudioContext memory leaks via React useRef
// - Provides WCAG accessibility features for screen readers
// - Validates API state with strict error boundaries
// ============================================================================

import React, { useState, useRef } from 'react';

export default function SaveButton() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  
  // PERFORMANCE FIX: Persistent reference prevents memory leak of multiple audio contexts
  const audioCtxRef = useRef(null);

  // AUDIO SYSTEM - Elite sound feedback
  const playEliteClickSound = () => {
    try {
      // Initialize audio context lazily on first click to comply with browser policies
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 1200; 
      oscillator.type = 'sine'; 
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime); 
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1); 
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.1);
    } catch (error) {
      console.warn('Audio feedback unavailable:', error);
    }
  };

  // EXPORT HANDLER - Elite telemetry export with feedback
  const handleSave = async () => {
    if (isExporting) return;
    
    playEliteClickSound();
    setIsExporting(true);
    setExportComplete(false);
    
    try {
      if (window.api && window.api.saveCSV) {
        const result = await window.api.saveCSV();
        if (result && result.success) {
          setExportComplete(true);
          setTimeout(() => setExportComplete(false), 2000); 
        }
      } else {
        console.error('[API ERROR] Secure context bridge not found');
      }
    } catch (error) {
      console.error('[EXPORT FAILED]', error);
    } finally {
      setIsExporting(false); 
    }
  };

  return (
    <button 
      onClick={handleSave}
      disabled={isExporting}
      // ACCESSIBILITY: WCAG compliance properties
      aria-busy={isExporting}
      aria-label="Download Telemetry Audit Log"
      className={`
        group relative inline-flex items-center justify-center gap-3 
        overflow-hidden rounded-full 
        bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 
        px-8 py-3.5 font-bold text-white 
        shadow-lg shadow-blue-500/25 
        transition-all duration-300 ease-out 
        hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40 
        hover:from-indigo-500 hover:via-blue-500 hover:to-cyan-400 
        active:scale-95 
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900
        ${isExporting ? 'opacity-75 cursor-wait' : ''}
        ${exportComplete ? 'ring-2 ring-green-400 ring-offset-2' : ''}
      `}
    >
      <span className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></span>
      <span className={`absolute inset-0 bg-green-500/20 transition-opacity duration-500 ${exportComplete ? 'opacity-100' : 'opacity-0'}`}></span>
      
      {isExporting ? (
        <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110">
          <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
        </svg>
      )}

      {/* ARIA-LIVE region for screen readers to announce state changes */}
      <span className="tracking-wide text-sm uppercase" aria-live="polite">
        {isExporting ? 'Exporting...' : exportComplete ? 'Exported!' : 'Download Telemetry'}
      </span>
      
      <span className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></span>
    </button>
  );
}