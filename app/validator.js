const joi = require('joi');

module.exports = joi.object({
    slack: joi.object({
        webhook_url: joi.string().required(),
        channel: joi.string().required(),
    }).required()
});
