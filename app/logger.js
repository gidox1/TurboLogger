'use strict';
const config = require('./config')
const LoggerUtils = require('./loggerUtils');
let utils = null


class Logger {

    constructor(appConfig, env) {
        utils = new LoggerUtils();
        this.env = env || ['console'],
        this.appConfig = appConfig;
    }


    /**
     * External Endpoint for the logger
     * @param {String} message 
     */
    log(message) {
        return utils.formatMethod(this.appConfig, this.env, config.scope.info, message);
    }



    /**
     * External Endpoint for the logger
     * @param {String} message 
     */
    error(message) {
        return utils.formatMethod(this.appConfig, this.env, config.scope.error, message)
    }



    /**
     * External Endpoint for the logger
     * @param {String} message 
     */
    warn(message) {
        return utils.formatMethod(this.appConfig, this.env, config.scope.warn, message);
    }
}


module.exports = {

    /**
     * Creates logger stream
     * @param {Object} appConfig 
     */
    createStream: function (appConfig, env = null) {
        if (appConfig == null || appConfig == undefined) {
            throw new Error('Please initialize logger with config object')
        } 
        
        if(appConfig && appConfig.hasOwnProperty('slack')) {
            const validator = utils.validatePayload(appConfig);
            if(validator.error){
                throw new Error('\n', config.validationErrorMessage + ': ', validator.error.details, '\n');
            }
        }
          
        return new Logger(appConfig, env);  
    }
}