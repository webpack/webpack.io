---
title: Loader Interface
sort: 5
contributors:
  - TheLarkInn
  - jhnns
  - tbroadley
  - byzyk
  - sokra
  - EugeneHlushko
  - jantimon
  - superburrito
  - wizardofhogwarts
  - fokusferit
---

A loader is a JavaScript module that exports a function. The [loader runner](https://github.com/webpack/loader-runner) calls this function and passes the result of the previous loader or the resource file into it. The `this` context of the function is filled-in by webpack and the [loader runner](https://github.com/webpack/loader-runner) with some useful methods that allow the loader (among other things) to change its invocation style to async, or get query parameters.

The first loader is passed one argument: the content of the resource file. The compiler expects a result from the last loader. The result should be a `String` or a `Buffer` (which is converted to a string), representing the JavaScript source code of the module. An optional SourceMap result (as a JSON object) may also be passed.

A single result can be returned in __sync mode__. For multiple results the `this.callback()` must be called. In __async mode__ `this.async()` must be called to indicate that the [loader runner](https://github.com/webpack/loader-runner) should wait for an asynchronous result. It returns `this.callback()`. Then the loader must return `undefined` and call that callback.


## Examples

The following sections provide some basic examples of the different types of loaders. Note that the `map` and `meta` parameters are optional, see [`this.callback`](#thiscallback) below.

### Synchronous Loaders

Either `return` or `this.callback` can be used to return the transformed `content` synchronously:

__sync-loader.js__

``` javascript
module.exports = function(content, map, meta) {
  return someSyncOperation(content);
};
```

The `this.callback` method is more flexible as you pass multiple arguments instead of using `content` only.

__sync-loader-with-multiple-results.js__

``` javascript
module.exports = function(content, map, meta) {
  this.callback(null, someSyncOperation(content), map, meta);
  return; // always return undefined when calling callback()
};
```

### Asynchronous Loaders

For asynchronous loaders, [`this.async`](#thisasync) is used to retrieve the `callback` function:

__async-loader.js__

``` javascript
module.exports = function(content, map, meta) {
  var callback = this.async();
  someAsyncOperation(content, function(err, result) {
    if (err) return callback(err);
    callback(null, result, map, meta);
  });
};
```

__async-loader-with-multiple-results.js__

``` javascript
module.exports = function(content, map, meta) {
  var callback = this.async();
  someAsyncOperation(content, function(err, result, sourceMaps, meta) {
    if (err) return callback(err);
    callback(null, result, sourceMaps, meta);
  });
};
```

T> Loaders were originally designed to work in synchronous loader pipelines, like Node.js (using [enhanced-require](https://github.com/webpack/enhanced-require)), _and_ asynchronous pipelines, like in webpack. However, since expensive synchronous computations are a bad idea in a single-threaded environment like Node.js, we advise making your loader asynchronous if possible. Synchronous loaders are ok if the amount of computation is trivial.


### "Raw" Loader

By default, the resource file is converted to a UTF-8 string and passed to the loader. By setting the `raw` flag, the loader will receive the raw `Buffer`. Every loader is allowed to deliver its result as `String` or as `Buffer`. The compiler converts them between loaders.

__raw-loader.js__

``` javascript
module.exports = function(content) {
  assert(content instanceof Buffer);
  return someSyncOperation(content);
  // return value can be a `Buffer` too
  // This is also allowed if loader is not "raw"
};
module.exports.raw = true;
```


### Pitching Loader

Loaders are __always__ called from right to left. There are some instances where the loader only cares about the __metadata__ behind a request and can ignore the results of the previous loader. The `pitch` method on loaders is called from __left to right__ before the loaders are actually executed (from right to left).

T> Loaders may be added inline in requests and turned off via inline prefixes, which will impact the order in which they are "pitched" and executed. See [`Rule.enforce`](/configuration/module#ruleenforce) for more details.

For the following configuration of [`use`](/configuration/module#ruleuse):

``` javascript
module.exports = {
  //...
  module: {
    rules: [
      {
        //...
        use: [
          'a-loader',
          'b-loader',
          'c-loader'
        ]
      }
    ]
  }
};
```

These steps would occur:

``` diff
|- a-loader `pitch`
  |- b-loader `pitch`
    |- c-loader `pitch`
      |- requested module is picked up as a dependency
    |- c-loader normal execution
  |- b-loader normal execution
|- a-loader normal execution
```

So why might a loader take advantage of the "pitching" phase?

First, the `data` passed to the `pitch` method is exposed in the execution phase as well under `this.data` and could be useful for capturing and sharing information from earlier in the cycle.

``` javascript
module.exports = function(content) {
  return someSyncOperation(content, this.data.value);
};

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  data.value = 42;
};
```

Second, if a loader delivers a result in the `pitch` method, the process turns around and skips the remaining loaders. In our example above, if the `b-loader`s `pitch` method returned something:

``` javascript
module.exports = function(content) {
  return someSyncOperation(content);
};

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  if (someCondition()) {
    return 'module.exports = require(' + JSON.stringify('-!' + remainingRequest) + ');';
  }
};
```

The steps above would be shortened to:

``` diff
|- a-loader `pitch`
  |- b-loader `pitch` returns a module
|- a-loader normal execution
```

See the [bundle-loader](https://github.com/webpack-contrib/bundle-loader) for a good example of how this process can be used in a more meaningful way.


## The Loader Context

The loader context represents the properties that are available inside of a loader assigned to the `this` property.

Given the following example, this require call is used:

In `/abc/file.js`:

``` javascript
require('./loader1?xyz!loader2!./resource?rrr');
```


### `this.version`

__Loader API version.__ Currently `2`. This is useful for providing backwards compatibility. Using the version you can specify custom logic or fallbacks for breaking changes.


### `this.context`

__The directory of the module.__ Can be used as a context for resolving other stuff.

In the example: `/abc` because `resource.js` is in this directory


### `this.rootContext`

Starting with webpack 4, the formerly `this.options.context` is provided as `this.rootContext`.


### `this.request`

The resolved request string.

In the example: `"/abc/loader1.js?xyz!/abc/node_modules/loader2/index.js!/abc/resource.js?rrr"`


### `this.query`

1. If the loader was configured with an [`options`](/configuration/module/#useentry) object, this will point to that object.
2. If the loader has no `options`, but was invoked with a query string, this will be a string starting with `?`.

T> Use the [`getOptions` method](https://github.com/webpack/loader-utils#getoptions) from `loader-utils` to extract given loader options.


### `this.callback`

A function that can be called synchronously or asynchronously in order to return multiple results. The expected arguments are:

<!-- eslint-skip -->

``` javascript
this.callback(
  err: Error | null,
  content: string | Buffer,
  sourceMap?: SourceMap,
  meta?: any
);
```

1. The first argument must be an `Error` or `null`
2. The second argument is a `string` or a [`Buffer`](https://nodejs.org/api/buffer.html).
3. Optional: The third argument must be a source map that is parsable by [this module](https://github.com/mozilla/source-map).
4. Optional: The fourth option, ignored by webpack, can be anything (e.g. some metadata).

T> It can be useful to pass an abstract syntax tree (AST), like [`ESTree`](https://github.com/estree/estree), as the fourth argument (`meta`) to speed up the build time if you want to share common ASTs between loaders.

In case this function is called, you should return undefined to avoid ambiguous loader results.


### `this.async`

Tells the [loader-runner](https://github.com/webpack/loader-runner) that the loader intends to call back asynchronously. Returns `this.callback`.


### `this.data`

A data object shared between the pitch and the normal phase.


### `this.cacheable`

A function that sets the cacheable flag:

``` typescript
cacheable(flag = true: boolean)
```

By default, loader results are flagged as cacheable. Call this method passing `false` to make the loader's result not cacheable.

A cacheable loader must have a deterministic result when inputs and dependencies haven't changed. This means the loader shouldn't have dependencies other than those specified with `this.addDependency`.


### `this.loaders`

An array of all the loaders. It is writable in the pitch phase.

<!-- eslint-skip -->

``` javascript
loaders = [{request: string, path: string, query: string, module: function}]
```

In the example:

``` javascript
[
  {
    request: '/abc/loader1.js?xyz',
    path: '/abc/loader1.js',
    query: '?xyz',
    module: [Function]
  },
  {
    request: '/abc/node_modules/loader2/index.js',
    path: '/abc/node_modules/loader2/index.js',
    query: '',
    module: [Function]
  }
];
```


### `this.loaderIndex`

The index in the loaders array of the current loader.

In the example: in loader1: `0`, in loader2: `1`


### `this.resource`

The resource part of the request, including query.

In the example: `"/abc/resource.js?rrr"`


### `this.resourcePath`

The resource file.

In the example: `"/abc/resource.js"`


### `this.resourceQuery`

The query of the resource.

In the example: `"?rrr"`


### `this.target`

Target of compilation. Passed from configuration options.

Example values: `"web"`, `"node"`


### `this.webpack`

This boolean is set to true when this is compiled by webpack.

T> Loaders were originally designed to also work as Babel transforms. Therefore, if you write a loader that works for both, you can use this property to know if there is access to additional loaderContext and webpack features.


### `this.sourceMap`

Tells if source map should be generated. Since generating source maps can be an expensive task, you should check if source maps are actually requested.


### `this.emitWarning`

``` typescript
emitWarning(warning: Error)
```

Emit a warning that will be displayed in the output like the following:

``` bash
WARNING in ./src/lib.js (./src/loader.js!./src/lib.js)
Module Warning (from ./src/loader.js):
Here is a Warning!
 @ ./src/index.js 1:0-25
 ```

T> Note that the warnings will not be displayed if `stats.warnings` is set to `false`, or some other omit setting is used to `stats` such as `none` or `errors-only`. See the [stats configuration](/configuration/stats/#stats).

### `this.emitError`

``` typescript
emitError(error: Error)
```

Emit an error that also can be displayed in the output.

``` bash
ERROR in ./src/lib.js (./src/loader.js!./src/lib.js)
Module Error (from ./src/loader.js):
Here is an Error!
 @ ./src/index.js 1:0-25
```

T> Unlike throwing an Error directly, it will NOT interrupt the compilation process of the current module.


### `this.loadModule`

``` typescript
loadModule(request: string, callback: function(err, source, sourceMap, module))
```

Resolves the given request to a module, applies all configured loaders and calls back with the generated source, the sourceMap and the module instance (usually an instance of [`NormalModule`](https://github.com/webpack/webpack/blob/master/lib/NormalModule.js)). Use this function if you need to know the source code of another module to generate the result.


### `this.resolve`

``` typescript
resolve(context: string, request: string, callback: function(err, result: string))
```

Resolve a request like a require expression.


### `this.addDependency`

``` typescript
addDependency(file: string)
dependency(file: string) // shortcut
```

Add a file as dependency of the loader result in order to make them watchable. For example, [`html-loader`](https://github.com/webpack-contrib/html-loader) uses this technique as it finds `src` and `src-set` attributes. Then, it sets the URLs for those attributes as dependencies of the html file that is parsed.


### `this.addContextDependency`

``` typescript
addContextDependency(directory: string)
```

Add a directory as dependency of the loader result.


### `this.clearDependencies`

``` typescript
clearDependencies()
```

Remove all dependencies of the loader result, even initial dependencies and those of other loaders. Consider using `pitch`.


### `this.emitFile`

``` typescript
emitFile(name: string, content: Buffer|string, sourceMap: {...})
```

Emit a file. This is webpack-specific.


### `this.fs`

Access to the `compilation`'s `inputFileSystem` property.


### `this.mode`

Read in which [`mode`](/configuration/mode/) webpack is running.

Possible values: `'production'`, `'development'`, `'none'`


## Deprecated context properties

W> The usage of these properties is highly discouraged since we are planning to remove them from the context. They are still listed here for documentation purposes.


### `this.exec`

``` typescript
exec(code: string, filename: string)
```

Execute some code fragment like a module. See [this comment](https://github.com/webpack/webpack.js.org/issues/1268#issuecomment-313513988) for a replacement method if needed.


### `this.resolveSync`

``` typescript
resolveSync(context: string, request: string) -> string
```

Resolve a request like a require expression.


### `this.value`

Pass values to the next loader. If you know what your result exports if executed as a module, set this value here (as an only element array).


### `this.inputValue`

Passed from the last loader. If you would execute the input argument as a module, consider reading this variable for a shortcut (for performance).


### `this.options`

W> The `options` property has been deprecated in webpack 3 and removed in webpack 4.


### `this.debug`

A boolean flag. It is set when in debug mode.


### `this.minimize`

Tells if result should be minimized.


### `this._compilation`

Hacky access to the Compilation object of webpack.


### `this._compiler`

Hacky access to the Compiler object of webpack.


### `this._module`

Hacky access to the Module object being loaded.


## Error Reporting

You can report errors from inside a loader by:

- Using [this.emitError](/api/loaders/#thisemiterror). Will report the errors without interrupting module's compilation.
- Using `throw` (or other uncaught exception). Throwing an error while a loader is running will cause current module compilation failure.
- Using `callback` (in async mode). Pass an error to the callback will also cause module compilation failure.

For example:

__./src/index.js__

``` javascript
require('./loader!./lib');
```

Throwing an error from loader:

__./src/loader.js__

``` javascript
module.exports = function(source) {
  throw new Error('This is a Fatal Error!');
};
```

Or pass an error to the callback in async mode:

__./src/loader.js__

``` javascript
module.exports = function(source) {
  const callback = this.async();
  //...
  callback(new Error('This is a Fatal Error!'), source);
};
```

The module will get bundled like this:

<!-- eslint-skip -->

``` javascript
/***/ "./src/loader.js!./src/lib.js":
/*!************************************!*\
  !*** ./src/loader.js!./src/lib.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./src/loader.js):\nError: This is a Fatal Error!\n    at Object.module.exports (/workspace/src/loader.js:3:9)");

/***/ })
```

Then the build output will also display the error (Similar to `this.emitError`):

``` bash
ERROR in ./src/lib.js (./src/loader.js!./src/lib.js)
Module build failed (from ./src/loader.js):
Error: This is a Fatal Error!
    at Object.module.exports (/workspace/src/loader.js:2:9)
 @ ./src/index.js 1:0-25
```

As you can see below, not only error message, but also details about which loader and module are involved:

- the module path: `ERROR in ./src/lib.js`
- the request string: `(./src/loader.js!./src/lib.js)`
- the loader path: `(from ./src/loader.js)`
- the caller path: `@ ./src/index.js 1:0-25`

W> The loader path in the error is displayed since webpack 4.12

T> All the errors and warnings will be recorded into `stats`. Please see [Stats Data](/api/stats/#errors-and-warnings).


### Inline matchResource

A new inline request syntax was introduced in webpack v4. Prefixing `<match-resource>!=!` to a request will set the `matchResource` for this request.

W> It is not recommended to use this syntax in application code.
Inline request syntax is intended to only be used by loader generated code.
Not following this recommendation will make your code webpack-specific and non-standard.

T> A relative `matchResource` will resolve relative to the current context of the containing module.

When a `matchResource` is set, it will be used to match with the [`module.rules`](/configuration/module/#modulerules) instead of the original resource. This can be useful if further loaders should be applied to the resource, or if the module type needs to be changed. It's also displayed in the stats and used for matching [`Rule.issuer`](/configuration/module/#ruleissuer) and [`test` in `splitChunks`](/plugins/split-chunks-plugin/#splitchunkscachegroupscachegrouptest).

Example:

__file.js__

```javascript
/* STYLE: body { background: red; } */
console.log('yep');
```

A loader could transform the file into the following file and use the `matchResource` to apply the user-specified CSS processing rules:

__file.js__ (transformed by loader)

```javascript
import './file.js.css!=!extract-style-loader/getStyles!./file.js';
console.log('yep');
```

This will add a dependency to `extract-style-loader/getStyles!./file.js` and treat the result as `file.js.css`. Because [`module.rules`](/configuration/module/#modulerules) has a rule matching `/\.css$/` and it will apply to this dependency.

The loader could look like this:

__extract-style-loader/index.js__

```javascript
const stringifyRequest = require('loader-utils').stringifyRequest;
const getRemainingRequest = require('loader-utils').getRemainingRequest;
const getStylesLoader = require.resolve('./getStyle');

module.exports = function (source) {
  if (STYLES_REGEXP.test(source)) {
    source = source.replace(STYLES_REGEXP, '');
    const remReq = getRemainingRequest(this);
    return `import ${stringifyRequest(`${this.resource}.css!=!${getStylesLoader}!${remReq}`)};${source}`;
  }
  return source;
};
```

__extract-style-loader/getStyles.js__

```javascript
module.exports = function(source) {
  const match = STYLES_REGEXP.match(source);
  return match[0];
};
```

## Logging

Logging API is available since the release of webpack 4.37. When `logging` is enabled in [`stats configuration`](/configuration/stats/#statslogging) and/or when [`infrastructure logging`](/configuration/other-options/#infrastructurelogging) is enabled, loaders may log messages which will be printed out in the respective logger format (stats, infrastructure).

- Loaders should prefer to use `this.getLogger()` for logging which is a shortcut to `compilation.getLogger()` with loader path and processed file. This kind of logging is stored to the Stats and formatted accordingly. It can be filtered and exported by the webpack user.
- Loaders may use `this.getLogger('name')` to get an independent logger with a child name. Loader path and processed file is still added.
- Loaders may use specific fallback logic for detecting logging support `this.getLogger() ? this.getLogger() : console` to provide a fallback when an older webpack version is used which does not support `getLogger` method.
