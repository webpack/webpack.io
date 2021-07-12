---
title: Logger Interface
sort: 6
contributors:
  - EugeneHlushko
  - anikethsaha
  - wizardofhogwarts
  - chenxsan
---

T> Available since webpack 4.39.0

Logging output is an additional way to display messages to the end users.

webpack logger is available to [loaders](/loaders/) and [plugins](/api/plugins/#logging). Emitting as part of the [Stats](/api/stats/) and configured by the user in [webpack configuration](/configuration/).

Benefits of custom logging API in webpack:

- Common place to [configure the logging](/configuration/stats/#statslogging) display level
- Logging output exportable as part of the `stats.json`
- Stats presets affect logging output
- Plugins can affect logging capturing and display level
- When using multiple plugins and loaders they use a common logging solution
- CLI, UI tools for webpack may choose different ways to display logging
- webpack core can emit logging output, e.g. timing data

By introducing webpack logging API we hope to unify the way webpack plugins and loaders emit logs and allow better ways to inspect build problems. Integrated logging solution supports plugins and loaders developers by improving their development experience. Paves the way for non-CLI webpack solutions like dashboards or other UIs.

W> **Avoid noise in the log!** Keep in mind that multiple plugins and loaders are used together. Loaders are usually processing multiple files and are invoked for every file. Choose a logging level as low as possible to keep the log output informative.

## Examples of how to get and use webpack logger in loaders and plugins

**my-webpack-plugin.js**

```js
const PLUGIN_NAME = 'my-webpack-plugin';
export class MyWebpackPlugin {
  apply(compiler) {
    // you can access Logger from compiler
    const logger = compiler.getInfrastructureLogger(PLUGIN_NAME);
    logger.log('log from compiler');

    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      // you can also access Logger from compilation
      const logger = compilation.getLogger(PLUGIN_NAME);
      logger.info('log from compilation');
    });
  }
}
```

**my-webpack-loader.js**

```js
module.exports = function (source) {
  // you can get Logger with `this.getLogger` in your webpack loaders
  const logger = this.getLogger('my-webpack-loader');
  logger.info('hello Logger');
  return source;
};
```

__How to get the logger ?__

- If you want to store the logs in the Stats, you should use `compilation.getLogger('PluginName')`

  ```javascript
  // example

  pluginName.prototype.apply = function(compiler){
    // get the compilation object by tapping in a compiler hook
    compiler.hooks.emit.tapAsync('PluginName', (compilation, callback) => {
      const logger = compilation.getLogger('PluginName');
    });
  };

  ```

- If you dont want to store your logs in the Stats, use `infrastructure` logging

  ```javascript
  // example

  pluginName.prototype.apply = function(compiler){
    const logger = compiler.getInfrastructureLogger('PluginName');
  };
  ```

- if you want to get the logger from webpack as a Node.js API, use

  ```javascript
  const { Logger } = require('webpack/lib/logging/Logger');
  ```

## Logger methods

- `logger.error(...)`: for error messages
- `logger.warn(...)`: for warnings
- `logger.info(...)`: for **important** information messages. These messages are displayed by default. Only use this for messages that the user really needs to see
- `logger.log(...)`: for **unimportant** information messages. These messages are displayed only when user had opted-in to see them
- `logger.debug(...)`: for debugging information. These messages are displayed only when user had opted-in to see debug logging for specific modules
- `logger.trace()`: to display a stack trace. Displayed like `logger.debug`
- `logger.group(...)`: to group messages. Displayed collapsed like `logger.log`
- `logger.groupEnd()`: to end a logging group
- `logger.groupCollapsed(...)`: to group messages together. Displayed collapsed like `logger.log`. Displayed expanded when logging level is set to `'verbose'` or `'debug'`.
- `logger.status`: writes a temporary message, setting a new status, overrides the previous one
- `logger.clear()`: to print a horizontal line. Displayed like `logger.log`
- `logger.profile(...)`, `logger.profileEnd(...)`: to capture a profile. Delegated to `console.profile` when supported

## Runtime Logger API

Runtime logger API is only intended to be used as a development tool, it is not intended to be included in [production mode](/configuration/mode/#mode-production).

- `const logging = require('webpack/lib/logging/runtime')`: to use the logger in runtime, require it directly from webpack
- `logging.getLogger('name')`: to get individual logger by name
- `logging.configureDefaultLogger(...)`: to override the default logger.

```javascript
const logging = require('webpack/lib/logging/runtime');
logging.configureDefaultLogger({
  level: 'log',
  debug: /something/,
});
```

- `logging.hooks.log`: to apply Plugins to the runtime logger
