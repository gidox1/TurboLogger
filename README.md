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
            "console": true,
            "slack": {
                webhook_url: `https://hooks.slack.com/services/${process.env.SECRET}`,
                channel: 'passionapi',
                context: 'info'
            }
        }
    const turboLogger = require('turbo-logger').createStream(config);
    
    turboLogger.log('hello world'); // returns the said message to whatever medium specified in the config with a context of ```info``` (returns a green color).
    turboLogger.warn('hello world');// returns the said message to whatever medium specified in the config with a context of ```warn``` (returns a yellow color).
    turboLogger.error('hello world'); // returns the said message to whatever medium specified in the config with a context of ```error``` (returns a red color).

    By default, info is our level.
    
    ```

  - Single Logger
    - To log to Slack only, set ```file: false``` and ```console: false``` This sends the messgage to the provided slack channel in the config alone. Within the slack object in the config, ```webhook_url```, ```channel``` and ```context``` are required. To use this Slack log, you need to create a slack app and also create an incoming webhook_url through which request will be forwarded to Slack. For more details check out [this brilliant guide](https://api.slack.com/apps). The logger is set up the same way.

    ```node
        const config = {
                "level": "info",
                "file": false,
                "console": false
                "slack": {
                    webhook_url: `https://hooks.slack.com/services/${process.env.SECRET}`,
                    channel: 'passionapi',
                    context: 'info'
                }
            }
        const turboLogger = require('turbo-logger').createStream(config);
        turboLogger.log('hello world'); //returns the said message to Slack and also the console.
     ```
        
     - To log to file, simply set ```file: true``` and remove the ```slack``` object, leaving just the ```level``` and the ```file``` properties. Same goes with the Console logger. Single logging can be achieved by setting to ```false``` other log streams, leavaing just the one you're interested in.
    

  - Hybrid Logger
    - The hybrid Logger comprises of all three levels; console, file and slack. 

      ```node
      const config = {
                "level": "info",
                "file": true,
                "console": true,
                "slack": {
                    webhook_url: `https://hooks.slack.com/services/${process.env.SECRET}`,
                    channel: 'passionapi',
                    context: 'info'
                }
            }
      
      const turboLogger = require('turbo-logger').createStream(config);
      turboLogger.warn('Warning message'); //This logs the message to file, console and slack.
      ```

      
  - License
      - MIT
