const joi = require('joi');

const Schema = joi.object({
    slack: joi.object({
        webhook_url: joi.string().required(),
        channel: joi.string().required(),
    }).required()
});

module.exports = {Schema}