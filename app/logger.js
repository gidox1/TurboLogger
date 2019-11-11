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
        const appConfig = this.appConfig;
        appConfig.level = config.level.info;
        appConfig.context = config.level.info;
        if(utils.checkENV(env) === false){
            appConfig.console = true;
        }
        return utils.pipeStream(appConfig, message, env);
    }



    /**
     * External Endpoint for the logger
     * @param {String} message 
     */
    error(message, env) {
        const appConfig = this.appConfig;
        appConfig.level = config.level.error;
        appConfig.context = config.level.error;
        if(utils.checkENV(env) === false){
            appConfig.console = true;
        }
        return utils.pipeStream(appConfig, message, env);
    }



    /**
     * External Endpoint for the logger
     * @param {String} message 
     */
    warn(message, env) {
        const appConfig = this.appConfig;
        appConfig.level = config.level.warn;
        appConfig.context = config.level.warn;
        if(utils.checkENV(env) === false){
            appConfig.console = true;
        }
        return utils.pipeStream(appConfig, message, env);
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