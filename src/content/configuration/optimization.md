---
title: Optimization
sort: 9
contributors:
  - EugeneHlushko
  - jeremenichelli
  - simon04
  - byzyk
  - madhavarshney
  - dhurlburtusa
  - fokusferit
related:
  - title: 'webpack 4: Code Splitting, chunk graph and the splitChunks optimization'
    url: https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
---

Since version 4 webpack runs optimizations for you depending on the chosen  [`mode`](/configuration/mode/), still all optimizations are available for manual configuration and overrides.


## `optimization.minimize`

`boolean`

Tell webpack to minimize the bundle using the [TerserPlugin](/plugins/terser-webpack-plugin/).

This is `true` by default in `production` mode.

__webpack.config.js__


```js
module.exports = {
  //...
  optimization: {
    minimize: false
  }
};
```

T> Learn how [mode](/configuration/mode/) works.

## `optimization.minimizer`

`[Plugin]` and or `[function (compiler)]`

Allows you to override the default minimizer by providing a different one or more customized [TerserPlugin](/plugins/terser-webpack-plugin/) instances.

__webpack.config.js__

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        }
      }),
    ],
  }
};
```

Or, as function:

```js
module.exports = {
  optimization: {
    minimizer: [
      (compiler) => {
        const TerserPlugin = require('terser-webpack-plugin');
        new TerserPlugin({ /* your config */ }).apply(compiler);
      }
    ],
  }
};
```

## `optimization.splitChunks`

`object`

By default webpack v4+ provides new common chunks strategies out of the box for dynamically imported modules. See available options for configuring this behavior in the [SplitChunksPlugin](/plugins/split-chunks-plugin/) page.

## `optimization.runtimeChunk`

`object` `string` `boolean`

Setting `optimization.runtimeChunk` to `true` or `'multiple'` adds an additional chunk to each entrypoint containing only the runtime. This setting is an alias for:

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    }
  }
};
```

The value `'single'` instead creates a runtime file to be shared for all generated chunks. This setting is an alias for:

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    runtimeChunk: {
      name: 'runtime'
    }
  }
};
```

By setting `optimization.runtimeChunk` to `object` it is only possible to provide the `name` property which stands for the name or name factory for the runtime chunks.

Default is `false`: each entry chunk embeds runtime.

W> Imported modules are initialized for each runtime chunk separately, so if you include multiple entry points on a page, beware of this behavior. You will probably want to set it to `single` or use another configuration that allows you to only have one runtime instance.

__webpack.config.js__


```js
module.exports = {
  //...
  optimization: {
    runtimeChunk: {
      name: entrypoint => `runtimechunk~${entrypoint.name}`
    }
  }
};
```

## `optimization.noEmitOnErrors`

`boolean`

Use the `optimization.noEmitOnErrors` to skip the emitting phase whenever there are errors while compiling. This ensures that no erroring assets are emitted. The `emitted` flag in the stats is `false` for all assets.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    noEmitOnErrors: true
  }
};
```

W> If you are using webpack [CLI](/api/cli/), the webpack process will not exit with an error code while this plugin is enabled. If you want webpack to "fail" when using the CLI, please check out the [`bail` option](/api/cli/#advanced-options).

## `optimization.namedModules`

`boolean = false`

Tells webpack to use readable module identifiers for better debugging. When `optimization.namedModules` is not set in webpack config, webpack will enable it by default for [mode](/configuration/mode/) `development` and disable for [mode](/configuration/mode/) `production`.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    namedModules: true
  }
};
```

## `optimization.namedChunks`

`boolean = false`

Tells webpack to use readable chunk identifiers for better debugging. This option is enabled by default for [mode](/configuration/mode/) `development` and turned off for [mode](/configuration/mode/) `production` if no option is provided in webpack config.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    namedChunks: true
  }
};
```

## `optimization.moduleIds`

`boolean = false` `string: 'natural' | 'named' | 'hashed' | 'size' | 'total-size'`

Tells webpack which algorithm to use when choosing module ids. Setting `optimization.moduleIds` to `false` tells webpack that none of built-in algorithms should be used, as custom one can be provided via plugin. By default `optimization.moduleIds` is set to `false`.

The following string values are supported:

Option                | Description
--------------------- | -----------------------
`natural`             | Numeric ids in order of usage.
`named`               | Readable ids for better debugging.
`hashed`              | Short hashes as ids for better long term caching.
`size`                | Numeric ids focused on minimal initial download size.
`total-size`          | numeric ids focused on minimal total download size.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    moduleIds: 'hashed'
  }
};
```

## `optimization.chunkIds`

`boolean = false` `string: 'natural' | 'named' | 'size' | 'total-size'`

Tells webpack which algorithm to use when choosing chunk ids. Setting `optimization.chunkIds` to `false` tells webpack that none of built-in algorithms should be used, as custom one can be provided via plugin. There are couple of defaults for `optimization.chunkIds`:

- if [`optimization.occurrenceOrder`](#optimizationoccurrenceorder) is enabled `optimization.chunkIds` is set to `'total-size'`
- Disregarding previous if, if [`optimization.namedChunks`](#optimizationnamedchunks) is enabled `optimization.chunkIds` is set to `'named'`
- if none of the above, `optimization.chunkIds` will be defaulted to `'natural'`

The following string values are supported:

Option                  | Description
----------------------- | -----------------------
`'natural'`             | Numeric ids in order of usage.
`'named'`               | Readable ids for better debugging.
`'size'`                | Numeric ids focused on minimal initial download size.
`'total-size'`          | numeric ids focused on minimal total download size.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    chunkIds: 'named'
  }
};
```

