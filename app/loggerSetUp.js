'use strict';

const winston = require('winston');
const defaultConfig = require('./config.js');
const path = require('path');
const types = require('./types.js');
const { uploadLog } = require('./providers/logTail');
const { sendLogsToDatadog } = require('./providers/datadog');

class LTransport {
  /**
   * Create Transport for logging to console or file
   * @param {types.AppConfig} param 
   */
  createTransports(param) {
    const transportArray = [];
    const defaultLoggerConfig = param.hasOwnProperty('enableTimestamp') ?
      param :
      { ...param, enableTimestamp: true };

    if(param.console == true) {
        transportArray.push(defaultConfig.transpotsLevelConfig(defaultLoggerConfig));
    }

    if(param.file == true) {
      param.logDir = defaultConfig.logDir;
      const filename = path.join(defaultConfig.logDir, 'info.log');
      transportArray.push(new winston.transports.File({ filename }))
    }

    (!param.console && !param.file) ? 
      transportArray.push(defaultConfig.transpotsLevelConfig(defaultLoggerConfig)) 
        : param.console = false;
    
    const logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp({
          format: defaultConfig.timestampFormat
        }),
        winston.format.printf(async (info) => {
          const message = `${info.level} [Timestamp: ${info.timestamp}]: ${info.message}`;
          
          if (param.providers?.logtail) {
            await uploadLog(info.message, info, info.level, param.providers.logtail);
          }

          if (param.providers?.datadog) {
            await sendLogsToDatadog(info.message, info, info.level, param.providers.datadog);
          }
          
          return message;
        })
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