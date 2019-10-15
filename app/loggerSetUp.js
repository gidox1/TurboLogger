'use strict';

const {format, transports } = require('winston');
const winston = require('winston')
const defaultConfig = require('./config');
const schema = require('./validator').Schema;
const path = require('path');

class LTransport {

    /**
     * Validates the payload sent to file or console.
     * @param {Object} appConfig 
     */
    validatePayload(appConfig) {
      const payload = schema.validate(appConfig, schema.Schema);
      if(payload.error) throw new Error('A vaidation error occured');

      if(appConfig.slack) {
          return payload.value;
      }
      else {
        if(payload.value.file === true) {
              payload.value.logDir = defaultConfig.logDir;
            }
          return this.createTransports(payload.value);
      }
    }



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
          transportArray.push(new transports.File({ filename }))
      }

      const logger = winston.createLogger({
        format: winston.format.json(),
        format: format.combine(
          format.timestamp({
            format: defaultConfig.timestampFormat
          }),
          format.printf(
            info =>
            `${info.level} [Timestamp: ${info.timestamp}]: ${JSON.stringify(info.message)}`
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
