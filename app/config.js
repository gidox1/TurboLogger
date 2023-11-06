import { format, transports} from 'winston'

export default {
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
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST'
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
    validationErrorMessage: 'A validation error occured',
    defaultEnv: ['console']
}
