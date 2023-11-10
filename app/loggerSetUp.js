'use strict';

const winston = require('winston');
const defaultConfig = require('./config.js');
const path = require('path');

class LTransport {
  /**
   * Create Transport for logging to console or file
   * @param {param object} param 
   */
  createTransports(param) {
    const filename = path.join(defaultConfig.logDir, 'info.log');
    const transportArray = [];
    if(param.console == true) {
        transportArray.push(defaultConfig.transpotsLevelConfig);
    }

    if(param.file == true) {
      param.logDir = defaultConfig.logDir;
      transportArray.push(new winston.transports.File({ filename }))
    }

    (!param.console && !param.file) ? 
      transportArray.push(defaultConfig.transpotsLevelConfig) 
        : param.console = false;
    
    const logger = winston.createLogger({
      format: winston.format.json(),
      format: winston.format.combine(
        winston.format.timestamp({
          format: defaultConfig.timestampFormat
        }),
        winston.format.printf(
          info =>
          `${info.level} [Timestamp: ${info.timestamp}]: ${info.message}`
        )
      ),
      transports: transportArray
    });

    return logger;
  }
    


  /**
   * Configure transports based on selected level
   * @param {Winston Transport} transport 
   * @param {Object} config 
   */
  pushTransports(transport, config) {
    const {message, level} = config;
    
    switch (level) {
      case 'warn' :
        return transport.warn(message);
      case 'error': 
        return transport.error(message);
      default : 
        return transport.info(message);
    }
  }
}


module.exports = LTransport;