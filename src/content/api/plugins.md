---
title: Plugin API
group: Plugins
sort: 12
contributors:
  - thelarkinn
  - pksjce
  - e-cloud
  - byzyk
  - EugeneHlushko
  - wizardofhogwarts
  - fokusferit
---

Plugins are a key piece of the webpack ecosystem and provide the community with
a powerful way to tap into webpack's compilation process. A plugin is able to
[hook](/api/compiler-hooks/#hooks) into key events that are fired throughout each compilation. Every step
of the way, the plugin will have full access to the `compiler` and, when
applicable, the current `compilation`.

T> For a high-level introduction to writing plugins, start with
[writing a plugin](/contribute/writing-a-plugin).

Let's start by going over `tapable` utility, which provides the backbone of
webpack's plugin interface.


## Tapable

This small library is a core utility in webpack but can also be used elsewhere
to provide a similar plugin interface. Many objects in webpack extend the
`Tapable` class. The class exposes `tap`, `tapAsync`, and `tapPromise` methods
which plugins can use to inject custom build steps that will be fired
throughout a compilation.

Please see the [documentation](https://github.com/webpack/tapable) to learn
more. An understanding of the three `tap` methods, as well as the hooks that
provide them is crucial. The objects that extend `Tapable` (e.g. the compiler),
the hooks they provide, and each hook's type (e.g. the `SyncHook`) will be
noted.


## Plugin Types

Depending on the hooks used and `tap` methods applied, plugins can function in
a different number of ways. The way this works is closely related to the
[hooks](https://github.com/webpack/tapable#tapable) provided by `Tapable`. The
[compiler hooks](/api/compiler-hooks/#hooks) each note the underlying `Tapable` hook indicating which
`tap` methods are available.

So depending on which event you `tap` into, the plugin may run differently. For
example, when hooking into the `compile` stage, only the synchronous `tap` method
can be used:

``` js
compiler.hooks.compile.tap('MyPlugin', params => {
  console.log('Synchronously tapping the compile hook.');
});
```

However, for `run` which utilizes the `AsyncHook`, we can utilize `tapAsync`
or `tapPromise` (as well as `tap`):

``` js
compiler.hooks.run.tapAsync('MyPlugin', (source, target, routesList, callback) => {
  console.log('Asynchronously tapping the run hook.');
  callback();
});

compiler.hooks.run.tapPromise('MyPlugin', (source, target, routesList) => {
  return new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
    console.log('Asynchronously tapping the run hook with a delay.');
  });
});

compiler.hooks.run.tapPromise('MyPlugin', async (source, target, routesList) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('Asynchronously tapping the run hook with a delay.');
});
```

The moral of the story is that there are a variety of ways to `hook` into the
`compiler`, each one allowing your plugin to run as it sees fit.


## Custom Hooks

In order to add a new hook to the compilation for other plugins to `tap` into,
you can `require` the necessary hook class from `tapable` and create one:

``` js
const SyncHook = require('tapable').SyncHook;

// Within the `apply` method...
if (compiler.hooks.myCustomHook) throw new Error('Already in use');
compiler.hooks.myCustomHook = new SyncHook(['a', 'b', 'c']);

// Wherever/whenever you'd like to trigger the hook...
compiler.hooks.myCustomHook.call(a, b, c);
```

Again, see the [documentation](https://github.com/webpack/tapable) for `tapable` to learn more about the
different hook classes and how they work.

## Reporting Progress

Plugins can report progress via [`ProgressPlugin`](/plugins/progress-plugin/), which prints progress messages to stderr by default. In order to enable progress reporting, pass a `--progress` argument when running the [webpack CLI](/api/cli/).

It is possible to customize the printed output by passing different arguments to the `reportProgress` function of [`ProgressPlugin`](/plugins/progress-plugin/).

To report progress, a plugin must `tap` into a hook using the `context: true` option:

```js
compiler.hooks.emit.tapAsync({
  name: 'MyPlugin',
  context: true
}, (context, compiler, callback) => {
  const reportProgress = context && context.reportProgress;
  if (reportProgress) reportProgress(0.95, 'Starting work');
  setTimeout(() => {
    if (reportProgress) reportProgress(0.95, 'Done work');
    callback();
  }, 1000);
});
```

The `reportProgress` function may be called with these arguments:

```js
reportProgress(percentage, ...args);
```

- `percentage`: This argument is unused; instead, [`ProgressPlugin`](/plugins/progress-plugin/) will calculate a percentage based on the current hook.
- `...args`: Any number of strings, which will be passed to the `ProgressPlugin` handler to be reported to the user.

Note that only a subset of compiler and compilation hooks support the `reportProgress` function. See [`ProgressPlugin`](/plugins/progress-plugin/#supported-hooks) for a full list.

## Logging

Logging API is available since the release of webpack 4.37. When `logging` is enabled in [`stats configuration`](/configuration/stats/#statslogging) and/or when [`infrastructure logging`](/configuration/other-options/#infrastructurelogging) is enabled, plugins may log messages which will be printed out in the respective logger format (stats, infrastructure).

- Plugins should prefer to use `compilation.getLogger('PluginName')` for logging. This kind of logging is stored to the Stats and formatted accordingly. It can be filtered and exported by the user.
- Plugins may use the `compiler.getInfrastructureLogger('PluginName')` for logging. Using `infrastructure` logging is not stored in the Stats and therefore not formatted. It's usually logged to the console/dashboard/GUI directly. It can be filtered by the user.
- Plugins may use specific fallback logic for detecting logging support `compilation.getLogger ? compilation.getLogger('PluginName') : console` to provide a fallback for cases when an older webpack version is used which does not support `getLogger` method on `compilation` object.

## Next Steps

See the [compiler hooks](/api/compiler-hooks/) section for a detailed listing of all the available
`compiler` hooks and the parameters they make available.
