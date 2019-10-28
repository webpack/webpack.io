---
title: Output
sort: 6
contributors:
  - sokra
  - skipjack
  - tomasAlabes
  - mattce
  - irth
  - fvgs
  - dhurlburtusa
  - MagicDuck
  - fadysamirsadek
  - byzyk
  - madhavarshney
  - harshwardhansingh
  - eemeli
  - EugeneHlushko
  - g-plane
  - fokusferit
---

The top-level `output` key contains set of options instructing webpack on how and where it should output your bundles, assets and anything else you bundle or load with webpack.


## `output.auxiliaryComment`

`string` `object`

When used in tandem with [`output.library`](#outputlibrary) and [`output.libraryTarget`](#outputlibrarytarget), this option allows users to insert comments within the export wrapper. To insert the same comment for each `libraryTarget` type, set `auxiliaryComment` to a string:

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    library: 'someLibName',
    libraryTarget: 'umd',
    filename: 'someLibName.js',
    auxiliaryComment: 'Test Comment'
  }
};
```

which will yield the following:

__webpack.config.js__

```javascript
(function webpackUniversalModuleDefinition(root, factory) {
  // Test Comment
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory(require('lodash'));
  // Test Comment
  else if(typeof define === 'function' && define.amd)
    define(['lodash'], factory);
  // Test Comment
  else if(typeof exports === 'object')
    exports['someLibName'] = factory(require('lodash'));
  // Test Comment
  else
    root['someLibName'] = factory(root['_']);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
  // ...
});
```

For fine-grained control over each `libraryTarget` comment, pass an object:

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    //...
    auxiliaryComment: {
      root: 'Root Comment',
      commonjs: 'CommonJS Comment',
      commonjs2: 'CommonJS2 Comment',
      amd: 'AMD Comment'
    }
  }
};
```


## `output.chunkFilename`

`string = '[id].js'`

This option determines the name of non-entry chunk files. See [`output.filename`](#outputfilename) option for details on the possible values.

Note that these filenames need to be generated at runtime to send the requests for chunks. Because of this, placeholders like `[name]` and `[chunkhash]` need to add a mapping from chunk id to placeholder value to the output bundle with the webpack runtime. This increases the size and may invalidate the bundle when placeholder value for any chunk changes.

By default `[id].js` is used or a value inferred from [`output.filename`](#outputfilename) (`[name]` is replaced with `[id]` or `[id].` is prepended).

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    //...
    chunkFilename: '[id].js'
  }
};
```


## `output.chunkLoadTimeout`

`number = 120000`

Number of milliseconds before chunk request expires. This option is supported since webpack 2.6.0.

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    //...
    chunkLoadTimeout: 30000
  }
};
```


## `output.crossOriginLoading`

`boolean = false` `string: 'anonymous' | 'use-credentials'`

Tells webpack to enable [cross-origin](https://developer.mozilla.org/en/docs/Web/HTML/Element/script#attr-crossorigin) loading of chunks. Only takes effect when [`target`](/configuration/target/) is set to `'web'`, which uses JSONP for loading on-demand chunks, by adding script tags.

- `'anonymous'` - Enable cross-origin loading __without credentials__
- `'use-credentials'` - Enable cross-origin loading __with credentials__


## `output.jsonpScriptType`

`string = 'text/javascript': 'module' | 'text/javascript'`

Allows customization of `type` attribute of `script` tags that webpack injects into the DOM to download async chunks.

- `'text/javascript'`: Default `type` in HTML5 and required for some browsers in HTML4.
- `'module'`: Causes the code to be treated as a JavaScript module.

## `output.devtoolFallbackModuleFilenameTemplate`

`string` `function (info)`

A fallback used when the template string or function above yields duplicates.

See [`output.devtoolModuleFilenameTemplate`](#outputdevtoolmodulefilenametemplate).


## `output.devtoolLineToLine`

`boolean = false` `object: { test string | RegExp, include string | RegExp, exclude string | RegExp}`

> Avoid using this option as it is __deprecated__ and will soon be removed.

Enables line to line mapping for all or some modules. This produces a basic source map where each line of the generated source is mapped to the same line of the original source. This is a performance optimization and should only be used if all input lines match generated lines.

Pass a boolean to enable or disable this feature for all modules (defaults to `false`). Use `object` for granular control, e.g. to enable this feature for all javascript files within a certain directory:

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    devtoolLineToLine: { test: /\.js$/, include: 'src/utilities' }
  }
};
```


## `output.devtoolModuleFilenameTemplate`

`string = 'webpack://[namespace]/[resource-path]?[loaders]'` `function (info) => string`

This option is only used when [`devtool`](/configuration/devtool) uses an options which requires module names.

Customize the names used in each source map's `sources` array. This can be done by passing a template string or function. For example, when using `devtool: 'eval'`.

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    devtoolModuleFilenameTemplate: 'webpack://[namespace]/[resource-path]?[loaders]'
  }
};
```

