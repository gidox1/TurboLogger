'use strict';


export default class DataFactory {

    static getConfigForSlack = () => {
            return  {
                "slack": {
                    webhook_url: `https://hooks.slack.com/services/${process.env.SECRET}`,
                    channel: 'passionapi',
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
