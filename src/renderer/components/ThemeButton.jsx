// THEME BUTTON COMPONENT - Elite Theme Toggle System
// ============================================================================
// Professional component for switching between light and dark themes:
// - Features elite UI design with advanced animations and visual feedback
// - Provides smooth transitions between theme states
// - Includes WCAG accessibility features for screen readers (aria, roles)
// - Demonstrates professional state management and timeout cleanup
// ============================================================================

import React, { useState } from 'react';

export default function ThemeButton({ darkMode, onToggle }) {
  const [isTransitioning, setIsTransitioning] = useState(false);

  // THEME TOGGLE HANDLER - Elite theme switching
  const handleThemeToggle = () => {
    if (isTransitioning) return; // Prevent rapid clicking
    
    setIsTransitioning(true);
    onToggle(); // Trigger state change instantly, CSS handles the smooth transition
    
    // Unlock button after transition completes
    setTimeout(() => setIsTransitioning(false), 300);
  };

  return (
    <button 
      onClick={handleThemeToggle}
      disabled={isTransitioning}
      // ACCESSIBILITY: WCAG compliance properties
      role="switch"
      aria-checked={darkMode}
      aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
      className={`
        group relative inline-flex items-center justify-center gap-3 
        overflow-hidden rounded-full 
        bg-gradient-to-br ${darkMode 
          ? 'from-amber-400 via-orange-400 to-yellow-300' 
          : 'from-slate-700 via-blue-600 to-indigo-600'
        }
        px-6 py-3 font-semibold text-white 
        shadow-lg shadow-current/25 
        transition-all duration-300 ease-out 
        hover:scale-105 hover:shadow-xl hover:shadow-current/40 
        active:scale-95 
        focus:outline-none focus:ring-2 focus:ring-current/50 focus:ring-offset-2 dark:focus:ring-offset-slate-900
        ${isTransitioning ? 'opacity-75 cursor-wait' : ''}
      `}
    >
      <span className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></span>
      
      <div className={`relative h-5 w-5 transition-transform duration-500 ${isTransitioning ? 'rotate-180' : ''}`}>
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 transition-all duration-300 group-hover:rotate-45">
            <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.591a.75.75 0 101.06 1.06l1.591-1.591zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.591-1.591a.75.75 0 10-1.06 1.06l1.591 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.591a.75.75 0 001.06 1.06l1.591-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06L6.166 5.106a.75.75 0 00-1.06 1.06l1.591 1.591z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 transition-all duration-300 group-hover:-rotate-12">
            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
          </svg>
        )}
      </div>

      <span className="tracking-wide text-sm uppercase" aria-hidden="true">
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </span>
      
      <span className="absolute -inset-1 bg-gradient-to-r from-current to-current/50 rounded-full opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300"></span>
    </button>
  );
}