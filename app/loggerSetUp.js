'use strict';

const { createLogger, format, transports } = require('winston');
const winston = require('winston')
const joi = require('joi');
const defaultConfig = require('./config');
const schema = require('./validator');
const path = require('path');

class LTransport {

    /**
     * Validates the payload sent to file or console.
     * @param {Object} appConfig 
     */
    validatePayload(appConfig) {
      let payload = '';

      switch(appConfig.scope) {
          case 'slack' :
            payload = joi.validate(appConfig, schema.slackSchema);
            return payload.value;
          case 'default' :
            payload = joi.validate(appConfig, schema.Schema);
            break;
          default:
            throw new Error('Scope not recognized..Enter a valid scope')
      }

      if(payload.error) {
        throw new Error(payload.error);
      }
      else{
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
      transportArray.push(defaultConfig.transpotsLevelConfig);

      if(param.file == true) {
          transportArray.push(new transports.File({ filename }))
      }

      const logger = winston.createLogger({
        format: winston.format.json(),
        format: format.combine(
          format.timestamp({
            format: defaultConfig.timestampFormat
          }),
          format.printf(info => `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`)
        ),
        transports: transportArray
      });

      return logger;
    }
}

module.exports = LTransport;
