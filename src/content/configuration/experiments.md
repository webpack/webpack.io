---
title: Experiments
sort: 19
contributors:
  - EugeneHlushko
  - wizardofhogwarts
  - chenxsan
  - anshumanv
---

## `experiments`

`boolean: false`

`experiments` option was introduced in webpack 5 to empower users with the ability to activate and try out experimental features.

W> Because experimental features have relaxed semantic versioning and might contain breaking changes, make sure to fix webpack's version to minor e.g. `webpack: ~5.4.3` instead of `webpack: ^5.4.3` or use a lockfile when using `experiments`.

Available options:

- `syncWebAssembly`: Support the old WebAssembly like in webpack 4
- `asyncWebAssembly`: Support the new WebAssembly according to the [updated specification](https://github.com/WebAssembly/esm-integration), it makes a WebAssembly module an async module
- `topLevelAwait`: Support the [Top Level Await Stage 3 proposal](https://github.com/tc39/proposal-top-level-await), it makes the module an async module when `await` is used on the top-level
- `outputModule`: enables the use of [`output.module`](/configuration/output/#outputmodule) configuration option and sets it to `true`. Enables the use of `output.libraryTarget` as `'module'` and sets it to `'module'`.
- `layers`: Enable module and chunk layers.

__webpack.config.js__

```javascript
module.exports = {
  //...
  experiments: {
    outputModule: true,
    syncWebAssembly: true,
    topLevelAwait: true,
    asyncWebAssembly: true,
    layers: true,
  },
};
```
