import React from 'react';

export default function SaveButton() {
  const handleSave = async () => {
    if (window.api && window.api.saveCSV) {
      const result = await window.api.saveCSV();
      if (result.success) {
        console.log("Saved successfully");
      }
    } else {
      console.error("Secure API not found");
    }
  };

  return (
    <button 
      onClick={handleSave}
      className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-3 font-bold text-white shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
    >
      <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100"></span>
      
      {/* Modern SVG Download Icon */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5"
      >
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
      </svg>

      <span className="tracking-wide">Export CSV</span>
    </button>
  );
}