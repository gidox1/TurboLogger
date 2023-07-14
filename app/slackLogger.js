'use strict';

const config = require('./config');
const request = require('request');
const requestConfig = require('./config').requestConfig;


class SlackLogger {

    /**
     * Recieves message and context from the logger method
     * @param {object} message 
     * @param {string} payload
     */
    async slack(message, payload) {
        const {method,contentType,json} = requestConfig;
        const colorObject = config.slackColors;
        const context = payload.context

        for(var key in colorObject) {
            if (key == context) {
                payload.color = colorObject[key];
            }
        }

        const slackBody = {
            channel: `${payload.slack.channel}`,
            text: `<!channel> *Turbo Logger: *`,
            attachments: [{
                text: `${message}`,
                color: `${payload.color}`
            }]
        }
        
        const options = {url: payload.slack.webhook_url, body: slackBody, method, contentType, json}
          
        // Exit gracefully, don't crash the service
        return request(options, (err, res) => {
            if(err) { return }
            return res.body;
          })              
    }
    
}

module.exports = SlackLogger