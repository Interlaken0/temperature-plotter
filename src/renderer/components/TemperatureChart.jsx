import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function TemperatureChart({ data, darkMode, mode }) { // Accepting 'mode' prop
  const buffer = data || [];
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force re-render when mode changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [mode]);

  // FIX: Color Logic
  // If Dark Mode: Use Light Gray (#94a3b8)
  // If Light Mode: Use Pitch Black (#000000)
  const axisColor = darkMode ? "#94a3b8" : "#000000";
  const tooltipBg = darkMode ? "#1e293b" : "#ffffff";
  const tooltipBorder = darkMode ? "#475569" : "#e2e8f0";
  const tooltipText = darkMode ? "#f8fafc" : "#0f172a";

  // Mode-based line color and styling
  const getLineColor = () => {
    if (mode === 'simulator') {
      return '#f59e0b'; // Amber color for simulation mode
    } else {
      return '#10b981'; // Green color for hardware mode (default)
    }
  };

  const getLineStrokeDasharray = () => {
    return mode === 'simulator' ? '5 5' : '0'; // Dashed line for simulator, solid for hardware
  };

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

  const getModeLabel = () => {
    if (mode === 'simulator') return 'Simulation Mode';
    return 'Real-Time Temperature'; // Default to hardware label
  };

  const lineColor = getLineColor();
  const dashArray = getLineStrokeDasharray();

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
            stroke={axisColor} /* Uses the dynamic color */
            tick={{ fill: axisColor }} /* Makes numbers black/white */
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
            itemStyle={{ color: lineColor }}
            labelStyle={{ color: axisColor, marginBottom: '0.25rem', fontSize: '0.9rem' }}
            labelFormatter={(label) => formatDateTime(label)}
            formatter={(value) => [formatTemp(value), getModeLabel()]}
          />

          <Line 
            dataKey="temp" 
            type="monotone" 
            stroke={lineColor} 
            strokeWidth={3}
            strokeDasharray={dashArray}
            dot={false} 
            isAnimationActive={false}
            key={`${mode}-${forceUpdate}`} // Force re-render when mode changes
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}