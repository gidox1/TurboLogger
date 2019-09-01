const chai = require('chai')
const expect = chai.expect
const loggerSetup = require('../app/loggerSetUp')
const schema = require('../app/validator')
const joi = require('joi');

describe('Default Logger', function(done) {
    const payload = {
        scope: 'default',
        level: 'info',
        file: true,
    }

    it('Should validate the payload', function() {
        const result = joi.validate(payload, schema.Schema);
        expect(result.value).to.include.all.keys('level', 'scope');
    })

    it('should log to console and file', function() {
        const setUp = new loggerSetup()
        const log = setUp.validatePayload(payload)
        const logBody = log.info("Hello world")
        expect(logBody).to.contain.property('levels');
    })
})

describe('Slack Logger', function() {
    const testPayload = {
        scope: 'slack',
        webhook_url : `https://hooks.slack.com/services/${process.env.SECRET}`,
        channel: 'test_channel'
    }

    it('Should Validate the payload', function() {
        const result = joi.validate(testPayload, schema.slackSchema);
        expect(result.value).to.include.all.keys('scope', 'webhook_url', 'channel');
    })
})