The following substitutions are available in template strings (via webpack's internal [`ModuleFilenameHelpers`](https://github.com/webpack/webpack/blob/master/lib/ModuleFilenameHelpers.js)):

| Template                 | Description |
| ------------------------ | ----------- |
| [absolute-resource-path] | The absolute filename |
| [all-loaders]            | Automatic and explicit loaders and params up to the name of the first loader |
| [hash]                   | The hash of the module identifier |
| [id]                     | The module identifier |
| [loaders]                | Explicit loaders and params up to the name of the first loader |
| [resource]               | The path used to resolve the file and any query params used on the first loader |
| [resource-path]          | The path used to resolve the file without any query params |
| [namespace]              | The modules namespace. This is usually the library name when building as a library, empty otherwise |

When using a function, the same options are available camel-cased via the `info` parameter:

```javascript
module.exports = {
  //...
  output: {
    devtoolModuleFilenameTemplate: info => {
      return `webpack:///${info.resourcePath}?${info.loaders}`;
    }
  }
};
```

If multiple modules would result in the same name, [`output.devtoolFallbackModuleFilenameTemplate`](#outputdevtoolfallbackmodulefilenametemplate) is used instead for these modules.


## `output.devtoolNamespace`

`string`

This option determines the modules namespace used with the [`output.devtoolModuleFilenameTemplate`](#outputdevtoolmodulefilenametemplate). When not specified, it will default to the value of: [`output.library`](#outputlibrary). It's used to prevent source file path collisions in sourcemaps when loading multiple libraries built with webpack.

For example, if you have 2 libraries, with namespaces `library1` and `library2`, which both have a file `./src/index.js` (with potentially different contents), they will expose these files as `webpack://library1/./src/index.js` and `webpack://library2/./src/index.js`.


## `output.filename`

`string` `function (chunkData) => string`

This option determines the name of each output bundle. The bundle is written to the directory specified by the [`output.path`](#outputpath) option.

For a single [`entry`](/configuration/entry-context#entry) point, this can be a static name.

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    filename: 'bundle.js'
  }
};
```

However, when creating multiple bundles via more than one entry point, code splitting, or various plugins, you should use one of the following substitutions to give each bundle a unique name...

Using entry name:

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    filename: '[name].bundle.js'
  }
};
```

Using internal chunk id:

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    filename: '[id].bundle.js'
  }
};
```

Using the unique hash generated for every build:

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    filename: '[name].[hash].bundle.js'
  }
};
```

Using hashes based on each chunks' content:

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    filename: '[chunkhash].bundle.js'
  }
};
```

Using hashes generated for extracted content:

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    filename: '[contenthash].bundle.css'
  }
};
```

