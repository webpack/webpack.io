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
  - tigt
---

The `stats` option lets you precisely control what bundle information gets displayed. This can be a nice middle ground if you don't want to use `quiet` or `noInfo` because you want some bundle information, but not all of it.

T> For [`webpack-dev-server`](https://webpack.js.org/configuration/dev-server/), this property must be in [the `devServer` object](https://webpack.js.org/configuration/dev-server/#devserver).

W> This option has no effect when using [the Node.js API](https://webpack.js.org/api/node/).

## `stats`

`object` `string`

### Presets

Some presets are available as a shortcut to specify individual options. Use them like this:

```js
module.exports = {
  //...
  stats: 'errors-only'
};
```

| Preset               | Description                                        |
|----------------------|----------------------------------------------------|
| `'errors-only'`      | Output only when errors happen                     |
| `'errors-warnings'`  | Output only when errors or warnings happen         |
| `'minimal'`          | Output only when errors or new compilations happen |
| `'none'` or `false`  | No output                                          |
| `'normal'` or `true` | Default output                                     |
| `'verbose'`          | Output everything                                  |

### In-depth configuration

For more granular control, you can specify exactly what information to show. Please note that all properties in this object are optional.

<!-- eslint-skip -->

```js
module.exports = {
  //...
  stats: {
    // fallback value for stats options when an option is not defined
    // (has precedence over local webpack defaults)
    all: undefined,

    // Add asset information
    assets: true,

    // Sort assets by a field
    // You can reverse the sort with `!field`.
    // Some possible values: 'id' (default), 'name', 'size', 'chunks', 'failed', 'issuer'
    // For a complete list of fields, see the bottom of the page
    assetsSort: 'field',

    // Add build’s date and time information
    builtAt: true,

    // Add information about cached (not built) modules
    cached: true,

    // Show cached assets (setting this to `false` only shows emitted files)
    cachedAssets: true,

    // Add children information
    children: true,

    // Add chunk information (setting this to `false` allows for a less verbose output)
    chunks: true,

    // Add namedChunkGroups information
    chunkGroups: true,

    // Add built modules information to chunk information
    chunkModules: true,

    // Add the origins of chunks and chunk merging info
    chunkOrigins: true,

    // Sort the chunks by a field
    // You can reverse the sort with `!field`. Default is `id`.
    // Some other possible values: 'name', 'size', 'chunks', 'failed', 'issuer'
    // For a complete list of fields see the bottom of the page
    chunksSort: 'field',

    // Context directory for request shortening
    context: '../src/',

    // `webpack --colors` equivalent
    colors: false,

    // Display the distance from the entry point for each module
    depth: false,

    // Display the entry points with the corresponding bundles
    entrypoints: false,

    // Add --env information
    env: false,

    // Add errors
    errors: true,

    // Add details to errors (like resolving log)
    errorDetails: true,

    // Exclude assets from being displayed in stats
    // This can be done with a String, a RegExp, a Function that receives the asset’s name
    // and returns a Boolean, or an Array of the above 3 data types.
    // Possible values: String | RegExp | (assetName) => Boolean | [String, RegExp, (assetName) => Boolean]
    // Example values: 'filter' | /filter/ | ['filter', /filter/] | (assetName) => assetName.contains('moduleA')
    excludeAssets: [],

    // Exclude modules from being displayed in stats
    // This can be done with a String, a RegExp, a Function that receives the module’s source
    // and returns a boolean, or an Array of the above 3 data types.
    // Possible values: String | RegExp | (moduleSource) => Boolean | [String, RegExp, (moduleSource) => Boolean]
    // Example values: 'filter' | /filter/ | ['filter', /filter/] | (moduleSource) => true
    excludeModules: exclude || [],

    // See excludeModules
    // Possible values: String | RegExp | (moduleSource) => Boolean | [String, RegExp, (moduleSource) => Boolean]
    // Example values: 'filter' | /filter/ | ['filter', /filter/] | (moduleSource) => true
    exclude: excludeModules || [],

    // Add the hash of the compilation
    hash: true,

    // Add logging output
    // Possible values: 'none', 'error', 'warn', 'info', 'log', 'verbose', true, false
    // 'none', false - disable logging
    // 'error' - errors only
    // 'warn' - errors and warnings only
    // 'info' - errors, warnings, and info messages
    // 'log', true - errors, warnings, info messages, log messages, groups, clears.
    //    Collapsed groups are displayed in a collapsed state.
    // 'verbose' - log everything except debug and trace.
    //    Collapsed groups are displayed in expanded state.
    logging: 'info',

    // Include debug information of specified loggers, such as plugins or loaders.
    // Provide an array of filters to match plugins or loaders.
    // Filters can be Strings, RegExps or Functions.
    // when stats.logging is false, stats.loggingDebug option is ignored.
    // Possible values: String | RegExp | (warning) => Boolean | [String, RegExp, (name) => Boolean]
    // Example values: 'MyPlugin' | /MyPlugin/ | ['MyPlugin', /MyPlugin/] | (name) => name.contains('MyPlugin')
    loggingDebug: [],

    // Enable stack traces in logging output for errors, warnings, and traces.
    loggingTrace: true,

    // The maximum number of modules to be shown
    maxModules: 15,

    // Add built modules information
    modules: true,

    // Sort the modules by a field
    // You can reverse the sort with `!field`. Default is `id`.
    // Some other possible values: 'name', 'size', 'chunks', 'failed', 'issuer'
    // For a complete list of fields see the bottom of the page
    modulesSort: 'field',

    // Show dependencies and origin of warnings/errors (since webpack 2.5.0)
    moduleTrace: true,

    // Show outputPath
    outputPath: true | false,

    // Show performance hint when file size exceeds `performance.maxAssetSize`
    performance: true,

    // Show the exports of the modules
    providedExports: false,

    // Add public path information
    publicPath: true,

    // Add information about the reasons why modules are included
    reasons: true,

    // Add the source code of modules
    source: false,

    // Add timing information
    timings: true,

    // Show which exports of a module are used
    usedExports: false,

    // Add webpack version information
    version: true,

    // Add warnings
    warnings: true,

    // Filter warnings to be shown (since webpack 2.4.0),
    // Can be a String, Regexp, a Function that receives the warning and returns aBboolean,
    // or an Array of a combination of the above. First match wins.
    // Possible values: String | RegExp | (warning) => Boolean | [String, RegExp, (warning) => Boolean]
    // Example values: 'filter' | /filter/ | ['filter', /filter/] | (warning) => true
    warningsFilter: null
  }
}
```

If you want to use one of the presets (e.g. `'minimal'`) but override some of its rules, see [the source code](https://github.com/webpack/webpack/blob/master/lib/Stats.js#L1394-L1401). You would want to copy the configuration options from `case 'minimal': …`, then add your additional rules in the object for `stats`.

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

### Sorting fields

For `assetsSort`, `chunksSort`, and `modulesSort`, there are several possible fields that you can sort items by:

- `id` - the item's id;
- `name` - the item's name that was assigned to it upon importing;
- `size` - the size of the item in bytes;
- `chunks` - what chunks the item originates from (for example, if there are multiple subchunks for one chunk: the subchunks will be grouped together according to their main chunk);
- `errors` - number of errors in item;
- `warnings` - number of warnings in item;
- `failed` - whether the item has failed compilation;
- `cacheable` - whether the item is cacheable;
- `identifier` - identifier of the item;
- `index` - item's processing index;
- `index2`
- `profile`
- `issuer` - an identifier of the issuer;
- `issuerId` - an id of the issuer;
- `issuerName` - a name of the issuer;
- `issuerPath` - a full issuer object. There's no real need to sort by this field.

#### `assetsSort` only

- `built` - whether the asset has been built;
- `prefetched` - whether the asset will be prefetched;
- `optional` - whether the asset is optional.

### Colors

You can specify your own terminal output colors using [ANSI escape sequences](https://en.wikipedia.org/wiki/ANSI_escape_code):

```js
module.exports = {
  //...
  colors: {
    green: '\u001b[32m',
  },
};
```
