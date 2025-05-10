'use strict';
const config = require('./config.js');
const LoggerUtils = require('./loggerUtils.js');
const types = require('./types.js');

let utils = null;

class Logger {

    constructor(appConfig, env) {
        utils = new LoggerUtils();
        this.env = env || config.defaultEnv,
        this.appConfig = appConfig;
    }


    /**
     * External Endpoint for the logger
     * @param {String} message 
     */
    log(...message) {
        return utils.formatMethod(this.appConfig, this.env, config.scope.info, ...message);
    }



    /**
     * External Endpoint for the logger
     * @param {String} message 
     */
    error(...message) {
        return utils.formatMethod(this.appConfig, this.env, config.scope.error, ...message)
    }



    /**
     * External Endpoint for the logger
     * @param {String} message 
     */
    warn(...message) {
        return utils.formatMethod(this.appConfig, this.env, config.scope.warn, ...message);
    }
}

/**
 * Creates logger stream
 * @param {types.AppConfig} appConfig 
 */
module.exports = {
    /**
     * 
     * @param {types.AppConfig} appConfig 
     * @param {string[]} env - Array of environment strings
     * @returns {Object}
     */
    createStream: (appConfig = {}, env = null) => {    
        if(appConfig && appConfig.hasOwnProperty('slack')) {
            let utils = new LoggerUtils();
            const validator = utils.validatePayload(appConfig);
            if(validator.error){
                throw new Error(`${config.validationErrorMessage}: ${validator.error.details[0].message}`);
            }
        }
        return new Logger(appConfig, env);  
    }
}