## `optimization.nodeEnv`

`boolean = false` `string`

Tells webpack to set `process.env.NODE_ENV` to a given string value. `optimization.nodeEnv` uses [DefinePlugin](/plugins/define-plugin/) unless set to `false`. `optimization.nodeEnv` __defaults__ to [mode](/configuration/mode/) if set, else falls back to `'production'`.

Possible values:

- any string: the value to set `process.env.NODE_ENV` to.
- false: do not modify/set the value of `process.env.NODE_ENV`.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    nodeEnv: 'production'
  }
};
```

## `optimization.mangleWasmImports`

`boolean = false`

When set to `true` tells webpack to reduce the size of WASM by changing imports to shorter strings. It mangles module and export names.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    mangleWasmImports: true
  }
};
```

## `optimization.removeAvailableModules`

`boolean = false`

Tells webpack to detect and remove modules from chunks when these modules are already included in all parents. Setting `optimization.removeAvailableModules` to `true` will enable this optimization. Enabled by default in [`production` mode](/configuration/mode/).

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    removeAvailableModules: true
  }
};
```

W> `optimization.removeAvailableModules` reduces the performance of webpack, and will be turned off in `production` mode by default in next major release. Disable it in `production` mode if you want extra build performance.

## `optimization.removeEmptyChunks`

`boolean = true`

Tells webpack to detect and remove chunks which are empty. Setting `optimization.removeEmptyChunks` to `false` will disable this optimization.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    removeEmptyChunks: false
  }
};
```

## `optimization.mergeDuplicateChunks`

`boolean = true`

Tells webpack to merge chunks which contain the same modules. Setting `optimization.mergeDuplicateChunks` to `false` will disable this optimization.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    mergeDuplicateChunks: false
  }
};
```

## `optimization.flagIncludedChunks`

`boolean`

Tells webpack to determine and flag chunks which are subsets of other chunks in a way that subsets don’t have to be loaded when the bigger chunk has been already loaded. By default `optimization.flagIncludedChunks` is enabled in `production` [mode](/configuration/mode/) and turned off elsewise.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    flagIncludedChunks: true
  }
};
```

## `optimization.occurrenceOrder`

`boolean`

Tells webpack to figure out an order of modules which will result in the smallest initial bundle. By default `optimization.occurrenceOrder` is enabled in `production` [mode](/configuration/mode/) and turned off elsewise.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    occurrenceOrder: false
  }
};
```

## `optimization.providedExports`

`boolean`

Tells webpack to figure out which exports are provided by modules to generate more efficient code for `export * from ...`. By default  `optimization.providedExports` is enabled.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    providedExports: false
  }
};
```

## `optimization.usedExports`

`boolean`

Tells webpack to determine used exports for each module. This depends on [`optimization.providedExports`](#optimizationoccurrenceorder). Information collected by `optimization.usedExports` is used by other optimizations or code generation i.e. exports are not generated for unused exports, export names are mangled to single char identifiers when all usages are compatible.
Dead code elimination in minimizers will benefit from this and can remove unused exports.
By default `optimization.usedExports` is enabled in `production` [mode](/configuration/mode/) and turned off elsewise.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    usedExports: true
  }
};
```

## `optimization.concatenateModules`

`boolean`

Tells webpack to find segments of the module graph which can be safely concatenated into a single module. Depends on [`optimization.providedExports`](#optimizationprovidedexports) and [`optimization.usedExports`](#optimizationusedexports).
By default `optimization.concatenateModules` is enabled in `production` [mode](/configuration/mode/) and turned off elsewise.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    concatenateModules: true
  }
};
```

## `optimization.sideEffects`

`boolean`

Tells webpack to recognise the [`sideEffects`](https://github.com/webpack/webpack/blob/master/examples/side-effects/README.md) flag in `package.json` or rules to skip over modules which are flagged to contain no side effects when exports are not used.

__package.json__

``` json
{
  "name": "awesome npm module",
  "version": "1.0.0",
  "sideEffects": false
}
```

T> Please note that `sideEffects` should be in the npm module's `package.json` file and doesn't mean that you need to set `sideEffects` to `false` in your own project's `package.json` which requires that big module.

`optimization.sideEffects` depends on [`optimization.providedExports`](#optimizationprovidedexports) to be enabled. This dependency has a build time cost, but eliminating modules has positive impact on performance because of less code generation. Effect of this optimization depends on your codebase, try it for possible performance wins.

By default `optimization.sideEffects` is enabled in `production` [mode](/configuration/mode/) and turned off elsewise.

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    sideEffects: true
  }
};
```

## `optimization.portableRecords`

`boolean`

`optimization.portableRecords` tells webpack to generate records with relative paths to be able to move the context folder.

By default `optimization.portableRecords` is turned off. Automatically enabled if at least one of the records options provided to webpack config: [`recordsPath`](/configuration/other-options/#recordspath), [`recordsInputPath`](/configuration/other-options/#recordsinputpath), [`recordsOutputPath`](/configuration/other-options/#recordsoutputpath).

__webpack.config.js__

```js
module.exports = {
  //...
  optimization: {
    portableRecords: true
  }
};
```