Using function to return the filename:

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    filename: (chunkData) => {
      return chunkData.chunk.name === 'main' ? '[name].js': '[name]/[name].js';
    },
  }
};
```

Make sure to read the [Caching guide](/guides/caching) for details. There are more steps involved than only setting this option.

Note this option is called filename but you are still allowed to use something like `'js/[name]/bundle.js'` to create a folder structure.

Note this option does not affect output files for on-demand-loaded chunks. For these files the [`output.chunkFilename`](#outputchunkfilename) option is used. Files created by loaders also aren't affected. In this case you would have to try the specific loader's available options.

The following substitutions are available in template strings (via webpack's internal [`TemplatedPathPlugin`](https://github.com/webpack/webpack/blob/master/lib/TemplatedPathPlugin.js)):

| Template      | Description                                                                         |
| ------------- | ----------------------------------------------------------------------------------- |
| [hash]        | The hash of the module identifier                                                   |
| [contenthash] | the hash of the content of a file, which is different for each asset                |
| [chunkhash]   | The hash of the chunk content                                                       |
| [name]        | The module name                                                                     |
| [id]          | The module identifier                                                               |
| [query]       | The module query, i.e., the string following `?` in the filename                    |
| [function]    | The function, which can return filename [string]                                    |

The lengths of `[hash]` and `[chunkhash]` can be specified using `[hash:16]` (defaults to 20). Alternatively, specify [`output.hashDigestLength`](#outputhashdigestlength) to configure the length globally.

It is possible to filter out placeholder replacement when you want to use one of the placeholders in the actual file name. For example, to output a file `[name].js`, you have to escape the `[name]` placeholder by adding backslashes between the brackets. So that `[\name\]` generates `[name]` instead of getting replaced with the `name` of the asset.

Example: `[\id\]` generates `[id]` instead of getting replaced with the `id`.

If using a function for this option, the function will be passed an object containing the substitutions in the table above.

T> When using the [`ExtractTextWebpackPlugin`](/plugins/extract-text-webpack-plugin), use `[contenthash]` to obtain a hash of the extracted file (neither `[hash]` nor `[chunkhash]` work).


## `output.globalObject`

`string = 'window'`

When targeting a library, especially the `libraryTarget` is `'umd'`, this option indicates what global object will be used to mount the library. To make UMD build available on both browsers and Node.js, set `output.globalObject` option to `'this'`.

For example:

__webpack.config.js__

```javascript
module.exports = {
  // ...
  output: {
    library: 'myLib',
    libraryTarget: 'umd',
    filename: 'myLib.js',
    globalObject: 'this'
  }
};
```


## `output.hashDigest`

`string = 'hex'`

The encoding to use when generating the hash. All encodings from Node.JS' [`hash.digest`](https://nodejs.org/api/crypto.html#crypto_hash_digest_encoding) are supported. Using `'base64'` for filenames might be problematic since it has the character `/` in its alphabet. Likewise `'latin1'` could contain any character.


## `output.hashDigestLength`

`number = 20`

The prefix length of the hash digest to use.


## `output.hashFunction`

`string = 'md4'` `function`

The hashing algorithm to use. All functions from Node.JS' [`crypto.createHash`](https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm_options) are supported. Since `4.0.0-alpha2`, the `hashFunction` can now be a constructor to a custom hash function. You can provide a non-crypto hash function for performance reasons.

```javascript
module.exports = {
  //...
  output: {
    hashFunction: require('metrohash').MetroHash64
  }
};
```

Make sure that the hashing function will have `update` and `digest` methods available.

## `output.hashSalt`

An optional salt to update the hash via Node.JS' [`hash.update`](https://nodejs.org/api/crypto.html#crypto_hash_update_data_inputencoding).


## `output.hotUpdateChunkFilename`

`string = '[id].[hash].hot-update.js'` `function (chunkData) => string`

Customize the filenames of hot update chunks. See [`output.filename`](#outputfilename) option for details on the possible values.

The only placeholders allowed here are `[id]` and `[hash]`, the default being:

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    hotUpdateChunkFilename: (chunkData) => {
      return `${chunkData.chunk.name === 'main' ? '' : '[name]/'}[id].[hash].hot-update.js`;
    }
  }
};
```

T> Typically you don't need to change `output.hotUpdateChunkFilename`.

## `output.hotUpdateFunction`

`string`

Only used when [`target`](/configuration/target/) is set to `'web'`, which uses JSONP for loading hot updates.

A JSONP function used to asynchronously load hot-update chunks.

