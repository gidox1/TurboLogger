const chai = require('chai');
const  loggerConfig = require('../app/loggerSetUp.js');
const schema = require('../app/validator.js');
const helpers = require('./helpers/helpers.js');
const Logger = require('../app/logger.js');
const config = require('../app/config.js');
const expect = chai.expect

describe('Default Logger', function(done) {
    const payload = helpers.getConfigForConsole();
    it('Should validate the payload and log to console and file', function() {
        const result = schema.validate(payload, schema.Schema);
        expect(result.value).to.include.all.keys('level');
        expect(new loggerConfig()).to.be.an.instanceof(loggerConfig);
        const loggerSetup = Logger.createStream(payload);
        const logBody = loggerSetup.log("Hello world")
        expect(logBody).to.contain.property('levels');
    })

    it('should allow logger to be instantiated without config', () => {
        const logger =  Logger.createStream();
        expect(Logger.createStream()).not.to.throw;
        expect(logger.env).to.eq(config.defaultEnv);
        expect(logger.appConfig).not.to.be.null;
    })
})

describe('Slack Logger', function() {

    const payload = helpers.getConfigForSlack();

    it('Should Validate the payload', function() {
        const result = schema.validate(payload, schema.Schema);
        expect(result.value.slack).to.include.all.keys('webhook_url', 'channel');
    })

    it('Should post to Slack', function() {
        const loggerSetup = Logger.createStream(payload);
        const logBody = loggerSetup.log("Hello world")
        expect(logBody.level).to.eq('info');
    })
})