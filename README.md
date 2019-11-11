# TurboLogger
Console and file logger for Node.js Applications

## CONTENTS
  - Installation
    - ```npm i --save turbo-logger```
    
## FEATURE
  
  - Logging to Slack Channel
  - Console Logging
  - Logging to file
  - Ability to log to different levels (error, info, warn)
  - Single and Hybrid Logger (Ability to log to one or multiple sources).
  - Configurable through env. (You can set the context, whether production, dev or create a custom context of your choice)
  
## Usage
    ```node
    const config = {
            "slack": {
                webhook_url: `https://hooks.slack.com/services/${process.env.SECRET}`,
                channel: 'passionapi',
            }
        }
    const env = {
      prod: ['console', 'slack'],
      dev: ['file', 'console'],
      myCustomConfig: ['console']
    }
    
    const turboLogger = require('turbo-logger').createStream(config);
    
    turboLogger.log('hello world', env.prod); // returns the said message to console and slack with a context of ```info``` (returns a green color).
    turboLogger.warn('hello world', env.myCustomConfig);// returns the said message to just the console config with a context of ```warn``` (returns a yellow color).
    turboLogger.error('hello world', env.dev); // returns the said message to file and console with a context of ```error``` (returns a red color).
    
    ```


  - Single Logger
    - To log to Slack only, add an env parameter, whether prod, dev or create a custom with ```slack``` as the only value specified in the arrray. This sends the messgage to the provided slack channel in the config alone, if the config object doesn't have the required slack parameters, it will throw an error. Within the slack object in the config, ```webhook_url```, and ```channel``` are required. To use this Slack log, you need to create a slack app and also create an incoming webhook_url through which request will be forwarded to Slack. For more details check out [this brilliant guide](https://api.slack.com/apps). The logger is set up the same way.

    ```node
        const config = {
                "slack": {
                    webhook_url: `https://hooks.slack.com/services/${process.env.SECRET}`,
                    channel: 'passionapi',
                }
            };
        const env = {
            prod: ['console', 'slack'],
            dev: ['file', 'console'],
            myCustomConfig: ['slack']
        };
        const turboLogger = require('turbo-logger').createStream(config);
        turboLogger.log('hello world', env.myCustomConfig); //sends the said message to the Slack channel
        
     ```
        
     - To log to file alone or console alone, we do the same thing we did with slack. Single logging can be achieved by setting only the level required in the env config.
     

  - Hybrid Logger
    - The hybrid Logger comprises of all three levels; console, file and slack. To do this, we simply use a config that has all three levels specified. In this case, prod.

    ```node
        const config = {
                "slack": {
                    webhook_url: `https://hooks.slack.com/services/${process.env.SECRET}`,
                    channel: 'passionapi',
                }
            };
        const env = {
            prod: ['console', 'slack', 'file'],
            dev: ['file', 'console'],
            myCustomConfig: ['slack']
        };
        const turboLogger = require('turbo-logger').createStream(config);
        turboLogger.log('hello world', env.prod); //sends the said message to all contexts (console, slack and file).
        
     ```
      
  - License
      - MIT
      
  - Author
      - Gideon Odiase
