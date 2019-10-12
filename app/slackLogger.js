'use strict';

const loggerSetUp = require('./loggerSetUp');
const config = require('./config');
const request = require('request');
const requestConfig = require('./config').requestConfig;


class SlackLogger {

    /**
     * Recieves message and context from the logger method
     * @param {object} message 
     * @param {string} payload
     */
    slack(message, payload) {
        const log = new loggerSetUp();
        const validatedPayload = log.validatePayload(payload);
        const stringifiedMessage = JSON.stringify(message);
        const {method,contentType,json} = requestConfig;
        const colorObject = config.slackColors;
        const context = payload.slack.context ? payload.slack.context : payload.slack.context = config.deaultContext;
        
        for(var key in colorObject) {
            if (key == context) {
                validatedPayload.color = colorObject[key];
            }
        }

        const slackBody = {
            channel: `${validatedPayload.slack.channel}`,
            text: `<!channel> *SLack Logger Message*`,
            attachments: [{
                text: `${stringifiedMessage}`,
                color: `${validatedPayload.color}`
            }]
        }
        const options = {url: validatedPayload.slack.webhook_url, body: slackBody, method, contentType, json}
          
        return request(options, (err, res) => {
            if(err) {console.log(err); throw new Error('Error occured while making reuest');}
            console.log('body',res.body)
            return res.body;
          })              
    }
}

module.exports = SlackLogger