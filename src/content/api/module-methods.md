---
title: Module Methods
group: Modules
sort: 7
contributors:
  - skipjack
  - sokra
  - fadysamirsadek
  - byzyk
  - debs-obrien
  - wizardofhogwarts
  - EugeneHlushko
  - fokusferit
related:
  - title: CommonJS Wikipedia
    url: https://en.wikipedia.org/wiki/CommonJS
  - title: Asynchronous Module Definition
    url: https://en.wikipedia.org/wiki/Asynchronous_module_definition
---

This section covers all methods available in code compiled with webpack. When using webpack to bundle your application, you can pick from a variety of module syntax styles including [ES6](https://en.wikipedia.org/wiki/ECMAScript#6th_Edition_-_ECMAScript_2015), [CommonJS](https://en.wikipedia.org/wiki/CommonJS), and [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition).

W> While webpack supports multiple module syntaxes, we recommend following a single syntax for consistency and to avoid odd behaviors/bugs. Here's [one example](https://github.com/webpack/webpack.js.org/issues/552) of mixing ES6 and CommonJS, but there are surely others.


## ES6 (Recommended)

Version 2 of webpack supports ES6 module syntax natively, meaning you can use `import` and `export` without a tool like babel to handle this for you. Keep in mind that you will still probably need babel for other ES6+ features. The following methods are supported by webpack:


### `import`

Statically `import` the `export`s of another module.

``` javascript
import MyModule from './my-module.js';
import { NamedExport } from './other-module.js';
```

W> The keyword here is __statically__. A normal `import` statement cannot be used dynamically within other logic or contain variables. See the [spec](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) for more information and `import()` below for dynamic usage.


### `export`

Export anything as a `default` or named export.

``` javascript
// Named exports
export var Count = 5;
export function Multiply(a, b) {
  return a * b;
}

// Default export
export default {
  // Some data...
};
```


### `import()`

`function(string path):Promise`

Dynamically load modules. Calls to `import()` are treated as split points, meaning the requested module and its children are split out into a separate chunk.

T> The [ES2015 Loader spec](https://whatwg.github.io/loader/) defines `import()` as method to load ES2015 modules dynamically on runtime.


``` javascript
if ( module.hot ) {
  import('lodash').then(_ => {
    // Do something with lodash (a.k.a '_')...
  });
}
```

W> This feature relies on [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) internally. If you use `import()` with older browsers, remember to shim `Promise` using a polyfill such as [es6-promise](https://github.com/stefanpenner/es6-promise) or [promise-polyfill](https://github.com/taylorhakes/promise-polyfill).


### Dynamic expressions in import()

It is not possible to use a fully dynamic import statement, such as `import(foo)`. Because `foo` could potentially be any path to any file in your system or project.

The `import()` must contain at least some information about where the module is located. Bundling can be limited to a specific directory or set of files so that when you are using a dynamic expression - every module that could potentially be requested on an `import()` call is included. For example, ``import(`./locale/${language}.json`)`` will cause every `.json` file in the `./locale` directory to be bundled into the new chunk. At run time, when the variable `language` has been computed, any file like `english.json` or `german.json` will be available for consumption.


```javascript
// imagine we had a method to get language from cookies or other storage
const language = detectVisitorLanguage();
import(`./locale/${language}.json`).then(module => {
  // do something with the translations
});
```

T> Using the [`webpackInclude` and `webpackExclude`](/api/module-methods/#magic-comments) options allows you to add regex patterns that reduce the number of files that webpack will bundle for this import.

#### Magic Comments

Inline comments to make features work. By adding comments to the import, we can do things such as name our chunk or select different modes. For a full list of these magic comments see the code below followed by an explanation of what these comments do.

``` js
// Single target
import(
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  'module'
);

// Multiple possible targets
import(
  /* webpackInclude: /\.json$/ */
  /* webpackExclude: /\.noimport\.json$/ */
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  /* webpackPrefetch: true */
  /* webpackPreload: true */
  `./locale/${language}`
);
```

```js
import(/* webpackIgnore: true */ 'ignored-module.js');
```

`webpackIgnore`: Disables dynamic import parsing when set to `true`.

W> Note that setting `webpackIgnore` to `true` opts out of code splitting.

`webpackChunkName`: A name for the new chunk. Since webpack 2.6.0, the placeholders `[index]` and `[request]` are supported within the given string to an incremented number or the actual resolved filename respectively. Adding this comment will cause our separate chunk to be named [my-chunk-name].js instead of [id].js.

`webpackMode`: Since webpack 2.6.0, different modes for resolving dynamic imports can be specified. The following options are supported:

- `"lazy"` (default): Generates a lazy-loadable chunk for each `import()`ed module.
- `"lazy-once"`: Generates a single lazy-loadable chunk that can satisfy all calls to `import()`. The chunk will be fetched on the first call to `import()`, and subsequent calls to `import()` will use the same network response. Note that this only makes sense in the case of a partially dynamic statement, e.g. ``import(`./locales/${language}.json`)``, where there are multiple module paths that could potentially be requested.
- `"eager"`: Generates no extra chunk. All modules are included in the current chunk and no additional network requests are made. A `Promise` is still returned but is already resolved. In contrast to a static import, the module isn't executed until the call to `import()` is made.
- `"weak"`: Tries to load the module if the module function has already been loaded in some other way (e.g. another chunk imported it or a script containing the module was loaded). A `Promise` is still returned, but only successfully resolves if the chunks are already on the client. If the module is not available, the `Promise` is rejected. A network request will never be performed. This is useful for universal rendering when required chunks are always manually served in initial requests (embedded within the page), but not in cases where app navigation will trigger an import not initially served.

`webpackPrefetch`: Tells the browser that the resource is probably needed for some navigation in the future. Check out the guide for more information on [how webpackPrefetch works](/guides/code-splitting/#prefetchingpreloading-modules).

`webpackPreload`: Tells the browser that the resource might be needed during the current navigation. Check out the guide for more information on [how webpackPreload works](/guides/code-splitting/#prefetchingpreloading-modules).

T> Note that all options can be combined like so `/* webpackMode: "lazy-once", webpackChunkName: "all-i18n-data" */`. This is wrapped in a JavaScript object and executed using [node VM](https://nodejs.org/dist/latest-v8.x/docs/api/vm.html). You do not need to add curly brackets.

`webpackInclude`: A regular expression that will be matched against during import resolution. Only modules that match __will be bundled__.

`webpackExclude`: A regular expression that will be matched against during import resolution. Any module that matches __will not be bundled__.

T> Note that `webpackInclude` and `webpackExclude` options do not interfere with the prefix. eg: `./locale`.

W> The use of `System.import` in webpack [did not fit the proposed spec](https://github.com/webpack/webpack/issues/2163), so it was deprecated in webpack [2.1.0-beta.28](https://github.com/webpack/webpack/releases/tag/v2.1.0-beta.28) in favor of `import()`.


## CommonJS

The goal of CommonJS is to specify an ecosystem for JavaScript outside the browser. The following CommonJS methods are supported by webpack:


### `require`

``` javascript
require(dependency: String);
```

Synchronously retrieve the exports from another module. The compiler will ensure that the dependency is available in the output bundle.

``` javascript
var $ = require('jquery');
var myModule = require('my-module');
```

W> Using it asynchronously may not have the expected effect.


### `require.resolve`

``` javascript
require.resolve(dependency: String);
```

Synchronously retrieve a module's ID. The compiler will ensure that the dependency is available in the output bundle. See [`module.id`](/api/module-variables#moduleid-commonjs) for more information.

W> Module ID is a number in webpack (in contrast to NodeJS where it is a string -- the filename).


### `require.cache`

Multiple requires of the same module result in only one module execution and only one export. Therefore a cache in the runtime exists. Removing values from this cache causes new module execution and a new export.

W> This is only needed in rare cases for compatibility!

``` javascript
var d1 = require('dependency');
require('dependency') === d1;
delete require.cache[require.resolve('dependency')];
require('dependency') !== d1;
```

``` javascript
// in file.js
require.cache[module.id] === module;
require('./file.js') === module.exports;
delete require.cache[module.id];
require.cache[module.id] === undefined;
require('./file.js') !== module.exports; // in theory; in praxis this causes a stack overflow
require.cache[module.id] !== module;
```


### `require.ensure`

W> `require.ensure()` is specific to webpack and superseded by `import()`.

<!-- eslint-skip -->

```js
require.ensure(
  dependencies: String[],
  callback: function(require),
  errorCallback: function(error),
  chunkName: String
)
```

Split out the given `dependencies` to a separate bundle that will be loaded asynchronously. When using CommonJS module syntax, this is the only way to dynamically load dependencies. Meaning, this code can be run within execution, only loading the `dependencies` if certain conditions are met.

W> This feature relies on [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) internally. If you use `require.ensure` with older browsers, remember to shim `Promise` using a polyfill such as [es6-promise](https://github.com/stefanpenner/es6-promise) or [promise-polyfill](https://github.com/taylorhakes/promise-polyfill).

``` javascript
var a = require('normal-dep');

if ( module.hot ) {
  require.ensure(['b'], function(require) {
    var c = require('c');

    // Do something special...
  });
}
```

The following parameters are supported in the order specified above:

- `dependencies`: An array of strings declaring all modules required for the code in the `callback` to execute.
- `callback`: A function that webpack will execute once the dependencies are loaded. An implementation of the `require` function is sent as a parameter to this function. The function body can use this to further `require()` modules it needs for execution.
- `errorCallback`: A function that is executed when webpack fails to load the dependencies.
- `chunkName`: A name given to the chunk created by this particular `require.ensure()`. By passing the same `chunkName` to various `require.ensure()` calls, we can combine their code into a single chunk, resulting in only one bundle that the browser must load.

W> Although the implementation of `require` is passed as an argument to the `callback` function, using an arbitrary name e.g. `require.ensure([], function(request) { request('someModule'); })` isn't handled by webpack's static parser. Use `require` instead, e.g. `require.ensure([], function(require) { require('someModule'); })`.



## AMD

Asynchronous Module Definition (AMD) is a JavaScript specification that defines an interface for writing and loading modules. The following AMD methods are supported by webpack:


### `define` (with factory)

<!-- eslint-skip -->

```js
define([name: String], [dependencies: String[]], factoryMethod: function(...))
```

If `dependencies` are provided, `factoryMethod` will be called with the exports of each dependency (in the same order). If `dependencies` are not provided, `factoryMethod` is called with `require`, `exports` and `module` (for compatibility!). If this function returns a value, this value is exported by the module. The compiler ensures that each dependency is available.

W> Note that webpack ignores the `name` argument.

``` javascript
define(['jquery', 'my-module'], function($, myModule) {
  // Do something with $ and myModule...

  // Export a function
  return function doSomething() {
    // ...
  };
});
```

W> This CANNOT be used in an asynchronous function.


### `define` (with value)

<!-- eslint-skip -->

```js
define(value: !Function)
```

This will export the provided `value`. The `value` here can be anything except a function.

``` javascript
define({
  answer: 42
});
```

W> This CANNOT be used in an async function.


### `require` (amd-version)

<!-- eslint-skip -->

```js
require(dependencies: String[], [callback: function(...)])
```

Similar to `require.ensure`, this will split the given `dependencies` into a separate bundle that will be loaded asynchronously. The `callback` will be called with the exports of each dependency in the `dependencies` array.

W> This feature relies on [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) internally. If you use AMD with older browsers (e.g. Internet Explorer 11), remember to shim `Promise` using a polyfill such as [es6-promise](https://github.com/stefanpenner/es6-promise) or [promise-polyfill](https://github.com/taylorhakes/promise-polyfill).

``` javascript
require(['b'], function(b) {
  var c = require('c');
});
```

W> There is no option to provide a chunk name.



## Labeled Modules

The internal `LabeledModulesPlugin` enables you to use the following methods for exporting and requiring within your modules:


### `export` label

Export the given `value`. The label can occur before a function declaration or a variable declaration. The function name or variable name is the identifier under which the value is exported.

<!-- eslint-skip -->

```js
export: var answer = 42;
export: function method(value) {
  // Do something...
};
```

W> Using it in an async function may not have the expected effect.


### `require` label

Make all exports from the dependency available in the current scope. The `require` label can occur before a string. The dependency must export values with the `export` label. CommonJS or AMD modules cannot be consumed.

__some-dependency.js__

<!-- eslint-skip -->

```js
export: var answer = 42;
export: function method(value) {
  // Do something...
};
```

<!-- eslint-skip -->

```js
require: 'some-dependency';
console.log(answer);
method(...);
```



## Webpack

Aside from the module syntaxes described above, webpack also allows a few custom, webpack-specific methods:


### `require.context`

<!-- eslint-skip -->

```js
require.context(
  directory: String,
  includeSubdirs: Boolean /* optional, default true */,
  filter: RegExp /* optional, default /^\.\/.*$/, any file */,
  mode: String  /* optional, 'sync' | 'eager' | 'weak' | 'lazy' | 'lazy-once', default 'sync' */
)
```

Specify a whole group of dependencies using a path to the `directory`, an option to `includeSubdirs`, a `filter` for more fine grained control of the modules included, and a `mode` to define the way how loading will work. Underlying modules can then be resolved later on:

```javascript
var context = require.context('components', true, /\.html$/);
var componentA = context.resolve('componentA');
```

If `mode` is specified as "lazy", the underlying modules will be loaded asynchronously:

```javascript
var context = require.context('locales', true, /\.json$/, 'lazy');
context('localeA').then(locale => {
  // do something with locale
});
```

The full list of available modes and its behavior is described in [`import()`](#import-1) documentation.

### `require.include`

<!-- eslint-skip -->

```js
require.include(dependency: String)
```

Include a `dependency` without executing it. This can be used for optimizing the position of a module in the output chunks.

``` javascript
require.include('a');
require.ensure(['a', 'b'], function(require) { /* ... */ });
require.ensure(['a', 'c'], function(require) { /* ... */ });
```

This will result in the following output:

- entry chunk: `file.js` and `a`
- anonymous chunk: `b`
- anonymous chunk: `c`

Without `require.include('a')` it would be duplicated in both anonymous chunks.


### `require.resolveWeak`

Similar to `require.resolve`, but this won't pull the `module` into the bundle. It's what is considered a "weak" dependency.

``` javascript
if(__webpack_modules__[require.resolveWeak('module')]) {
  // Do something when module is available...
}
if(require.cache[require.resolveWeak('module')]) {
  // Do something when module was loaded before...
}

// You can perform dynamic resolves ("context")
// just as with other require/import methods.
const page = 'Foo';
__webpack_modules__[require.resolveWeak(`./page/${page}`)];
```

T> `require.resolveWeak` is the foundation of _universal rendering_ (SSR + Code Splitting), as used in packages such as [react-universal-component](https://github.com/faceyspacey/react-universal-component). It allows code to render synchronously on both the server and initial page-loads on the client. It requires that chunks are manually served or somehow available. It's able to require modules without indicating they should be bundled into a chunk. It's used in conjunction with `import()` which takes over when user navigation triggers additional imports.