For details see [`output.jsonpFunction`](#outputjsonpfunction).


## `output.hotUpdateMainFilename`

`string = '[hash].hot-update.json'` `function`

Customize the main hot update filename. `[hash]` is the only available placeholder.

T> Typically you don't need to change `output.hotUpdateMainFilename`.

## `output.jsonpFunction`

`string = 'webpackJsonp'`

Only used when [`target`](/configuration/target/) is set to `'web'`, which uses JSONP for loading on-demand chunks.

A JSONP function name used to asynchronously load chunks or join multiple initial chunks (SplitChunksPlugin, AggressiveSplittingPlugin).

If using the [`output.library`](#outputlibrary) option, the library name is automatically concatenated with `output.jsonpFunction`'s value.

W> If multiple webpack runtimes (from different compilations) are used on the same webpage, there is a risk of conflicts of on-demand chunks in the global namespace.

By default, on-demand chunk's output starts with:

__example-on-demand-chunk.js__

```javascript
(window.webpackJsonp = window.webpackJsonp || []).push(/* ... */);
```

Change `output.jsonpFunction` for safe usage of multiple webpack runtimes on the same webpage:

__webpack.config.flight-widget.js__

```javascript
module.exports = {
  //...
  output: {
    jsonpFunction: 'wpJsonpFlightsWidget'
  }
};
```

On-demand chunks content would now change to:

__example-on-demand-chunk.js__

```javascript
(window.wpJsonpFlightsWidget = window.wpJsonpFlightsWidget || []).push(/* ... */);
```

## `output.library`

`string` `object`

T> Can be given an `object` since webpack 3.1.0. Effective for `libraryTarget: 'umd'`.

How the value of the `output.library` is used depends on the value of the [`output.libraryTarget`](#outputlibrarytarget) option; please refer to that section for the complete details. Note that the default option for `output.libraryTarget` is `var`, so if the following configuration option is used:

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    library: 'MyLibrary'
  }
};
```

The variable `MyLibrary` will be bound with the return value of your entry file, if the resulting output is included as a script tag in an HTML page.

W> Note that if an `array` is provided as an `entry` point, only the last module in the array will be exposed. If an `object` is provided, it can be exposed using an `array` syntax (see [this example](https://github.com/webpack/webpack/tree/master/examples/multi-part-library) for details).

T> Read the [authoring libraries guide](/guides/author-libraries/) guide for more information on `output.library` as well as `output.libraryTarget`.


## `output.libraryExport`

`string` `[string]`

Configure which module or modules will be exposed via the `libraryTarget`. It is `undefined` by default, same behaviour will be applied if you set `libraryTarget` to an empty string e.g. `''` it will export the whole (namespace) object. The examples below demonstrate the effect of this config when using `libraryTarget: 'var'`.

The following configurations are supported:

`libraryExport: 'default'` - The __default export of your entry point__ will be assigned to the library target:

```javascript
// if your entry has a default export of `MyDefaultModule`
var MyDefaultModule = _entry_return_.default;
```

`libraryExport: 'MyModule'` - The __specified module__ will be assigned to the library target:

```javascript
var MyModule = _entry_return_.MyModule;
```

`libraryExport: ['MyModule', 'MySubModule']` - The array is interpreted as a __path to a module__ to be assigned to the library target:

```javascript
var MySubModule = _entry_return_.MyModule.MySubModule;
```

With the `libraryExport` configurations specified above, the resulting libraries could be utilized as such:

```javascript
MyDefaultModule.doSomething();
MyModule.doSomething();
MySubModule.doSomething();
```


## `output.libraryTarget`

`string = 'var'`

Configure how the library will be exposed. Any one of the following options can be used. Please note that this option works in conjunction with the value assigned to [`output.library`](#outputlibrary). For the following examples, it is assumed that this value is configured as `MyLibrary`.

T> Note that `_entry_return_` in the example code below is the value returned by the entry point. In the bundle itself, it is the output of the function that is generated by webpack from the entry point.

### Expose a Variable

These options assign the return value of the entry point (e.g. whatever the entry point exported) to the name provided by `output.library` at whatever scope the bundle was included at.

`libraryTarget: 'var'` - (default) When your library is loaded, the __return value of your entry point__ will be assigned to a variable:

```javascript
var MyLibrary = _entry_return_;

// In a separate script...
MyLibrary.doSomething();
```

W> When using this option, an empty `output.library` will result in no assignment.


`libraryTarget: 'assign'` - This will generate an implied global which has the potential to reassign an existing value (use with caution).

```javascript
MyLibrary = _entry_return_;
```

Be aware that if `MyLibrary` isn't defined earlier your library will be set in global scope.

W> When using this option, an empty `output.library` will result in a broken output bundle.


### Expose Via Object Assignment

These options assign the return value of the entry point (e.g. whatever the entry point exported) to a specific object under the name defined by `output.library`.

If `output.library` is not assigned a non-empty string, the default behavior is that all properties returned by the entry point will be assigned to the object as defined for the particular `output.libraryTarget`, via the following code fragment:

```javascript
(function(e, a) { for(var i in a) { e[i] = a[i]; } }(output.libraryTarget, _entry_return_));
```

W> Note that not setting a `output.library` will cause all properties returned by the entry point to be assigned to the given object; there are no checks against existing property names.

`libraryTarget: "this"` - The __return value of your entry point__ will be assigned to this under the property named by `output.library`. The meaning of `this` is up to you:

```javascript
this['MyLibrary'] = _entry_return_;

// In a separate script...
this.MyLibrary.doSomething();
MyLibrary.doSomething(); // if this is window
```

`libraryTarget: 'window'` - The __return value of your entry point__ will be assigned to the `window` object using the `output.library` value.

```javascript
window['MyLibrary'] = _entry_return_;

window.MyLibrary.doSomething();
```


`libraryTarget: 'global'` - The __return value of your entry point__ will be assigned to the `global` object using the `output.library` value.

```javascript
global['MyLibrary'] = _entry_return_;

global.MyLibrary.doSomething();
```


`libraryTarget: 'commonjs'` - The __return value of your entry point__ will be assigned to the `exports` object using the `output.library` value. As the name implies, this is used in CommonJS environments.

```javascript
exports['MyLibrary'] = _entry_return_;

require('MyLibrary').doSomething();
```

### Module Definition Systems

These options will result in a bundle that comes with a more complete header to ensure compatibility with various module systems. The `output.library` option will take on a different meaning under the following `output.libraryTarget` options.


`libraryTarget: 'commonjs2'` - The __return value of your entry point__ will be assigned to the `module.exports`. As the name implies, this is used in CommonJS environments:

```javascript
module.exports = _entry_return_;

require('MyLibrary').doSomething();
```

Note that `output.library` is omitted, thus it is not required for this particular `output.libraryTarget`.

T> Wondering the difference between CommonJS and CommonJS2 is? While they are similar, there are some subtle differences between them that are not usually relevant in the context of webpack. (For further details, please [read this issue](https://github.com/webpack/webpack/issues/1114).)


`libraryTarget: 'amd'` - This will expose your library as an AMD module.

AMD modules require that the entry chunk (e.g. the first script loaded by the `<script>` tag) be defined with specific properties, such as `define` and `require` which is typically provided by RequireJS or any compatible loaders (such as almond). Otherwise, loading the resulting AMD bundle directly will result in an error like `define is not defined`.

So, with the following configuration...

```javascript
module.exports = {
  //...
  output: {
    library: 'MyLibrary',
    libraryTarget: 'amd'
  }
};
```

The generated output will be defined with the name "MyLibrary", i.e.

```javascript
define('MyLibrary', [], function() {
  return _entry_return_;
});
```

The bundle can be included as part of a script tag, and the bundle can be invoked like so:

```javascript
require(['MyLibrary'], function(MyLibrary) {
  // Do something with the library...
});
```

If `output.library` is undefined, the following is generated instead.

```javascript
define([], function() {
  return _entry_return_;
});
```

This bundle will not work as expected, or not work at all (in the case of the almond loader) if loaded directly with a `<script>` tag. It will only work through a RequireJS compatible asynchronous module loader through the actual path to that file, so in this case, the `output.path` and `output.filename` may become important for this particular setup if these are exposed directly on the server.


`libraryTarget: 'amd-require'` - This packages your output with an immediately-executed AMD `require(dependencies, factory)` wrapper.

The `'amd-require'` target allows for the use of AMD dependencies without needing a separate later invocation. As with the `'amd'` target, this depends on the appropriate [`require` function](https://github.com/amdjs/amdjs-api/blob/master/require.md) being available in the environment in which the webpack output is loaded.

With this target, the library name is ignored.


`libraryTarget: 'umd'` - This exposes your library under all the module definitions, allowing it to work with CommonJS, AMD and as global variable. Take a look at the [UMD Repository](https://github.com/umdjs/umd) to learn more.

In this case, you need the `library` property to name your module:

```javascript
module.exports = {
  //...
  output: {
    library: 'MyLibrary',
    libraryTarget: 'umd'
  }
};
```

And finally the output is:

```javascript
(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else if(typeof exports === 'object')
    exports['MyLibrary'] = factory();
  else
    root['MyLibrary'] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
  return _entry_return_;
});
```

Note that omitting `library` will result in the assignment of all properties returned by the entry point be assigned directly to the root object, as documented under the [object assignment section](#expose-via-object-assignment). Example:

```javascript
module.exports = {
  //...
  output: {
    libraryTarget: 'umd'
  }
};
```

The output will be:

```javascript
(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else {
    var a = factory();
    for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
  }
})(typeof self !== 'undefined' ? self : this, function() {
  return _entry_return_;
});
```

Since webpack 3.1.0, you may specify an object for `library` for differing names per targets:

```javascript
module.exports = {
  //...
  output: {
    library: {
      root: 'MyLibrary',
      amd: 'my-library',
      commonjs: 'my-common-library'
    },
    libraryTarget: 'umd'
  }
};
```

`libraryTarget: 'system'` - This will expose your library as a [`System.register`](https://github.com/systemjs/systemjs/blob/master/docs/system-register.md)
module. This feature was first released in [webpack 4.30.0](https://github.com/webpack/webpack/releases/tag/v4.30.0).

System modules require that a global variable `System` is present in the browser when the webpack bundle is executed. Compiling to `System.register` format allows you to `System.import('/bundle.js')` without additional configuration and have your webpack bundle loaded into the System module registry.


```javascript
module.exports = {
  //...
  output: {
    libraryTarget: 'system'
  }
};
```

Output:

```javascript
System.register([], function(_export) {
  return {
    setters: [],
    execute: function() {
      // ...
    },
  };
});
```

By adding `output.library` to configuration in addition to having `output.libraryTarget` set to `system`, the output bundle will have the library name as an argument to `System.register`:

```javascript
System.register('my-library', [], function(_export) {
  return {
    setters: [],
    execute: function() {
      // ...
    },
  };
});
```

Module proof library.


### Other Targets

`libraryTarget: 'jsonp'` - This will wrap the return value of your entry point into a jsonp wrapper.

``` javascript
MyLibrary(_entry_return_);
```

The dependencies for your library will be defined by the [`externals`](/configuration/externals/) config.


## `output.path`

`string: path.join(process.cwd(), 'dist')`

The output directory as an __absolute__ path.

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    path: path.resolve(__dirname, 'dist/assets')
  }
};
```

