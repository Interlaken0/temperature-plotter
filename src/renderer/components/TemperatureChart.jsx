// TEMPERATURE CHART COMPONENT - Elite SCADA Visualisation
// ============================================================================
// Upgraded industrial charting component featuring:
// - Fixed Y-Axis scaling for visual stability
// - Visible X-Axis with rolling HH:mm:ss timestamps
// - Critical and Warning engineering threshold lines
// - Dual-unit (Celsius/Fahrenheit) diagnostic tooltips
// ============================================================================

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';

export default function TemperatureChart({ data, darkMode, mode }) {
  const buffer = data || [];
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [mode]);

  // INDUSTRIAL THEME COLOURS
  const axisColour = darkMode ? '#94a3b8' : '#475569';
  const gridColour = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tooltipBg = darkMode ? '#0f172a' : '#ffffff';
  const tooltipBorder = darkMode ? '#334155' : '#cbd5e1';
  const tooltipText = darkMode ? '#f8fafc' : '#0f172a';

  const getLineColour = () => {
    return mode === 'simulator' ? '#f59e0b' : '#00ffcc'; // Bright cyan for real hardware
  };

  const dashArray = mode === 'simulator' ? '5 5' : '0';

  // FORMATTERS
  const formatXAxisTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-GB', { hour12: false }); // HH:mm:ss
  };

  const formatTemp = (value) => {
    if (typeof value !== 'number') return '';
    return `${value.toFixed(1)}°C`;
  };

  const getModeLabel = () => {
    return mode === 'simulator' ? '[SIMULATOR]' : '[HARDWARE]';
  };

  // CUSTOM DIAGNOSTIC TOOLTIP
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const tempC = payload[0].value;
      const tempF = (tempC * 9/5) + 32;
      
      return (
        <div style={{
          backgroundColor: tooltipBg,
          border: `1px solid ${tooltipBorder}`,
          borderRadius: '8px',
          padding: '12px',
          color: tooltipText,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: axisColour, borderBottom: `1px solid ${gridColour}`, paddingBottom: '4px' }}>
            {formatXAxisTime(label)}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px', alignItems: 'center' }}>
            <span style={{ color: getLineColour(), fontWeight: 'bold', fontSize: '1.2rem' }}>
              {tempC.toFixed(2)} °C
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              ({tempF.toFixed(2)} °F)
            </span>
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', opacity: 0.7, textAlign: 'right' }}>
            {getModeLabel()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-72 w-full mt-4"> {/* Slightly taller for better Y-axis resolution */}
      <ResponsiveContainer>
        <LineChart data={buffer} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          
          {/* Subtle Grid for Readability */}
          <CartesianGrid strokeDasharray="3 3" stroke={gridColour} vertical={false} />
          
          {/* X-AXIS: Now visible and formatted to HH:mm:ss */}
          <XAxis 
            dataKey="time" 
            tickFormatter={formatXAxisTime}
            stroke={axisColour}
            tick={{ fill: axisColour, fontSize: 12 }}
            minTickGap={30} // Prevents timestamps from overlapping
          />
          
          {/* Y-AXIS: Locked domain for stability */}
          <YAxis 
            domain={[0, 100]} // STATIC DOMAIN: 0 to 100 degrees Celsius
            stroke={axisColour} 
            tick={{ fill: axisColour, fontSize: 12 }} 
            tickFormatter={(val) => `${val}°`}
            width={45}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* ENGINEERING THRESHOLDS */}
          <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'CRITICAL', fill: '#ef4444', fontSize: 10 }} />
          <ReferenceLine y={40} stroke="#eab308" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'WARNING', fill: '#eab308', fontSize: 10 }} />

          <Line 
            dataKey="temp" 
            type="monotone" 
            stroke={getLineColour()} 
            strokeWidth={3} 
            strokeDasharray={dashArray} 
            dot={false} 
            isAnimationActive={false} 
            key={`${mode}-${forceUpdate}`} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}