# TurboLogger
Console and file logger for Node.js Applications

## CONTENTS
  - Installation
    - ```npm i --save turbo-logger```

  - Usage
    ```node
    const config = {
            "level": "info",
            "file": true,
            "slack": {
                webhook_url: `https://hooks.slack.com/services/${process.env.SECRET}`,
                channel: 'passionapi',
                context: 'info'
            }
        }
    const turboLogger = require('turbo-logger').createStream(config);
    
    turboLogger.log('hello world'); //returns the said message to whatever medium specified in the config.
    
    ```

  - Single Logger
    - To log to Slack only, set ```file: false```. This logs to the console (by default) and then sends the messgage to the provided slack channel in the cnfig. Within the slack object in the config, ```webhook_url```, ```channel``` and ```context``` are required. To use this Slack log, you need to create a slack app and also create an incoming webhook_url through which request will be forwarded to Slack. For more details check out [this brilliant guide](https://api.slack.com/apps). The logger is set up the same way.

    ```node
        const config = {
                "level": "info",
                "file": false,
                "slack": {
                    webhook_url: `https://hooks.slack.com/services/${process.env.SECRET}`,
                    channel: 'passionapi',
                    context: 'info'
                }
            }
        const turboLogger = require('turbo-logger').createStream(config);
        turboLogger.log('hello world'); //returns the said message to Slack and also the console.
     ```
        
     - To log to file, simply set ```file: false``` and remove the ```slack``` object, leaving just the ```level``` and the ```file``` properties. This will log only to file and console.
    
  - Hybrid Logger
    - The hybrid Logger comprises of all three levels; console, file and slack. 

      ```node
      const const config = {
                "level": "info",
                "file": true,
                "slack": {
                    webhook_url: `https://hooks.slack.com/services/${process.env.SECRET}`,
                    channel: 'passionapi',
                    context: 'info'
                }
            }
      
      const turboLogger = require('turbo-logger').createStream(config);
      turboLogger.log('hello world'); //This logs the message to file, console and slack.
      ```
  - License
      - MIT
