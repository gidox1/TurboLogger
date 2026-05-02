'use strict';

const toDatadogStatus = (level) => {
  if (!level || typeof level !== 'string') return 'info';
  switch (level.toLowerCase()) {
    case 'error':
      return 'error';
    case 'warn':
    case 'warning':
      return 'warn';
    case 'info':
    case 'http':
      return 'info';
    case 'verbose':
    case 'debug':
    case 'silly':
      return 'debug';
    default:
      return 'info';
  }
};

module.exports = {
  toDatadogStatus,
};