Note that `[hash]` in this parameter will be replaced with an hash of the compilation. See the [Caching guide](/guides/caching/) for details.


## `output.pathinfo`

`boolean`

Tells webpack to include comments in bundles with information about the contained modules. This option defaults to `true` in `development` and `false` in `production` [mode](/configuration/mode/) respectively.

W> While the data this comments can provide is very useful during development when reading the generated code, it __should not__ be used in production.

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    pathinfo: true
  }
};
```

T> It also adds some info about tree shaking to the generated bundle.


## `output.publicPath`

`string = ''` `function`

This is an important option when using on-demand-loading or loading external resources like images, files, etc. If an incorrect value is specified you'll receive 404 errors while loading these resources.

This option specifies the __public URL__ of the output directory when referenced in a browser. A relative URL is resolved relative to the HTML page (or `<base>` tag). Server-relative URLs, protocol-relative URLs or absolute URLs are also possible and sometimes required, i. e. when hosting assets on a CDN.

The value of the option is prefixed to every URL created by the runtime or loaders. Because of this __the value of this option ends with `/`__ in most cases.

General rule: The URL of your [`output.path`](#outputpath) from the view of the HTML page.

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    path: path.resolve(__dirname, 'public/assets'),
    publicPath: 'https://cdn.example.com/assets/'
  }
};
```

