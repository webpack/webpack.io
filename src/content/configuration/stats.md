---
title: Stats
sort: 18
contributors:
  - SpaceK33z
  - sallar
  - jungomi
  - ldrick
  - jasonblanchard
  - byzyk
  - renjithspace
  - Raiondesu
  - EugeneHlushko
  - grgur
---

The `stats` option lets you precisely control what bundle information gets displayed. This can be a nice middle ground if you don't want to use `quiet` or `noInfo` because you want some bundle information, but not all of it.

T> For webpack-dev-server, this property needs to be in the `devServer` object.

T> For webpack-dev-middleware, this property needs to be in the webpack-dev-middleware's `options` object.

W> This option does not have any effect when using the Node.js API.

## `stats`

`object` `string`

There are some presets available to use as a shortcut. Use them like this:

```js
module.exports = {
  //...
  stats: 'errors-only'
};
```

| Preset              | Alternative | Description                                       |
|---------------------|-------------|---------------------------------------------------|
| `'errors-only'`     | _none_      | Only output when errors happen                    |
| `'errors-warnings'` | _none_      | Only output errors and warnings happen            |
| `'minimal'`         | _none_      | Only output when errors or new compilation happen |
| `'none'`            | `false`     | Output nothing                                    |
| `'normal'`          | `true`      | Standard output                                   |
| `'verbose'`         | _none_      | Output everything                                 |

For more granular control, it is possible to specify exactly what information you want. Please note that all of the options in this object are optional.

### `stats.all`

A fallback value for stats options when an option is not defined. It has precedence over local webpack defaults.

```javascript
module.exports = {
  //...
  stats: {
    all: undefined
  }
};
```

### `stats.assets`

`boolean = true`

Tells `stats` whether to show the asset information. Set `stats.assets` to `false` to hide it.

```javascript
module.exports = {
  //...
  stats: {
    assets: false
  }
};
```

### `stats.assetsSort`

`string = 'id'`

