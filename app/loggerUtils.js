'use strict';

const loggerSetUp = require('./loggerSetUp.js');
const SlackStream = require('./slackLogger.js');
const setUp = new loggerSetUp();
const schema = require('./validator.js');
const config = require('./config.js');

class LoggerUtils {
    /**
     * Logs to file, Console and Slack
     * @param {String} message 
     * @param {Object} appConfig 
     */
    async hybridLogger(message, appConfig) {
        await this.logSlack(message, appConfig);
        if('console' in appConfig || 'file' in appConfig) {
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
    async logSlack(message, appConfig) {
        const slackLogger = new SlackStream();
        return await slackLogger.slack(message, appConfig)
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
        if(!env.length || !env || env[0] == '') {
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
   * Format all message passed to external endpoint
   * @param  {...any} message 
   */
  buildMesaage(message) {
    let formattedMessage = '';

    message.map(eachMessage => {
        if (eachMessage instanceof Error) {
            formattedMessage = formattedMessage + `Error: ${eachMessage.message}\nStack: ${eachMessage.stack}\nName: ${eachMessage.name}`;
        } else if (typeof eachMessage === 'object') {
            formattedMessage = formattedMessage + JSON.stringify(eachMessage);
        } else {
            formattedMessage = formattedMessage + eachMessage;
        }
    });

    return formattedMessage;
  }


  /**
   * 
   * @param {Object} appConfig 
   * @param {Array} env 
   * @param {String} scope 
   * @param {String} message 
   */
    formatMethod(appConfig, env, scope, ...message) {
        console.log(message, "MESSAGE");
        const builtMessage = this.buildMesaage(message);
        console.log(builtMessage, "BUILT MESSAGE");
        appConfig.level = config.level[scope];
        appConfig.context = config.level[scope];
        if(this.checkENV(env) === false){
            appConfig.console = true;
        }
        return this.pipeStream(appConfig, builtMessage, env);
    }
}

module.exports = LoggerUtils;
