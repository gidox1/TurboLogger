'use strict';


class DataFactory {

    static getConfigForSlack = () => {
            return  {
                "level": "info",
                "slack": {
                    webhook_url: `https://hooks.slack.com/services/${process.env.SECRET}`,
                    channel: 'passionapi',
                    context: 'info'
                }
        }
    }

    static getConfigForConsole = () => {
        return {
            "level": "info",
            "file": true
        }
    }

    static getConfigForHybrid = () => {
        return {
            "level": "info",
            "file": true,
            "slack": {
                webhook_url: `https://hooks.slack.com/services/${process.env.SECRET}`,
                channel: 'passionapi',
                context: 'info'
            }
        }
    }
}

module.exports = DataFactory