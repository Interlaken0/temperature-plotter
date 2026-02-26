/**
 * @file Console colour utilities for enhanced terminal output
 * @module consoleColours
 */

const colours = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m'
};

const symbols = {
  success: '[OK]',
  error: '[ERROR]',
  warning: '[!]',
  info: '[i]',
  hardware: '[+]',
  simulator: '[~]',
  temperature: '[TEMP]'
};

/**
 * Colour-coded console logging functions
 */
module.exports = {
  colours,
  symbols,
  
  success: (message) => {
    console.log(`${colours.green}${colours.bright}${symbols.success} ${message}${colours.reset}`);
  },
  
  error: (message) => {
    console.log(`${colours.red}${colours.bright}${symbols.error} ${message}${colours.reset}`);
  },
  
  warning: (message) => {
    console.log(`${colours.yellow}${colours.bright}${symbols.warning} ${message}${colours.reset}`);
  },
  
  info: (message) => {
    console.log(`${colours.cyan}${colours.bright}${symbols.info} ${message}${colours.reset}`);
  },
  
  hardware: (message) => {
    console.log(`${colours.blue}${colours.bright}${symbols.hardware} [HAL] ${message}${colours.reset}`);
  },
  
  simulator: (message) => {
    console.log(`${colours.magenta}${colours.bright}${symbols.simulator} SIMULATOR ${message}${colours.reset}`);
  },
  
  temperature: (celsius, fahrenheit, source = 'REAL') => {
    const colour = source === 'REAL' ? colours.green : colours.magenta;
    const symbol = source === 'REAL' ? symbols.hardware : symbols.simulator;
    console.log(`${colour}${colours.bright}${symbol} [${source}] ${celsius.toFixed(2)} deg C (${fahrenheit.toFixed(2)} deg F)${colours.reset}`);
  },
  
  status: (message, type = 'info') => {
    const typeColours = {
      success: colours.green,
      error: colours.red,
      warning: colours.yellow,
      info: colours.blue
    };
    const colour = typeColours[type] || colours.blue;
    console.log(`${colour}${colours.bright}> ${message}${colours.reset}`);
  },
  
  separator: () => {
    console.log(`${colours.dim}${'='.repeat(50)}${colours.reset}`);
  },
  
  header: (title) => {
    console.log(`\n${colours.cyan}${colours.bright}==================================================${colours.reset}`);
    console.log(`${colours.cyan}${colours.bright}  ${title.toUpperCase()}  ${colours.reset}`);
    console.log(`${colours.cyan}${colours.bright}==================================================${colours.reset}\n`);
  }
};