'use strict';

import config from './config.js';
import axios from 'axios';
const requestConfig = config.requestConfig;

export class SlackLogger {
    /**
     * Recieves message and context from the logger method
     * @param {object} message 
     * @param {string} payload
     */
    async slack(message, payload) {    
        const colorObject = config.slackColors;
        const context = payload.context;
    
        for (var key in colorObject) {
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
        };
    
        const options = {
            method: requestConfig.method,
            url: payload.slack.webhook_url,
            data: slackBody,
            headers: requestConfig.headers
        };
    
        try {
            await axios(options);
        } catch (error) {
            // Return null or handle the error gracefully
            return null;
        }
    }
    
}
