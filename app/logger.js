'use strict';

const loggerSetUp = require('./loggerSetUp.js');
const slack = require('./slackLogger');

class Logger {

    constructor(appConfig) {
        this.appConfig = appConfig;
    }

    log() {
        return this.setUpWinston(this.appConfig);
    }

    setUpWinston(appConfig) {
        const setUp = new loggerSetUp();
        return setUp.validatePayload(appConfig);
    }
}

module.exports = {
    createStream: function (appConfig) {
        return new Logger(appConfig);
    },

    slackStream: function (appConfig) {
        return new slack(appConfig);
    }
}