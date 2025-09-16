
const { client, v2 } = require('@datadog/datadog-api-client');
const types = require('../types');

/**
 * @param {String} message 
 * @param {Object} context 
 * @param {String} level 
 * @param {types.DatadogConfig} config 
 * @returns 
 */
const sendLogsToDatadog = async (message, context, level, config) => {
  try {
    if (!config.apiKey) {
      throw new Error("Datadog API key must be provided in configuration");
    }

    const configuration = client.createConfiguration({
      authMethods: {
        apiKey: config.apiKey,
      },
      baseServer: new client.ServerConfiguration(
        config.endpoint || "https://http-intake.logs.datadoghq.eu",
        {}
      ),
    });

    const logsApi = new v2.LogsApi(configuration);

    // Format log according to Datadog API v2 requirements
    const logEntry = {
      message: message,
      ddsource: config.source || "nodejs",
      service: config.service,
      hostname: config.hostname || require('os').hostname(),
      ddtags: config.tags || `service:${config.service},env:${config.env},level:${level}`,
      level: level,
      timestamp: new Date().toISOString(),
      env: config.env,
      context: context
    };

    await logsApi.submitLog({
      body: [logEntry],
    });

    return { success: true };
  } catch (error) {
    return null;
  }
};

module.exports = {
  sendLogsToDatadog
};