For this configuration:

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    publicPath: '/assets/',
    chunkFilename: '[id].chunk.js'
  }
};
```

A request to a chunk will look like `/assets/4.chunk.js`.

A loader outputting HTML might emit something like this:

```html
<link href="/assets/spinner.gif" />
```

or when loading an image in CSS:

```css
background-image: url(/assets/spinner.gif);
```

The webpack-dev-server also takes a hint from `publicPath`, using it to determine where to serve the output files from.

Note that `[hash]` in this parameter will be replaced with an hash of the compilation. See the [Caching guide](/guides/caching) for details.

Examples:

```javascript
module.exports = {
  //...
  output: {
    // One of the below
    publicPath: 'https://cdn.example.com/assets/', // CDN (always HTTPS)
    publicPath: '//cdn.example.com/assets/', // CDN (same protocol)
    publicPath: '/assets/', // server-relative
    publicPath: 'assets/', // relative to HTML page
    publicPath: '../assets/', // relative to HTML page
    publicPath: '', // relative to HTML page (same directory)
  }
};
```

In cases where the `publicPath` of output files can't be known at compile time, it can be left blank and set dynamically at runtime in the entry file using the [free variable](https://stackoverflow.com/questions/12934929/what-are-free-variables) `__webpack_public_path__`.

```javascript
__webpack_public_path__ = myRuntimePublicPath;

