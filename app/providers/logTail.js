const { Logtail } = require("@logtail/node");

const uploadLog = async (message, context, level) => {
  try {
    if (!process.env.LOGTAIL_SOURCE_TOKEN || !process.env.LOGTAIL_ENDPOINT) {
      throw new Error("LOGTAIL_SOURCE_TOKEN and LOGTAIL_ENDPOINT environment variables must be set");
    }

    const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN, {
      endpoint: process.env.LOGTAIL_ENDPOINT,
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
    console.error('Failed to upload log to Logtail:', error.message);
    return null;
  }
}

module.exports = {
  uploadLog
}