'use strict';
const joi = require('joi');

const logtailSchema = joi.object({
    sourceToken: joi.string().required().min(5),
    endpoint: joi.string().uri().required()
});

const datadogSchema = joi.object({
    apiKey: joi.string().required().min(5),
    endpoint: joi.string().uri().required(),
    service: joi.string().required(),
    source: joi.string().optional(),
    hostname: joi.string().optional(),
    tags: joi.string().optional(),
    env: joi.string().required(),
});

module.exports = joi.object({
    slack: joi.object({
        webhook_url: joi.string().required(),
        channel: joi.string().required(),
    }),
    providers: joi.object({
        logtail: logtailSchema,
        datadog: datadogSchema,
    }),
    enableTimestamp: joi.boolean().default(true).optional(),
});
