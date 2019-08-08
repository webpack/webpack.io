---
title: Logger Interface
sort: 6
contributors:
  - EugeneHlushko
---

T> Available since webpack 4.39.0

Logging output is an additional way to display messages to the end users.

webpack logger is available to [loaders](/loaders/) and [plugins](/api/plugins/#logging). Emitting as part of the [Stats](/api/stats/) and configured by the user in [webpack configuration](/configuration/).

Benefits of custom logging API in webpack:

- Common place to [configure the logging](/configuration/stats/#stats) display level
- Logging output exportable as part of the `stats.json`
- Stats presets affect logging output
- Plugins can affect logging capturing and display level
- When using multiple plugins and loaders they use a common logging solution
- CLI, UI tools for webpack may choose different ways to display logging
- webpack core can emit logging output, e.g. timing data

By introducing webpack logging API we hope to unify the way webpack plugins and loaders emit logging messages and allow better ways to inspect build problems. Integrated logging solution supports plugins and loaders developers by improving their development experience. Paves the way for non-CLI webpack solutions like dashboards or other UIs.

W> __Avoid noise in the log!__ Keep in mind that multiple plugins and loaders are used together. Loaders are usually processing multiple files and are invoked for every file. Choose logging level as low as possible to keep the log output informative.

## Logger methods

- `logger.error(...)`: for error messages
- `logger.warn(...)`: for warnings
- `logger.info(...)`: for __important__ information messages. These messages are displayed by default. Only use this for messages that the user really needs to see
- `logger.log(...)`: for __unimportant__ information messages. These messages are displayed only when user had opted-in to see them
- `logger.debug(...)`: for debugging information. These messages are displayed only when user had opted-in to see debug logging for specific modules
- `logger.trace()`:  to display a stack trace. Displayed like `logger.debug`
- `logger.group(...)`: to group messages together. Displayed collapsed like `logger.log`
- `logger.groupEnd()`: to end a logging group
- `logger.groupCollapsed(...)`:  to group messages together. Displayed collapsed like `logger.log`. Displayed expanded when logging level is set to `'verbose'` or `'debug'`.
- `logger.clear()`: to print a horizontal line. Displayed like `logger.log`
- `logger.profile(...)`, `logger.profileEnd(...)`: to capture a profile. Delegated to `console.profile` when supported