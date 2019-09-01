# easyLogger
Console and file logger for Node.js Applications

## TABLE OF CONTENTS
  - Installation
    - ```npm i --save turbo-logger```

  - Usage
    ```node
    const config = { scope: 'default', level: 'info', file: true } 
    const logger = require('turbo-logger').createStream(config).log();
    
    logger.info('hello world'); //returns the said message in the console or file as info (color: green)
    logger.error('hello world'); // returns the error to the console or file (color: red)
    logger.warn('hello world'); // Returns the warning message (color: yellow)
    ```

  - Console Log
    - The console log and the file log belong to the ```default``` scope and requires three parameters which should be 
      passed as  config to the ```createStream``` method. The config must include the scope and level, file is not required 
      and is set to false by default.
      If ```file``` is set to ```true``` it creates a log folder in the root directory and logs to a file but if set to
      ```false```, it logs to only console. To log to both, set the value of ```file``` to ```true```.

  - Slack log
    - The slack log requires some parameters, just like the default log. The parameters must include the ```scope```,
     ```webhook_url``` and ```channel```. To use this Slack log, you need to create a slack app and also create an 
      incoming webhook_url through which request will be forwarded to Slack. For more details check out 
      [this brilliant guide](https://api.slack.com/apps).

      ```node
      const config = {
                  scope: 'slack',
                  webhook_url : 'https://hooks.slack.com/services/XXXXXXXXX/XXXXXXX/XXXXXXXXXXXXXXX',
                  channel: 'test_channel'
      }
      
      const logger = require('turbo-logger').slackStream(config);
      logger.slack("This is a Slack Message"); //Sends message to slack

      ```
