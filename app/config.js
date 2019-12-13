
const path = require('path');
const {format, transports, } = require('winston');

const defaultConfig = {
    level: {
        info: 'info',
        warn: 'warn',
        error: 'error'
    },
    scope: {
        info: 'info',
        warn: 'warn',
        error: 'error' 
    },
    slack: false,
    deaultContext: 'info',
    slackColors : {
        error: 'danger',
        info: 'good',
        verbose: 'good',
        silly: 'good',
        debug: 'good',
        warn: 'warning'
    },
    requestConfig: {
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        json: true
    },
    file: false,
    appLabel: false,
    colorize: false,
    timestampFormat: 'YYYY-MM-DD HH:mm:ss',
    logDir: 'fileLog',
    transpotsLevelConfig : new transports.Console({
        level: 'info',
        format: format.combine(
            format.colorize(),
            format.printf(
              info =>
                `${info.level} [Timestamp: ${info.timestamp}]: ${info.message}`
            )
          ),
        json: true,
    }),
    validationErrorMessage: 'A validation error occured'
}

module.exports = defaultConfig;