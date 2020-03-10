---
title: Compiler Hooks
group: Plugins
sort: 9
contributors:
  - rishantagarwal
  - byzyk
  - madhavarshney
  - misterdev
  - EugeneHlushko
  - superburrito
  - anikethsaha
---

The `Compiler` module is the main engine that creates a compilation instance
with all the options passed through the [CLI](/api/cli) or [Node API](/api/node). It extends the
`Tapable` class in order to register and call plugins. Most user facing plugins
are first registered on the `Compiler`.

T> This module is exposed as `webpack.Compiler` and can be used directly. See
[this example](https://github.com/pksjce/webpack-internal-examples/tree/master/compiler-example)
for more information.

When developing a plugin for webpack, you might want to know where each hook is called. To learn this, search for `hooks.<hook name>.call` across the webpack source

W> Since webpack 5, `hooks` are no longer extendable. Use a `WeakMap` to add custom hooks.

## Watching

The `Compiler` supports [watching](/api/node/#watching) which monitors the file
system and recompiles as files change. When in watch mode, the compiler will
emit the additional events such as `watchRun`, `watchClose`, and `invalid`.
This is typically used in [development](/guides/development), usually under
the hood of tools like `webpack-dev-server`, so that the developer doesn't
need to re-compile manually every time. Watch mode can also be entered via the
[CLI](/api/cli/#watch-options).

## Hooks

The following lifecycle hooks are exposed by the `compiler` and can be accessed
as such:

```js
compiler.hooks.someHook.tap('MyPlugin', params => {
  /* ... */
});
```

Depending on the hook type, `tapAsync` and `tapPromise` may also be available.

For the description of hook types, see [the Tapable docs](https://github.com/webpack/tapable#tapable).

### `entryOption`

`SyncBailHook`

Called after the [`entry` configuration](/configuration/entry-context/#entry) from webpack options has been processed.

- Callback Parameters: [`context`](/configuration/entry-context/#context), [`entry`](/configuration/entry-context/#entry)

```js
compiler.hooks.entryOption.tap('MyPlugin', (context, entry) => {
  /* ... */
});
```

Parameters: `context`, `entry`

### `afterPlugins`

`SyncHook`

Called after setting up initial set of internal plugins.

- Callback Parameters: `compiler`

### `afterResolvers`

`SyncHook`

Triggered after resolver setup is complete.

- Callback Parameters: `compiler`

### `environment`

`SyncHook`

Called while preparing the compiler environment, right after inizializing the plugins in the configuration file.

### `afterEnvironment`

`SyncHook`

Called right after the `environment` hook, when the compiler environment setup is complete.

### `beforeRun`

`AsyncSeriesHook`

Adds a hook right before running the compiler.

- Callback Parameters: `compiler`

### `run`

`AsyncSeriesHook`

Hook into the compiler before it begins reading [`records`](/configuration/other-options/#recordspath).

- Callback Parameters: `compiler`

### `watchRun`

`AsyncSeriesHook`

Executes a plugin during watch mode after a new compilation is triggered but before the compilation is actually started.

- Callback Parameters: `compiler`

### `normalModuleFactory`

`SyncHook`

Called after a `NormalModuleFactory` is created.

- Callback Parameters: `normalModuleFactory`

### `contextModuleFactory`

`SyncHook`

Runs a plugin after a `ContextModuleFactory` is created.

- Callback Parameters: `contextModuleFactory`

### `beforeCompile`

`AsyncSeriesHook`

Executes a plugin after compilation parameters are created.

- Callback Parameters: `compilationParams`

The `compilationParams` variable is initialized as follows:

```js
compilationParams = {
  normalModuleFactory,
  contextModuleFactory
};
```

This hook can be used to add/modify the compilation parameters:

```js
compiler.hooks.beforeCompile.tapAsync('MyPlugin', (params, callback) => {
  params['MyPlugin - data'] = 'important stuff my plugin will use later';
  callback();
});
```

### `compile`

`SyncHook`

Called right after `beforeCompile`, before a new compilation is created.

- Callback Parameters: `compilationParams`

### `thisCompilation`

`SyncHook`

Executed while initializing the compilation, right before emitting the `compilation` event.

- Callback Parameters: `compilation`, `compilationParams`

### `compilation`

`SyncHook`

Runs a plugin after a compilation has been created.

- Callback Parameters: `compilation`, `compilationParams`

### `make`

`AsyncParallelHook`

Executed before finishing the compilation.

- Callback Parameters: `compilation`

### `afterCompile`

`AsyncSeriesHook`

Called after finishing and sealing the compilation.

- Callback Parameters: `compilation`

### `shouldEmit`

`SyncBailHook`

Called before emitting assets. Should return a boolean telling whether to emit.

- Callback Parameters: `compilation`

```js
compiler.hooks.shouldEmit.tap('MyPlugin', compilation => {
  // return true to emit the output, otherwise false
  return true;
});
```

### `emit`

`AsyncSeriesHook`

Executed right before emitting assets to output dir.

- Callback Parameters: `compilation`

### `afterEmit`

`AsyncSeriesHook`

Called after emitting assets to output directory.

- Callback Parameters: `compilation`

### `assetEmitted`

`AsyncSeriesHook`

Executed when an asset has been emitted. Provides access to information about the emitted asset, such as its output path and byte content.

- Callback Parameters: `file`, `info`

For example, you may access the asset's content buffer via `info.content`:

```js
compiler.hooks.assetEmitted.tap(
  'MyPlugin',
  (file, { content, source, outputPath, compilation, targetPath }) => {
    console.log(content); // <Buffer 66 6f 6f 62 61 72>
  }
);
```

### `done`

`AsyncSeriesHook`

Executed when the compilation has completed.

- Callback Parameters: `stats`

### `failed`

`SyncHook`

Called if the compilation fails.

- Callback Parameters: `error`

### `invalid`

`SyncHook`

Executed when a watching compilation has been invalidated.

- Callback Parameters: `fileName`, `changeTime`

### `watchClose`

`SyncHook`

Called when a watching compilation has stopped.

### `infrastructureLog`

`SyncBailHook`

Allows to use infrastructure logging when enabled in the configuration via [`infrastructureLogging` option](/configuration/other-options/#infrastructurelogging).

- Callback Parameters: `name`, `type`, `args`

### `log`

`SyncBailHook`

Allows to log into [stats](/configuration/stats/) when enabled, see [`stats.logging`, `stats.loggingDebug` and `stats.loggingTrace` options](/configuration/stats/#stats).

- Callback Parameters: `origin`, `logEntry`
