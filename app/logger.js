'use strict';
const config = require('./config')
const LoggerUtils = require('./loggerUtils');
const utils = new LoggerUtils();


class Logger {

    constructor(appConfig) {
        this.appConfig = appConfig;
    }


    /**
     * External Endpoint for the logger
     * @param {String} message 
     */
    log(message, env) {
        return utils.formatMethod(this.appConfig, env, config.scope.info, message);
    }



    /**
     * External Endpoint for the logger
     * @param {String} message 
     */
    error(message, env) {
        return utils.formatMethod(this.appConfig, env, config.scope.error, message)
    }



    /**
     * External Endpoint for the logger
     * @param {String} message 
     */
    warn(message, env) {
        return utils.formatMethod(this.appConfig, env, config.scope.warn, message);
    }
}


module.exports = {

    /**
     * Creates logger stream
     * @param {Object} appConfig 
     */
    createStream: function (appConfig) {
        let validator = {}; 
        if(appConfig.hasOwnProperty('slack')) {
            validator = utils.validatePayload(appConfig);
        }
        if(validator.error){
            console.log('\n', config.validationErrorMessage + ': ', validator.error.details, '\n');
            return false;
        }  
        return new Logger(appConfig);  
    }
}