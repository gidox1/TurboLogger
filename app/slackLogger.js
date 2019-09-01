'use strict';

const loggerSetUp = require('./loggerSetUp');
const colorObject = require('./config').slackColors;
const request = require('request');
const requestConfig = require('./config').requestConfig;


class SlackLogger {

    constructor(appConfig) {
        this.appConfig = appConfig;
    }


    /**
     * Recieves message and context from the logger method
     * @param {object} message 
     * @param {string} context
     */
    slack(message, context) {
        const log = new loggerSetUp();
        const obj = this.appConfig
        const validatedPayload = log.validatePayload(obj);
        const stringifiedMessage = JSON.stringify(message); 
        const {method,contentType,json} = requestConfig;

        for(var key in colorObject) {
            if (key == context) {
                validatedPayload.color = key;
            }
        }

        const slackBody = {
            channel: `${validatedPayload.channel}`,
            text: `<!channel> *SLack Logger Message*`,
            attachments: [{
                text: `${stringifiedMessage}`,
                color: `${validatedPayload.color}`
            }]
        }
        const options = {url: validatedPayload.webhook_url, body: slackBody, method, contentType, json}
          
        return request(options, (err, res) => {
            if(err) {throw new Error('Error occured while making reuest');}
            return res.body;
          })              
    }
}

module.exports = SlackLogger