
const { client, v2 } = require('@datadog/datadog-api-client');
const types = require('../types');
const { toDatadogStatus } = require('./providers.constant');

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
        apiKeyAuth: config.apiKey,
      },
      baseServer: new client.ServerConfiguration(
        config.endpoint || "https://http-intake.logs.datadoghq.eu",
        {}
      ),
    });

    const logsApi = new v2.LogsApi(configuration);

    // HTTPLogItem only serializes: message, ddsource, ddtags, hostname, service,
    // additionalProperties. Root-level status/level/context are dropped by the SDK.
    const ctx =
      context && typeof context === "object" ? { ...context } : {};
    delete ctx.message;

    const logEntry = {
      message,
      ddsource: config.source || "nodejs",
      service: config.service,
      hostname: config.hostname || require("os").hostname(),
      ddtags:
        config.tags ||
        `service:${config.service},env:${config.env},level:${level}`,
      additionalProperties: {
        ...ctx,
        level,
        env: config.env,
        timestamp: new Date().toISOString(),
        status: toDatadogStatus(level),
      },
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