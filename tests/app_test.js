const chai = require('chai');
const loggerConfig = require('../app/loggerSetUp.js');
const schema = require('../app/validator.js');
const helpers = require('./helpers/helpers.js');
const Logger = require('../app/logger.js');
const config = require('../app/config.js');
const expect = chai.expect;

describe('Default Logger', function() {
    const payload = helpers.getConfigForConsole();

    it('Should validate the payload and log to console and file', function() {
        const result = schema.validate(payload, schema.Schema);
        expect(result.value).to.include.all.keys('level');
        expect(new loggerConfig()).to.be.an.instanceof(loggerConfig);
        const loggerSetup = Logger.createStream({
            ...payload,
            enableTimestamp: false,
        });
        const logBody = loggerSetup.log("Hello world");
        expect(logBody).to.contain.property('levels');
    });

    it('Should handle error logging', function() {
        const loggerSetup = Logger.createStream({
            ...payload,
            enableTimestamp: false,
        });
        const error = new Error('Test error');
        const logBody = loggerSetup.error(error);
        expect(logBody).to.contain.property('levels');
    });

    it('Should handle warning logging', function() {
        const loggerSetup = Logger.createStream({
            ...payload,
            enableTimestamp: false,
        });
        const logBody = loggerSetup.warn('Test warning');
        expect(logBody).to.contain.property('levels');
    });

    it('Should handle logging with metadata', function() {
        const loggerSetup = Logger.createStream({
            ...payload,
            enableTimestamp: false,
        });
        const metadata = { test: true, timestamp: new Date().toISOString() };
        const logBody = loggerSetup.log('Test with metadata', metadata);
        expect(logBody).to.contain.property('levels');
    });

    it('should allow logger to be instantiated without config', () => {
        const logger = Logger.createStream();
        expect(Logger.createStream()).not.to.throw;
        expect(logger.env).to.eq(config.defaultEnv);
        expect(logger.appConfig).not.to.be.null;
    });

    it('Should handle multiple arguments in log message', function() {
        const loggerSetup = Logger.createStream({
            ...payload,
            enableTimestamp: false,
        });
        const logBody = loggerSetup.log('Test', 'multiple', 'arguments');
        expect(logBody).to.contain.property('levels');
    });
});

describe('Slack Logger', function() {
    const payload = helpers.getConfigForSlack();
    
    it('Should Validate the payload', function() {
        const result = schema.validate(payload, schema.Schema);
        expect(result.value.slack).to.include.all.keys('webhook_url', 'channel');
    });

    it('Should post to Slack', function() {
        const loggerSetup = Logger.createStream(payload);
        const logBody = loggerSetup.log("Hello world");
        expect(logBody.level).to.eq('info');
    });
});

describe('Logtail Integration', function() {
    const logtailConfig = {
        providers: {
            logtail: {
                sourceToken: process.env.LOGTAIL_SOURCE_TOKEN || 'test-token',
                endpoint: process.env.LOGTAIL_ENDPOINT || 'https://test-endpoint.com'
            }
        }
    };

    it('Should validate Logtail configuration', function() {
        const result = schema.validate(logtailConfig, schema.Schema);
        expect(result.error).to.be.undefined;
        expect(result.value.providers.logtail).to.have.property('sourceToken');
        expect(result.value.providers.logtail).to.have.property('endpoint');
    });

    it('Should create logger with Logtail transport', function() {
        const loggerSetup = Logger.createStream(logtailConfig);
        expect(loggerSetup).to.have.property('log');
        expect(loggerSetup).to.have.property('error');
        expect(loggerSetup).to.have.property('warn');
    });

    it('Should handle Logtail logging with metadata', async function() {
        const loggerSetup = Logger.createStream(logtailConfig);
        const metadata = { test: true, timestamp: new Date().toISOString() };
        const logBody = await loggerSetup.log('Test Logtail with metadata', metadata);
        expect(logBody).to.contain.property('levels');
    });

    it('Should handle Logtail error logging', async function() {
        const loggerSetup = Logger.createStream(logtailConfig);
        const error = new Error('Test Logtail error');
        const logBody = await loggerSetup.error(error);
        expect(logBody).to.contain.property('levels');
    });

    it('Should handle Logtail with invalid token gracefully', async function() {
        const invalidConfig = {
            ...logtailConfig,
            providers: {
                logtail: {
                    sourceToken: 'invalid-token',
                    endpoint: logtailConfig.providers.logtail.endpoint
                }
            }
        };
        const loggerSetup = Logger.createStream(invalidConfig);
        const logBody = await loggerSetup.log('Should not fail');
        expect(logBody).to.contain.property('levels');
    });

    it('Should handle Logtail with missing endpoint gracefully', async function() {
        const invalidConfig = {
            ...logtailConfig,
            providers: {
                logtail: {
                    sourceToken: logtailConfig.providers.logtail.sourceToken
                }
            }
        };
        const loggerSetup = Logger.createStream(invalidConfig);
        const logBody = await loggerSetup.log('Should not fail');
        expect(logBody).to.contain.property('levels');
    });
});

describe('Logger Configuration', function() {
    it('Should handle missing configuration gracefully', function() {
        const loggerSetup = Logger.createStream();
        expect(loggerSetup).to.have.property('log');
    });

    it('Should handle invalid configuration', function() {
        const invalidConfig = { invalid: true };
        const result = schema.validate(invalidConfig, schema.Schema);
        expect(result.error).to.not.be.undefined;
    });

    it('Should handle multiple transports', function() {
        const multiConfig = {
            console: true,
            file: true,
            providers: {
                logtail: {
                    sourceToken: 'test-token',
                    endpoint: 'https://test-endpoint.com'
                }
            }
        };
        const loggerSetup = Logger.createStream(multiConfig);
        const logBody = loggerSetup.log('Test multiple transports');
        expect(logBody).to.contain.property('levels');
    });

    it('Should handle empty message', function() {
        const loggerSetup = Logger.createStream();
        const logBody = loggerSetup.log();
        expect(logBody).to.contain.property('levels');
    });
});