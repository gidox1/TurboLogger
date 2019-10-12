const joi = require('@hapi/joi');

const Schema = joi.object({
    level: joi.string().required(),
    file: joi.boolean().optional(),
    logDir: joi.string().optional(),
    appLabel: joi.boolean().optional(),
    colorize: joi.boolean().optional(),
    hybrid_log: joi.boolean().required(),
    slack: joi.object({
        webhook_url: joi.string().required(),
        channel: joi.string().required(),
        context: joi.string().required()
    }).optional()
});

module.exports = {Schema}