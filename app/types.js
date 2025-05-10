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
 * @typedef {Object} ProvidersConfig
 * @property {LogtailConfig} [logtail] - Optional Logtail configuration
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
     * @type {ProvidersConfig}
     */
    ProvidersConfig: {}
}; 