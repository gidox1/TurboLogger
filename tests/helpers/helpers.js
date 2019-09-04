'use strict';


class DataFactory {

    static getDefaultScopePayload = () => {
        return {
                scope: 'default',
                level: 'info',
                file: true,
        }
    }

    static getSlackScopePayload = () => {
        return {
                scope: 'slack',
                webhook_url : `https://hooks.slack.com/services/${process.env.SECRET}`,
                channel: 'test_channel'
        }
    }
}

module.exports = DataFactory