Tells `stats` to sort the assets by a given field. All of the [sorting fields](#sorting-fields) are allowed to be used as values for `stats.assetsSort`. Use `!` prefix in the value to reverse the sort order by a given field.

```javascript
module.exports = {
  //...
  stats: {
    assetsSort: '!size'
  }
};
```

### `stats.builtAt`

`boolean = true`

Tells `stats` whether to add the build date and the build time information. Set `stats.builtAt` to `false` to hide it.

```javascript
module.exports = {
  //...
  stats: {
    builtAt: false
  }
};
```

### `stats.cached`

`boolean = true`

Tells `stats` whether to add information about the cached modules (not the ones that were built).

```javascript
module.exports = {
  //...
  stats: {
    cached: false
  }
};
```

### `stats.cachedAssets`

`boolean = true`

Tells `stats` whether to add information about the cached assets. Setting `stats.cachedAssets` to `false` will tell `stats` to only show the emitted files (not the ones that were built).

```javascript
module.exports = {
  //...
  stats: {
    cachedAssets: false
  }
};
```

### `stats.children`

`boolean = true`

Tells `stats` whether to add information about the children.

```javascript
module.exports = {
  //...
  stats: {
    children: false
  }
};
```

### `stats.chunks`

`boolean = true`

Tells `stats` whether to add information about the chunk. Setting `stats.chunks` to `false` results in a less verbose output.

```javascript
module.exports = {
  //...
  stats: {
    chunks: false
  }
};
```

### `stats.chunkGroups`

`boolean = true`

Tells `stats` whether to add information about the `namedChunkGroups`.

```javascript
module.exports = {
  //...
  stats: {
    chunkGroups: false
  }
};
```

### `stats.chunkModules`

`boolean = true`

Tells `stats` whether to add information about the built modules to information about the chunk.

```javascript
module.exports = {
  //...
  stats: {
    chunkModules: false
  }
};
```

### `stats.chunkOrigins`

`boolean = true`

Tells `stats` whether to add information about the origins of chunks and chunk merging.

```javascript
module.exports = {
  //...
  stats: {
    chunkOrigins: false
  }
};
```

### `stats.chunksSort`

`string = 'id'`

Tells `stats` to sort the chunks by a given field. All of the [sorting fields](#sorting-fields) are allowed to be used as values for `stats.chunksSort`. Use `!` prefix in the value to reverse the sort order by a given field.

```javascript
module.exports = {
  //...
  stats: {
    chunksSort: 'name'
  }
};
```

### `stats.context`

`string = '../src/'`

Sets the context directory for shortening the request information.

```javascript
module.exports = {
  //...
  stats: {
    context: '../src/components/'
  }
};
```

### `stats.colors`

`boolean = false` `object`

Tells `stats` whether to output in the different colors.

```javascript
module.exports = {
  //...
  stats: {
    colors: true
  }
};
```

 It is also available as a CLI flag:

```bash
webpack-cli --colors
```

 You can specify your own terminal output colors using [ANSI escape sequences](https://en.wikipedia.org/wiki/ANSI_escape_code)

```js
module.exports = {
  //...
  colors: {
    green: '\u001b[32m',
  },
};
```

### `stats.depth`

`boolean = false`

Tells `stats` whether to display the distance from the entry point for each module.

```javascript
module.exports = {
  //...
  stats: {
    depth: true
  }
};
```

### `stats.entrypoints`

`boolean = true`

Tells `stats` whether to display the entry points with the corresponding bundles.

```javascript
module.exports = {
  //...
  stats: {
    entrypoints: false
  }
};
```

### `stats.env`

`boolean = false`

Tells `stats` whether to display the `--env` information.

```javascript
module.exports = {
  //...
  stats: {
    env: true
  }
};
```

### `stats.errors`

`boolean = true`

Tells `stats` whether to display the errors.

```javascript
module.exports = {
  //...
  stats: {
    errors: false
  }
};
```

### `stats.errorDetails`

`boolean = true`

Tells `stats` whether to add the details to the errors.

```javascript
module.exports = {
  //...
  stats: {
    errorDetails: false
  }
};
```

### `stats.excludeAssets`

`array = []: string | RegExp | function (assetName) => boolean` `string` `RegExp` `function (assetName) => boolean`

Tells `stats` to exclude the matching assets information. This can be done with a `string`, a `RegExp`, a `function` that is getting the assets name as an argument and returns a `boolean`. `stats.excludeAssets` can be an `array` of any of the above.

```javascript
module.exports = {
  //...
  stats: {
    excludeAssets: [
      'filter',
      /filter/,
      (assetName) => assetName.contains('moduleA')
    ]
  }
};
```

### `stats.excludeModules`

`array = []: string | RegExp | function (assetName) => boolean` `string` `RegExp` `function (assetName) => boolean` `boolean: false`

Tells `stats` to exclude the matching modules information. This can be done with a `string`, a `RegExp`, a `function` that is getting the module's source as an argument and returns a `boolean`. `stats.excludeModules` can be an `array` of any of the above. `stats.excludeModules`'s configuration [is merged](https://github.com/webpack/webpack/blob/master/lib/Stats.js#L215) with the `stats.exclude`'s configuration value.

```javascript
module.exports = {
  //...
  stats: {
    excludeModules: [
      'filter',
      /filter/,
      (moduleSource) => true
    ]
  }
};
```

Setting `stats.excludeModules` to `false` will disable the exclude behaviour.

```javascript
module.exports = {
  //...
  stats: {
    excludeModules: false
  }
};
```

### `stats.exclude`

See [`stats.excludeModules`](#statsexcludemodules).

### `stats.hash`

`boolean = true`

Tells `stats` whether to add information about the hash of the compilation.

```javascript
module.exports = {
  //...
  stats: {
    hash: false
  }
};
```

### `stats.logging`

`string = 'info': 'none' | 'error' | 'warn' | 'info' | 'log' | 'verbose'` `boolean`

Tells `stats` whether to add logging output.

- `'none'`, `false` - disable logging
- `'error'` - errors only
- `'warn'` - errors and warnings only
- `'info'` - errors, warnings, and info messages
- `'log'`, `true` - errors, warnings, info messages, log messages, groups, clears. Collapsed groups are displayed in a collapsed state.
- `'verbose'` - log everything except debug and trace. Collapsed groups are displayed in expanded state.

```javascript
module.exports = {
  //...
  stats: {
    logging: 'verbose'
  }
};
```

### `stats.loggingDebug`

`array = []: string | RegExp | function (name) => boolean` `string` `RegExp` `function (name) => boolean`

Tells `stats` to include the debug information of the specified loggers such as Plugins or Loaders. When [`stats.logging`](#statslogging) is set to `false`, `stats.loggingDebug` option is ignored.

```javascript
module.exports = {
  //...
  stats: {
    loggingDebug: [
      'MyPlugin',
      /MyPlugin/,
      (name) => name.contains('MyPlugin')
    ]
  }
};
```

### `stats.loggingTrace`

`boolean = true`

Enable stack traces in the logging output for errors, warnings and traces. Set `stats.loggingTrace` to hide the trace.


```javascript
module.exports = {
  //...
  stats: {
    loggingTrace: false
  }
};
```

### `stats.maxModules`

`number = 15`

Set the maximum number of modules to be shown.

```javascript
module.exports = {
  //...
  stats: {
    maxModules: 5
  }
};
```

### `stats.modules`

`boolean = true`

Tells `stats` whether to add information about the built modules.

```javascript
module.exports = {
  //...
  stats: {
    modules: false
  }
};
```

### `stats.modulesSort`

`string = 'id'`

Tells `stats` to sort the modules by a given field. All of the [sorting fields](#sorting-fields) are allowed to be used as values for `stats.modulesSort`. Use `!` prefix in the value to reverse the sort order by a given field.

```javascript
module.exports = {
  //...
  stats: {
    modulesSort: 'size'
  }
};
```

### `stats.moduleTrace`

`boolean = true`

Tells `stats` to show dependencies and the origin of warnings/errors. `stats.moduleTrace` is available since webpack 2.5.0.

```javascript
module.exports = {
  //...
  stats: {
    moduleTrace: false
  }
};
```

### `stats.outputPath`

`boolean = true`

Tells `stats` to show the `outputPath`.

```javascript
module.exports = {
  //...
  stats: {
    outputPath: false
  }
};
```

### `stats.performance`

`boolean = true`

Tells `stats` to show performance hint when the file size exceeds [`performance.maxAssetSize`](/configuration/performance/#performancemaxassetsize).

```javascript
module.exports = {
  //...
  stats: {
    performance: false
  }
};
```

### `stats.providedExports`

`boolean = false`

Tells `stats` to show the exports of the modules.

```javascript
module.exports = {
  //...
  stats: {
    providedExports: true
  }
};
```

### `stats.publicPath`

`boolean = true`

Tells `stats` to show the `publicPath`.

```javascript
module.exports = {
  //...
  stats: {
    publicPath: false
  }
};
```

### `stats.reasons`

`boolean = true`

Tells `stats` to add information about the reasons of why modules are included.

```javascript
module.exports = {
  //...
  stats: {
    reasons: false
  }
};
```

### `stats.source`

`boolean = false`

Tells `stats` to add the source code of modules.

```javascript
module.exports = {
  //...
  stats: {
    source: true
  }
};
```

### `stats.timings`

`boolean = true`

Tells `stats` to add the timing information.

```javascript
module.exports = {
  //...
  stats: {
    timings: false
  }
};
```

### `stats.usedExports`

`boolean = false`

Tells `stats` whether to show which exports of a module are used.

```javascript
module.exports = {
  //...
  stats: {
    usedExports: true
  }
};
```

### `stats.version`

`boolean = true`

Tells `stats` to add information about the webpack version used.

```javascript
module.exports = {
  //...
  stats: {
    version: false
  }
};
```

### `stats.warnings`

`boolean = true`

Tells `stats` to add warnings.

```javascript
module.exports = {
  //...
  stats: {
    warnings: false
  }
};
```

### `stats.warningsFilter`

`array = []: string | RegExp | function (warning) => boolean` `string` `RegExp` `function (warning) => boolean`

Tells `stats` to exclude the warnings that are matching given filters. This can be done with a `string`, a `RegExp`, a `function` that is getting a warning as an argument and returns a `boolean`. `stats.warningsFilter` can be an `array` of any of the above.

```javascript
module.exports = {
  //...
  stats: {
    warningsFilter: [
      'filter',
      /filter/,
      (warning) => true
    ]
  }
};
```

### Sorting fields

For `assetsSort`, `chunksSort` and `modulesSort` there are several possible fields that you can sort items by:

- `'id'` is the item's id;
- `'name'` - a item's name that was assigned to it upon importing;
- `'size'` - a size of item in bytes;
- `'chunks'` - what chunks the item originates from (for example, if there are multiple subchunks for one chunk - the subchunks will be grouped together according to their main chunk);
- `'errors'` - amount of errors in items;
- `'warnings'` - amount of warnings in items;
- `'failed'` - whether the item has failed compilation;
- `'cacheable'` - whether the item is cacheable;
- `'built'` - whether the asset has been built;
- `'prefetched'` - whether the asset will be prefetched;
- `'optional'` - whether the asset is optional;
- `'identifier'` - identifier of the item;
- `'index'` - item's processing index;
- `'index2'`
- `'profile'`
- `'issuer'` - an identifier of the issuer;
- `'issuerId'` - an id of the issuer;
- `'issuerName'` - a name of the issuer;
- `'issuerPath'` - a full issuer object. There's no real need to sort by this field;

### Extending stats behaviours

If you want to use one of the pre-defined behaviours e.g. `'minimal'` but still override one or more of the rules, see [the source code](https://github.com/webpack/webpack/blob/master/lib/Stats.js#L1618-L1626). You would want to copy the configuration options from `case 'minimal': ...` and add your additional rules while providing an object to `stats`.

__webpack.config.js__

```javascript
module.exports = {
  //..
  stats: {
    // copied from `'minimal'`
    all: false,
    modules: true,
    maxModules: 0,
    errors: true,
    warnings: true,
    // our additional options
    moduleTrace: true,
    errorDetails: true
  }
};
```
