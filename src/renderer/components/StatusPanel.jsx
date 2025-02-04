import React from 'react';

export default function StatusPanel({ temp }) {
  return (
    // ✅ FIX: "text-gray-900" is Black (Light Mode), "dark:text-white" is White (Dark Mode)
    <div className="text-4xl font-mono text-gray-900 dark:text-white transition-colors duration-300">
      {typeof temp === 'number' ? temp.toFixed(2) : "0.00"} °C
    </div>
  );
}