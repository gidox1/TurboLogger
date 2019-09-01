# easyLogger
Console and file logger for Node.js Applications

## CONTENTS
  - Installation
    - ```npm i --save turbo-logger```

  - Usage
    ```node
    const config = { scope: 'default', level: 'info', file: true } 
    const logger = require('turbo-logger').createStream(config).log();
    
    logger.info('hello world'); //returns the said message in the console and file as info (color: green)
    logger.error('hello world'); // returns the error to the console and file (color: red)
    logger.warn('hello world'); // Returns the warning message (color: yellow)
    
    ```

  - Console Log
    - The console log and the file log belong to the ```default``` scope and requires three parameters which should be 
      passed as  config to the ```createStream``` method. The config must include the scope and level, file is not required 
      and is set to false by default.
      If ```file``` is set to ```true``` it creates a log folder in the root directory and logs to a file but if set to
      ```false```, it logs to only console. To log to both, set the value of ```file``` to ```true```.

  - Slack log
    - The slack log requires two parameters, just like the default log. The config must include the ```scope```,
     ```webhook_url``` and ```channel```, the second parameter is the context. To use this Slack log, you need 
      to create a slack app and also create an incoming webhook_url through which request will be forwarded to Slack. 
      For more details check out [this brilliant guide](https://api.slack.com/apps).

      ```node
      const config = {
                  scope: 'slack',
                  webhook_url : 'https://hooks.slack.com/services/XXXXXXXXX/XXXXXXX/XXXXXXXXXXXXXXX',
                  channel: 'test_channel'
      }
      const context = 'info' // Sets the logger context //['info', 'verbose', 'silly', 'error', 'warn', 'debug']
      const logger = require('turbo-logger').slackStream(config);
      
      logger.slack("This is a Slack Message", context); //Sends message to slack

      ```
  - License
      - MIT
