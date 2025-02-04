import React, { useState } from 'react';
import { useTemperature } from './hooks/useTemperature';
import TemperatureChart from './components/TemperatureChart';
import StatusPanel from './components/StatusPanel';
import SaveButton from './components/SaveButton';

export default function App() {
  const { temp, history } = useTemperature();
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-white transition-colors duration-300 p-8 font-sans">
        
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Temperature Plotter</h1>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 text-sm font-medium bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
            >
              {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>

          <div className="glass p-8 rounded-2xl shadow-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-gray-200 dark:border-white/10">
            <StatusPanel temp={temp} />
          </div>

          <div className="glass p-6 rounded-2xl shadow-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-gray-200 dark:border-white/10 h-96">
            {/* ✅ FIX: Passing 'darkMode' prop here so the chart can change colors */}
            <TemperatureChart data={history} darkMode={darkMode} />
          </div>

          <div className="flex justify-end pt-4">
            <SaveButton />
          </div>
        </div>

      </div>
    </div>
  );
}