'use strict';

const loggerSetUp = require('./loggerSetUp.js');
const SlackStream = require('./slackLogger');
const setUp = new loggerSetUp();

class Logger {

    constructor(appConfig) {
        this.appConfig = appConfig;
    }

    log(message) {
        console.log('setting up winston', message, this.appConfig, '\n\n')
        const transport = this.setUpWinston(this.appConfig);
        console.log(transport, 'trassss')
        const level = this.appConfig.level;
        const config = {level, message};
        return setUp.pushTransports(transport, config)
    }

    setUpWinston(appConfig) {
        console.log('set up')
        return setUp.validatePayload(appConfig);
    }
}


class Slack {

    constructor(appConfig) {
        this.appConfig = appConfig;
    } 

    log(message) {
        console.log('here oo', message, this.appConfig)
        const appConfig = this.appConfig;
        const slackLogger = new SlackStream();
        return slackLogger.slack(message, appConfig)
    }

}


class Hybrid {

    constructor(appConfig) {
        this.appConfig = appConfig;
    }

    log(message) {
        const res = this.logSLack(message);
        const loga = this.defaultLogger(message)
        // console.log(res.body, 'res')
        return new Promise.all([res, loga])
                    .then(resp => {
                        console.log(resp, 'resp')
                    })
                    .catch(err => {
                        console.log(err, 'err');
                    })
    }

    logSLack(message) {
        const slackLog = new Slack(this.appConfig);
        return slackLog.log(message);
    }

    defaultLogger(message) {
        console.log(message, 'mess')
        const logger = new Logger(this.appConfig);
        return logger.log(message);
    }

}


module.exports = {
    createStream: function (appConfig) {
        if(appConfig.hybrid_log == true) {
            console.log('hybrid');
            return new Hybrid(appConfig);
        }
        else if(appConfig.slack && appConfig.file == true) {
            return new Slack(appConfig);
        }
        console.log('no slack')
        return new Logger(appConfig);
    }
}