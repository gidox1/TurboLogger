'use strict';

/**
 * @typedef {Object} SlackConfig
 * @property {string} webhook_url - The Slack webhook URL
 * @property {string} channel - The Slack channel to post to
 */

/**
 * @typedef {Object} LogtailConfig
 * @property {string} sourceToken - The Logtail source token
 * @property {string} endpoint - The Logtail endpoint URL
 */

/**
 * @typedef {Object} DatadogConfig
 * @property {string} apiKey - The Datadog API key
 * @property {string} endpoint - The Datadog endpoint URL
 * @property {string} service - The service name
 * @property {string} [source] - The source identifier for logs
 * @property {string} [hostname] - The hostname
 * @property {string} [tags] - Tags for log categorization
 * @property {string} env - The environment (e.g., production, staging)
 */

/**
 * @typedef {Object} ProvidersConfig
 * @property {LogtailConfig} [logtail] - Optional Logtail configuration
 * @property {DatadogConfig} [datadog] - Optional Datadog configuration
 */

/**
 * @typedef {Object} AppConfig
 * @property {SlackConfig} [slack] - Optional Slack configuration
 * @property {boolean} enableTimestamp - Whether to enable timestamps in logs
 * @property {ProvidersConfig} [providers] - Optional providers configuration
 */

module.exports = {
    /**
     * @type {AppConfig}
     */
    AppConfig: {},
    /**
     * @type {SlackConfig}
     */
    SlackConfig: {},
    /**
     * @type {LogtailConfig}
     */
    LogtailConfig: {},
    /**
     * @type {DatadogConfig}
     */
    DatadogConfig: {},
    /**
     * @type {ProvidersConfig}
     */
    ProvidersConfig: {}
}; 