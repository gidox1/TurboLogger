'use strict';


const loggerSetUp = require('./loggerSetUp');
const SlackStream = require('./slackLogger');
const setUp = new loggerSetUp();
const schema = require('./validator').Schema;
const config = require('./config');


class LoggerUtils {

    /**
     * Logs to file, Console and Slack
     * @param {String} message 
     * @param {Object} appConfig 
     */
    hybridLogger(message, appConfig) {
        const callBack =  this.logSlack(message, appConfig);
        if(callBack && (appConfig.console || appConfig.file)) {
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
        let transport;
        const level = appConfig.level;
        const config = {level, message};
        transport = setUp.createTransports(appConfig);
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
    pipeStream(appConfig, message, env) {
        let obj = Object.assign({}, env)
        let keys = {};
        this.slackValidator(appConfig, env);
        const entries = Object.entries(obj)
        for (const [key, value] of entries) {
            keys[value] = value;
            if(value == 'slack' && appConfig.slack){
                appConfig[value] = appConfig.slack;
            }
            else {
                appConfig[value] = true;
            }
        }
        if(this.matchLogger(appConfig, keys)) {
            return this.hybridLogger(message, appConfig)
        }
        else {
            return this.logLevelSetUp(message, appConfig);
        }
    }


    /**
     * @param {Object} payload 
     * @param {Object} obj 
     */
    matchLogger(payload, keys) {
        return (payload.slack && keys.slack)
    }


    /**
     * 
     * @param {Object} payload 
     * @param {Object} envConfig 
     */
    slackValidator(payload, envArray){
        return envArray.map(value => {
            if(!payload.slack && value == 'slack') {
                throw Error('Please set Slack config');
            }
        })
    }


    /**
     * Check if env is empty or undefined
     * @param {Arrray} env 
     */
    checkENV(env){
        if(env.length == 0 || env === undefined || env[0] == '') {
            return false;
        }
        return true;
    }


   /**
   * Validates the payload sent to file or console.
   * @param {Object} appConfig 
   */
   validatePayload(appConfig) {
       return schema.validate(appConfig, schema.Schema);
  }


  /**
   * 
   * @param {Object} appConfig 
   * @param {Array} env 
   * @param {String} scope 
   * @param {String} message 
   */
    formatMethod(appConfig, env, scope, message) {
        appConfig.level = config.level[scope];
        appConfig.context = config.level[scope];
        if(this.checkENV(env) === false){
            appConfig.console = true;
        }
        return this.pipeStream(appConfig, message, env);
    }
}

module.exports = LoggerUtils;
