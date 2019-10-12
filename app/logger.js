'use strict';

const loggerSetUp = require('./loggerSetUp.js');
const SlackStream = require('./slackLogger');
const setUp = new loggerSetUp();

class LoggerUtils {

    /**
     * Logs to file, Console and Slack
     * @param {String} message 
     * @param {Object} appConfig 
     */
    hybridLogger(message, appConfig) {
        const callBack =  this.logSlack(message, appConfig);

        if(callBack) {
            delete appConfig.slack;
            return this.consoleLogger(message, appConfig);
        }
    }


    /**
     * Set up winston with the app Config
     * @param {Object} appConfig 
     */
    setUpWinston(appConfig) {
        return  setUp.validatePayload(appConfig);
    }



    /**
     * Set up console transports
     * @param {String} message 
     * @param {Object} appConfig 
     */
    consoleLogger(message, appConfig) {
        const transport = this.setUpWinston(appConfig);
        const level = appConfig.level;
        const config = {level, message};
        return setUp.pushTransports(transport, config);
    }


    /**
     * Set up Slack logger
     * @param {String} message 
     * @param {Object} appConfig 
     */
    logSlack(message, appConfig) {
        const slackLogger = new SlackStream();
        return  slackLogger.slack(message, appConfig)
    }
}

class Logger {

    constructor(appConfig) {
        this.appConfig = appConfig;
    }

    /**
     * External Endpoint for the logger
     * @param {String} message 
     */
    log(message) {
        const utils = new LoggerUtils()

        if(this.appConfig.file == true && this.appConfig.slack) {
            return  utils.hybridLogger(message, this.appConfig);
        }
        else {
            return utils.consoleLogger(message, this.appConfig)
        }
    }
}


module.exports = {
    createStream: function (appConfig) {
            return new Logger(appConfig);
    }
}