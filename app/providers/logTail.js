const { Logtail } = require("@logtail/node");

const uploadLog = async (message, context, level, config) => {
  try {
    if (!config.sourceToken || !config.endpoint) {
      throw new Error("LOGTAIL_SOURCE_TOKEN and LOGTAIL_ENDPOINT environment variables must be set");
    }

    const logtail = new Logtail(config.sourceToken, {
      endpoint: config.endpoint,
    });

    let result;
    switch (level) {
      case 'error':
        result = await logtail.error(message, context);
        break;
      case 'warn':
        result = await logtail.warn(message, context);
        break;
      case 'info':
      default:
        result = await logtail.info(message, context);
    }
    return result;
  } catch (error) {
    return null;
  }
}

module.exports = {
  uploadLog
}