const chai = require('chai')
const expect = chai.expect
const loggerSetup = require('../app/loggerSetUp')
const schema = require('../app/validator')
const joi = require('joi');
const helpers = require('./helpers/helpers');

describe('Default Logger', function(done) {

    const payload = helpers.getDefaultScopePayload();

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

    const payload = helpers.getSlackScopePayload();

    it('Should Validate the payload', function() {
        const result = joi.validate(payload, schema.slackSchema);
        expect(result.value).to.include.all.keys('scope', 'webhook_url', 'channel');
    })
})