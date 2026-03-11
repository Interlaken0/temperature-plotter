// TEMPERATURE CHART COMPONENT - SCADA Visualisation
// ============================================================================
// Upgraded industrial charting component featuring:
// - Real-time KPI Analytics (Max, Min, Average for current timeframe)
// - Dynamic Timeframe Toggle (Live Stream, Rolling Window, Full Dataset)
// - Fixed Y-Axis scaling for visual stability (0°C to 100°C)
// - Visible X-Axis with rolling HH:mm:ss timestamps
// - Critical (80°C) and Warning (40°C) engineering threshold lines
// - Dual-unit (Celsius/Fahrenheit) diagnostic tooltips
// - Dynamic SVG linear gradient anchored to absolute temperatures
// - Fully responsive Light/Dark mode theming
// ============================================================================

import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  CartesianGrid 
} from 'recharts';

export default function TemperatureChart({ data, darkMode, mode }) {
  const [timeWindow, setTimeWindow] = useState(60);
  const [forceUpdate, setForceUpdate] = useState(0);

  const buffer = data ? (timeWindow === 'ALL' ? data : data.slice(-timeWindow)) : [];

  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [mode]);

  const axisColour = darkMode ? '#94a3b8' : '#475569';
  const gridColour = darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const tooltipBg = darkMode ? '#0f172a' : '#ffffff';
  const tooltipBorder = darkMode ? '#334155' : '#cbd5e1';
  const tooltipText = darkMode ? '#f8fafc' : '#0f172a';
  const panelBg = darkMode ? 'bg-slate-800/50' : 'bg-slate-100';

  const getLineColour = () => {
    return mode === 'simulator' ? '#f59e0b' : '#00ffcc'; 
  };

  const dashArray = mode === 'simulator' ? '5 5' : '0';

  const formatXAxisTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-GB', { hour12: false });
  };

  // Upgraded Tooltip Text
  const getModeLabel = () => {
    return mode === 'simulator' ? '[SIMULATION ACTIVE]' : '[HARDWARE ACTIVE]';
  };

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
          <p style={{ margin: '8px 0 0 0', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '0.05em', opacity: 0.8, textAlign: 'right', color: getLineColour() }}>
            {getModeLabel()}
          </p>
        </div>
      );
    }
    return null;
  };

  const validData = buffer.filter(d => typeof d.temp === 'number');
  const currentMax = validData.length ? Math.max(...validData.map(d => d.temp)) : 0;
  const currentMin = validData.length ? Math.min(...validData.map(d => d.temp)) : 0;
  const currentAvg = validData.length ? (validData.reduce((sum, d) => sum + d.temp, 0) / validData.length) : 0;
  
  const dataRange = Math.max(currentMax - currentMin, 1);

  const getOffset = (targetTemp) => {
    const percent = (currentMax - targetTemp) / dataRange;
    return Math.max(0, Math.min(1, percent)) * 100;
  };

  const activeBtnClass = "bg-blue-600 text-white font-bold shadow-md";
  const inactiveBtnClass = darkMode 
    ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700" 
    : "bg-slate-200 text-slate-700 hover:bg-slate-300 border border-slate-300";

  return (
    <div className="w-full mt-4">
      
      <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 p-3 rounded-lg ${panelBg} border ${darkMode ? 'border-slate-700/50' : 'border-slate-300'}`}>
        
        {/* UPGRADED KPI TEXT */}
        <div className="flex gap-4 sm:gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Peak Value</span>
            <span className={`text-lg font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              {currentMax.toFixed(1)}°C
            </span>
          </div>
          <div className={`w-px h-8 ${darkMode ? 'bg-slate-600/50' : 'bg-slate-300'}`}></div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Mean Value</span>
            <span className={`text-lg font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>
              {currentAvg.toFixed(1)}°C
            </span>
          </div>
          <div className={`w-px h-8 ${darkMode ? 'bg-slate-600/50' : 'bg-slate-300'}`}></div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Base Value</span>
            <span className={`text-lg font-bold ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
              {currentMin.toFixed(1)}°C
            </span>
          </div>
        </div>

        {/* UPGRADED BUTTON TEXT */}
        <div className="flex gap-2">
          <button 
            onClick={() => setTimeWindow(60)}
            className={`px-3 py-1.5 text-xs tracking-wide rounded transition-all duration-200 ${timeWindow === 60 ? activeBtnClass : inactiveBtnClass}`}
          >
            Live Stream (60s)
          </button>
          <button 
            onClick={() => setTimeWindow(300)}
            className={`px-3 py-1.5 text-xs tracking-wide rounded transition-all duration-200 ${timeWindow === 300 ? activeBtnClass : inactiveBtnClass}`}
          >
            Rolling Window (5m)
          </button>
          <button 
            onClick={() => setTimeWindow('ALL')}
            className={`px-3 py-1.5 text-xs tracking-wide rounded transition-all duration-200 ${timeWindow === 'ALL' ? activeBtnClass : inactiveBtnClass}`}
          >
            Full Dataset
          </button>
        </div>

      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer>
          <LineChart data={buffer} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            
            <defs>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset={`${getOffset(100)}%`} stopColor="#ef4444" stopOpacity={1}/>
                <stop offset={`${getOffset(80)}%`} stopColor="#ef4444" stopOpacity={1}/> 
                <stop offset={`${getOffset(40)}%`} stopColor="#eab308" stopOpacity={1}/> 
                <stop offset={`${getOffset(0)}%`} stopColor="#00ffcc" stopOpacity={1}/>  
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={gridColour} vertical={false} />
            
            <XAxis 
              dataKey="time" 
              tickFormatter={formatXAxisTime}
              stroke={axisColour}
              tick={{ fill: axisColour, fontSize: 12 }}
              minTickGap={30} 
            />
            
            <YAxis 
              domain={[0, 100]} 
              stroke={axisColour} 
              tick={{ fill: axisColour, fontSize: 12 }} 
              tickFormatter={(val) => `${val}°`}
              width={45}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* UPGRADED THRESHOLD TEXT */}
            <ReferenceLine y={80} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'SYS.CRITICAL', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
            <ReferenceLine y={40} stroke="#eab308" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'SYS.WARNING', fill: '#eab308', fontSize: 10, fontWeight: 'bold' }} />

            <Line 
              dataKey="temp" 
              type="monotone" 
              stroke={mode === 'simulator' ? '#f59e0b' : 'url(#colorTemp)'} 
              strokeWidth={3} 
              strokeDasharray={dashArray} 
              dot={false} 
              isAnimationActive={false} 
              key={`${mode}-${forceUpdate}`} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}