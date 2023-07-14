# TurboLogger
TurboLogger is a versatile logging library for Node.js applications that supports logging to the console, file, and Slack channel. It provides configurable logging levels (error, info, warn), single and hybrid logging capabilities, and customizable logging contexts.

## Installation
Install TurboLogger using npm:
```bash
    npm i --save turbo-logger
```
    
## FEATURE
  
  - Logging to Slack Channel
  - Console Logging
  - Logging to file
  - Support for different logging levels (error, info, warn)
  - Single and Hybrid Logger (Ability to log to one or multiple sources)
  - Configurable through environment variables (e.g., setting the context to production, development, or custom context)
  - Ability to log comma-separated messages
  
## Usage

  ```node
    const config = {
        "slack": {
            webhook_url: `https://hooks.slack.com/services/${process.env.SECRET}`,
            channel: 'sample-channel',
        }
    }
    
    const env = {
        prod: ['console', 'slack'],
        dev: ['file', 'console'],
        myCustomConfig: ['console']
    }
    
    const logger = require('turbo-logger').createStream(config, env.prod);
  ```
  Once the logger is initialized, you can use it to log messages:

  ```node
    logger.log('hello world'); // logs the message to the console and Slack with an "info" context
    logger.warn('hello world'); // logs the message to the console with a "warn" context
    logger.error('hello world'); // logs the message to a file and the console with an "error" context
  ```

  You need to initialize the logger with the slack config if you plan on logging to Slack. If not, you need to pass an empty object 

  ```node
  const logger = require('turbo-logger').createStream({}); // env will default to logging to console.

  ```


  ### **Single Logger**
  To log only to Slack, set the environment parameter to "slack" and provide the required Slack configuration. Please note that in order to use this feature, you need to create a Slack app and obtain the necessary credentials.

Here's how to set up the Single Logger for Slack:

1. Create a Slack app following the instructions in the [ Slack App Creation Guide.](https://api.slack.com/apps).
2. Obtain the webhook_url and channel for your Slack app. The webhook_url is a unique URL that allows your application to send messages to a specific Slack channel. This is gotten from the "incoming webhook" settings for the slack app you created. Enable it and set the channel you want the message to be sent to. Slack creates a separate webhook url for eah channel.
	[![](Webhook Screen)](https://user-images.githubusercontent.com/16461858/253567093-662966e2-04f8-4a17-b307-c9423a417200.png)

3. Configure the config object with the webhook_url and channel values:

    ```node
        const config = {
            "slack": {
                webhook_url: `https://hooks.slack.com/services/${process.env.SECRET}`,
                channel: 'sample-channel',
            }
        }

        const env = ['slack']
        const logger = require('turbo-logger').createStream(config, env);
        logger.log('hello world'); // sends the message to the specified Slack channel
     ```
            
    Ensure that you replace ${process.env.SECRET} in the webhook_url with the actual secret value obtained from your Slack app.

    **Note**: If the config object does not have the required webhook_url and channel parameters, TurboLogger will throw an error.

###**Hybrid Logger**
The hybrid logger combines multiple log levels. It could be a combination of all three or any two levels. To use this, we set the environment configuration to include all three or any two log levels:

```node
	const env = ['console', 'slack', 'file']
	const logger = require('turbo-logger').createStream(config, env);
	logger.log('hello world'); // sends the message to all contexts (console, Slack, and file)
```

###**Logging multiple messages**
TurboLogger allows you to log comma-separated messages. For example:
```node
	turboLogger.log('My config object: ', config);
```

The console prints: <img width="982" alt="Screenshot 2019-12-13 at 10 14 42 AM" src="https://user-images.githubusercontent.com/16461858/70788550-6af31380-1d91-11ea-8958-caadcefa20dc.png">

You can log as many comma-separated messages as you want.

###**Logging To Multiple Slack Channel**
You can log to several Slack channels. The logger streams are configured separately as every channel
```node
	const logger = require('turbo-logger');
	const env = ['slack'];

	// Error channel set up
	const errorChannelName = "error-logs";
	const errorChannelConfig = {
		"slack": {
			webhook_url: `https://hooks.slack.com/services/${process.env.SLACK_ERROR_CHANNEL_WEBHOOK_URL}`,
			channel: errorChannelName,
		}
	};
	
	// Success channel set up
	const successChannelName = "success-logs";
		const errorChannelConfig = {
		"slack": {
			webhook_url: `https://hooks.slack.com/services/${process.env.SLACK_SUCCESS_CHANNEL_WEBHOOK_URL}`,
			channel: successChannelName,
		}
	};
	
	// Instantiate logger
	const slackErrorLogger = logger.createStream(errorChannelConfig, env)
	const slackSuccessLogger = logger.createStream(errorChannelConfig, env)

	// Usage
	slackErrorLogger.error("Internal server error") // This sends a message with an error context to the channel named "error-logs"
	slackSuccessLogger.log("Request successful") // This sends a message with an info context to the channel named "success-logs"
```

###**License**
TurboLogger is licensed under the MIT License.

      
 ###**Author**
 TurboLogger was created by [Gideon Odiase](https://api.slack.com/apps)..



