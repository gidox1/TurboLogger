const chai = require('chai')
const expect = chai.expect
const loggerConfig = require('../app/loggerSetUp')
const schema = require('../app/validator').Schema
const helpers = require('./helpers/helpers');

describe('Default Logger', function(done) {

    const payload = helpers.getConfigForConsole();

    it('Should validate the payload and log to console and file', function() {
        const result = schema.validate(payload, schema.Schema);
        expect(result.value).to.include.all.keys('level');
        expect(new loggerConfig()).to.be.an.instanceof(loggerConfig);
        const loggerSetup = require('../app/logger').createStream(payload);
        const logBody = loggerSetup.log("Hello world")
        expect(logBody).to.contain.property('levels');
    })
})

describe('Slack Logger', function() {

    const payload = helpers.getConfigForSlack();

    it('Should Validate the payload', function() {
        const result = schema.validate(payload, schema.Schema);
        expect(result.value.slack).to.include.all.keys('context', 'webhook_url', 'channel');
    })

    it('Should post to Slack', function() {
        const loggerSetup = require('../app/logger').createStream(payload);
        const logBody = loggerSetup.log("Hello world")
        expect(logBody).to.contain.property('body');
    })
})