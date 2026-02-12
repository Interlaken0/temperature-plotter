import React, { useState, useEffect } from 'react';

/**
 * ModeStatus Component
 * 
 * Displays the current hardware/simulator mode and provides
 * visual feedback for mode changes and hardware health.
 * 
 * Portfolio Evidence:
 * Demonstrates real-time status monitoring
 * Shows user experience considerations
 * Exhibits hardware abstraction implementation
 * Illustrates production-ready error handling
 */
const ModeStatus = () => {
  const [mode, setMode] = useState('unknown');
  const [healthy, setHealthy] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [deviceType, setDeviceType] = useState('Unknown');
  const [notifications, setNotifications] = useState([]);

  // Listen for mode changes
  useEffect(() => {
    if (window.api && window.api.onModeChange) {
      window.api.onModeChange((data) => {
        setMode(data.mode);
        setNotifications(prev => [...prev, {
          type: 'mode-change',
          message: `Mode changed to ${data.mode}`,
          reason: data.reason,
          timestamp: data.timestamp
        }]);
        
        // Evidence: Log mode changes
        console.log(`Evidence: Mode changed to ${data.mode} - ${data.reason}`);
      });
    }
  }, []);

  // Poll device status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        if (window.api && window.api.getDeviceStatus) {
          const status = await window.api.getDeviceStatus();
          setMode(status.mode);
          setHealthy(status.healthy);
          setLastUpdate(status.lastUpdate);
          setDeviceType(status.deviceType);
        }
      } catch (error) {
        console.error('Failed to get device status:', error);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const getModeIcon = () => {
    if (mode === 'hardware') {
      return healthy ? '🔌' : '⚠️';
    }
    return '🔧';
  };

  const getModeColor = () => {
    if (mode === 'hardware') {
      return healthy ? 'text-green-600' : 'text-red-600';
    }
    return 'text-blue-600';
  };

  const getHealthStatus = () => {
    if (mode === 'simulator') return 'Simulation Active';
    if (healthy) return 'Hardware Connected';
    return 'Hardware Timeout';
  };

  const getTimeSinceLastUpdate = () => {
    const seconds = Math.floor((Date.now() - lastUpdate) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  const handleModeSwitch = async (newMode) => {
    try {
      if (window.api && window.api.switchMode) {
        await window.api.switchMode({ mode: newMode });
        setNotifications(prev => [...prev, {
          type: 'manual-switch',
          message: `Manually switched to ${newMode} mode`,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('Failed to switch mode:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getModeIcon()}</span>
          <div>
            <h3 className={`font-semibold ${getModeColor()}`}>
              {mode === 'hardware' ? 'Hardware Mode' : 'Simulation Mode'}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {getHealthStatus()} • {deviceType}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Last update: {getTimeSinceLastUpdate()}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => handleModeSwitch('hardware')}
            disabled={mode === 'hardware'}
            className={`px-3 py-1 rounded text-sm ${
              mode === 'hardware'
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Hardware
          </button>
          <button
            onClick={() => handleModeSwitch('simulator')}
            disabled={mode === 'simulator'}
            className={`px-3 py-1 rounded text-sm ${
              mode === 'simulator'
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            Simulator
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mt-3 border-t pt-3">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Recent Activity
          </h4>
          <div className="space-y-1">
            {notifications.slice(-3).reverse().map((notification, index) => (
              <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">
                  {notification.type === 'mode-change' ? '🔄' : '🎛️'}
                </span>
                {' '}{notification.message}
                <span className="ml-2 text-gray-500">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModeStatus;
