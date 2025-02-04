import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TemperatureChart({ data, darkMode }) { // Accepting 'darkMode' prop
  const buffer = data || [];

  // ✅ FIX: Color Logic
  // If Dark Mode: Use Light Gray (#94a3b8)
  // If Light Mode: Use Pitch Black (#000000)
  const axisColor = darkMode ? "#94a3b8" : "#000000";
  const tooltipBg = darkMode ? "#1e293b" : "#ffffff";
  const tooltipBorder = darkMode ? "#475569" : "#e2e8f0";
  const tooltipText = darkMode ? "#f8fafc" : "#0f172a";

  const formatDateTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleString('en-GB', { 
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatTemp = (value) => {
    if (typeof value !== 'number') return "";
    return `${value.toFixed(1)} °C`;
  };

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
            stroke={axisColor} /* ✅ Uses the dynamic color */
            tick={{ fill: axisColor }} /* ✅ Makes numbers black/white */
            tickLine={{ stroke: axisColor }}
          />

          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              border: `1px solid ${tooltipBorder}`, 
              borderRadius: '8px',
              color: tooltipText,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
            itemStyle={{ color: '#38bdf8' }}
            labelStyle={{ color: axisColor, marginBottom: '0.25rem', fontSize: '0.9rem' }}
            labelFormatter={(label) => formatDateTime(label)}
            formatter={(value) => [formatTemp(value), "Temperature"]}
          />

          <Line 
            dataKey="temp" 
            type="monotone" 
            stroke="#38bdf8" 
            strokeWidth={3}
            dot={false} 
            isAnimationActive={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}