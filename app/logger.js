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
    log(message) {
        const appConfig = this.appConfig;
        appConfig.level = config.level.info;
        appConfig.context = config.level.info;
        return utils.pipeStream(appConfig, message);
    }



    /**
     * External Endpoint for the logger
     * @param {String} message 
     */
    error(message) {
        const appConfig = this.appConfig;
        appConfig.level = config.level.error;
        appConfig.context = config.level.error;
        return utils.pipeStream(appConfig, message);
    }



    /**
     * External Endpoint for the logger
     * @param {String} message 
     */
    warn(message) {
        const appConfig = this.appConfig;
        appConfig.level = config.level.warn;
        appConfig.context = config.level.warn;
        return utils.pipeStream(appConfig, message);
    }
}


module.exports = {

    /**
     * Creates logger stream
     * @param {Object} appConfig 
     */
    createStream: function (appConfig) {
        const validator = utils.validatePayload(appConfig);
        if(validator.error){
            console.log('\n', config.validationErrorMessage + ': ', validator.error.details, '\n');
            return false;
        }  
        return new Logger(appConfig);  
    }
}