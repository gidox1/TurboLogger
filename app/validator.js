'use strict';
const joi = require('joi');

const providerSchema = joi.object({
    sourceToken: joi.string().required().min(5),
    endpoint: joi.string().uri().required()
});

module.exports = joi.object({
    slack: joi.object({
        webhook_url: joi.string().required(),
        channel: joi.string().required(),
    }),
    providers: joi.object({
        logtail: providerSchema,
    }),
    enableTimestamp: joi.boolean().default(true),
});
