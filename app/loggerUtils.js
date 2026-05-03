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
    async hybridLogger(message, appConfig, structuredMeta) {
        await this.logSlack(message, appConfig);
        if('console' in appConfig || 'file' in appConfig) {
            delete appConfig.slack;
            return this.logLevelSetUp(message, appConfig, structuredMeta);
        }
    }


    /**
     * Set up file and console logger 
     * with the app Config
     * @param {Object} appConfig 
     * @param {Record<string, unknown>} [structuredMeta] merged plain-object args for providers (e.g. Datadog facets)
     */
    logLevelSetUp(message, appConfig, structuredMeta) {
        let transport;
        const level = appConfig.level;
        const config = {level, message, meta: structuredMeta};
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
    pipeStream(appConfig, message, env, structuredMeta) {
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
            return this.hybridLogger(message, appConfig, structuredMeta)
        }
        else {
            return this.logLevelSetUp(message, appConfig, structuredMeta);
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
   * Serialize Error objects to preserve their properties
   * @param {any} obj 
   */
  serializeErrors(obj) {
    if (obj instanceof Error) {
      return {
        name: obj.name,
        message: obj.message,
        stack: obj.stack,
        ...obj
      };
    }
    if (typeof obj === 'object' && obj !== null) {
      const serialized = {};
      for (const [key, value] of Object.entries(obj)) {
        serialized[key] = this.serializeErrors(value);
      }
      return serialized;
    }
    return obj;
  }

  /**
   * Format all message passed to external endpoint
   * @param  {...any} message 
   */
  buildMesaage(message) {
    let formattedMessage = '';
    const red = '\x1b[31m';
    const reset = '\x1b[0m';

    message.map(eachMessage => {
        if (eachMessage instanceof Error) {
            formattedMessage = formattedMessage + `
                ${red}Error:${reset} ${eachMessage.message}
                ${red}Stack:${reset} ${eachMessage.stack}
                ${red}Name:${reset} ${eachMessage.name}
            `;
        } else if (typeof eachMessage === 'object') {
            formattedMessage = formattedMessage + ` ${JSON.stringify(this.serializeErrors(eachMessage))}`;
        } else {
            formattedMessage = formattedMessage +  ` ${eachMessage}`;
        }
    });

    return formattedMessage;
  }

  /**
   * Plain objects in ...message are stringified into the text line; Winston still needs
   * them as metadata so Datadog (and others) receive structured fields.
   * @param {Array} messageParts
   */
  mergeStructuredMeta(messageParts) {
    const merged = {};
    for (const part of messageParts) {
      if (part && typeof part === 'object' && !(part instanceof Error)) {
        Object.assign(merged, this.serializeErrors(part));
      }
    }
    return merged;
  }


  /**
   * @param {Object} appConfig 
   * @param {Array} env 
   * @param {String} scope 
   * @param {String} message 
   */
    formatMethod(appConfig, env, scope, ...message) {
        const builtMessage = this.buildMesaage(message);
        const structuredMeta = this.mergeStructuredMeta(message);
        appConfig.level = config.level[scope];
        appConfig.context = config.level[scope];
        if(this.checkENV(env) === false){
            appConfig.console = true;
        }
        return this.pipeStream(appConfig, builtMessage, env, structuredMeta);
    }
}

module.exports = LoggerUtils;