// rest of your application entry
```

See [this discussion](https://github.com/webpack/webpack/issues/2776#issuecomment-233208623) for more information on `__webpack_public_path__`.


## `output.sourceMapFilename`

`string = '[file].map[query]'`

Configure how source maps are named. Only takes effect when [`devtool`](/configuration/devtool/) is set to `'source-map'`, which writes an output file.

The `[name]`, `[id]`, `[hash]` and `[chunkhash]` substitutions from [`output.filename`](#outputfilename) can be used. In addition to those, you can use substitutions listed below. The `[file]` placeholder is replaced with the filename of the original file. We recommend __only using the `[file]` placeholder__, as the other placeholders won't work when generating SourceMaps for non-chunk files.

| Template                   | Description                                                                         |
| -------------------------- | ----------------------------------------------------------------------------------- |
| [file]                     | The module filename                                                                 |
| [filebase]                 | The module [basename](https://nodejs.org/api/path.html#path_path_basename_path_ext) |


## `output.sourcePrefix`

`string = ''`

Change the prefix for each line in the output bundles.

__webpack.config.js__

```javascript
module.exports = {
  //...
  output: {
    sourcePrefix: '\t'
  }
};
```

T> Using some kind of indentation makes bundles look prettier, but will cause issues with multi-line strings.

T> Typically you don't need to change `output.sourcePrefix`.


## `output.strictModuleExceptionHandling`

`boolean = false`

Tell webpack to remove a module from the module instance cache (`require.cache`) if it throws an exception when it is `require`d.

It defaults to `false` for performance reasons.

When set to `false`, the module is not removed from cache, which results in the exception getting thrown only on the first `require` call (making it incompatible with node.js).

For instance, consider `module.js`:

```javascript
throw new Error('error');
```

With `strictModuleExceptionHandling` set to `false`, only the first `require` throws an exception:

```javascript
// with strictModuleExceptionHandling = false
require('module'); // <- throws
require('module'); // <- doesn't throw
```

Instead, with `strictModuleExceptionHandling` set to `true`, all `require`s of this module throw an exception:

```javascript
// with strictModuleExceptionHandling = true
require('module'); // <- throws
require('module'); // <- also throws
```


## `output.umdNamedDefine`

`boolean`

When using `libraryTarget: "umd"`, setting `output.umdNamedDefine` to `true` will name the AMD module of the UMD build. Otherwise an anonymous `define` is used.

```javascript
module.exports = {
  //...
  output: {
    umdNamedDefine: true
  }
};
```

## `output.futureEmitAssets`

`boolean = false`

Tells webpack to use the future version of asset emitting logic, which allows freeing memory of assets after emitting. It could break plugins which assume that assets are still readable after they were emitted.

W> `output.futureEmitAssets` option will be removed in webpack v5.0.0 and this behaviour will become the new default.

```javascript
module.exports = {
  //...
  output: {
    futureEmitAssets: true
  }
};
```
