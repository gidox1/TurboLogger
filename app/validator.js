const joi = require('joi');

const Schema = {
    scope: joi.string().required(),
    level: joi.string().required(),
    file: joi.boolean().optional(),
    logDir: joi.string().optional(),
    appLabel: joi.boolean().optional(),
    colorize: joi.boolean().optional(),
    console: joi.boolean().optional()
}

const slackSchema = {
    scope: joi.string().required(),
    webhook_url: joi.string().required(),
    channel: joi.string().required(),
}

module.exports = {Schema, slackSchema}