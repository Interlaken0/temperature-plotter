// GLOBAL CONSTANTS - Application Configuration Management
// ============================================================================
// Centralised configuration for application-wide settings:
// - Defines buffer size for temperature data management
// - Provides single source of truth for performance parameters
// - Enables easy configuration adjustments across application
// - Demonstrates professional constant management patterns
// - Optimises memory usage and performance
// ============================================================================

// MAXIMUM BUFFER SIZE - Data retention limit for temperature history
// ============================================================================
// Defines the maximum number of temperature data points to retain:
// - 500 points provides approximately 8+ minutes of data at 1Hz sampling
// - Balances memory usage with historical analysis capabilities
// - Prevents memory leaks in long-running applications
// - Ensures smooth chart performance with large datasets
// ============================================================================
export const MAX_BUFFER = 5000; // Maximum historical data points to retain (~83 minutes at 1Hz)
export const ALL_TIME = 'ALL_TIME'; // Special marker for unlimited historical data
