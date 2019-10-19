'use strict';


const loggerSetUp = require('./loggerSetUp');
const SlackStream = require('./slackLogger');
const setUp = new loggerSetUp();
const schema = require('./validator').Schema;


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
            return this.logLevelSetUp(message, appConfig);
        }
    }


    /**
     * Set up file and console logger 
     * with the app Config
     * @param {Object} appConfig 
     */
    logLevelSetUp(message, appConfig) {
        let transport = '';
        if(!appConfig.slack) {
            transport = setUp.createTransports(appConfig);
        }
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


    /**
     * Pipes config to Endpoint for the logger
     * @param {String} message 
     */
    pipeStream(appConfig, message) {
        if(appConfig.file == true && appConfig.slack) {
            return  this.hybridLogger(message, appConfig);
        }
        else if(appConfig.hasOwnProperty('slack')) {
            return this.logSlack(message, appConfig)
        }
        else if(appConfig.file == true ) {
            return this.logLevelSetUp(message, appConfig);
        }
        else {
            appConfig.console = true;
            return this.logLevelSetUp(message, appConfig)
        }
    }


   /**
   * Validates the payload sent to file or console.
   * @param {Object} appConfig 
   */
   validatePayload(appConfig) {
       return schema.validate(appConfig, schema.Schema);
  }
}

module.exports = LoggerUtils;
