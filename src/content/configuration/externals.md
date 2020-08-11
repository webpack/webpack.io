---
title: Externals
sort: 15
contributors:
  - sokra
  - skipjack
  - pksjce
  - fadysamirsadek
  - byzyk
  - zefman
  - Mistyyyy
  - jamesgeorge007
  - tanhauhau
  - snitin315
  - beejunk
  - EugeneHlushko
  - chenxsan
---

The `externals` configuration option provides a way of excluding dependencies from the output bundles. Instead, the created bundle relies on that dependency to be present in the consumer's (any end-user application) environment. This feature is typically most useful to __library developers__, however there are a variety of applications for it.


## `externals`

`string` `[string]` `object` `function`  `RegExp`

__Prevent bundling__ of certain `import`ed packages and instead retrieve these _external dependencies_ at runtime.

For example, to include [jQuery](https://jquery.com/) from a CDN instead of bundling it:

__index.html__

``` html
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous">
</script>
```

__webpack.config.js__

```javascript
module.exports = {
  //...
  externals: {
    jquery: 'jQuery'
  }
};
```

This leaves any dependent modules unchanged, i.e. the code shown below will still work:

```javascript
import $ from 'jquery';

$('.my-element').animate(/* ... */);
```

The bundle with external dependencies can be used in various module contexts, such as [CommonJS, AMD, global and ES2015 modules](/concepts/modules). The external library may be available in any of these forms:

- __root__: The library should be available as a global variable (e.g. via a script tag).
- __commonjs__: The library should be available as a CommonJS module.
- __commonjs2__: Similar to the above but where the export is `module.exports.default`.
- __amd__: Similar to `commonjs` but using AMD module system.

The following syntaxes are accepted...


### string

See the example above. The property name `jquery` indicates that the module `jquery` in `import $ from 'jquery'` should be excluded. In order to replace this module, the value `jQuery` will be used to retrieve a global `jQuery` variable. In other words, when a string is provided it will be treated as `root` (defined above and below).

On the other hand, if you want to externalise a library that is available as a CommonJS module, you can provide the external library type together with the library name.

For example, if you want to exclude `fs-extra` from the output bundle and import it during the runtime instead, you can specify it as follows:

```javascript
module.exports = {
  // ...
  externals: {
    'fs-extra': 'commonjs2 fs-extra',
  }
};
```

This leaves any dependent modules unchanged, i.e. the code shown below:

```javascript
import fs from 'fs-extra';
```

will compile to something like:

```javascript
const fs = require('fs-extra');
```

### [string]

```javascript
module.exports = {
  //...
  externals: {
    subtract: ['./math', 'subtract']
  }
};
```

`subtract: ['./math', 'subtract']` allows you select part of a commonjs module, where `./math` is the module and your bundle only requires the subset under the `subtract` variable. This example would translate to `require('./math').subtract;`

### object

W> An object with `{ root, amd, commonjs, ... }` is only allowed for [`libraryTarget: 'umd'`](/configuration/output/#outputlibrarytarget). It's not allowed for other library targets.

```javascript
module.exports = {
  //...
  externals : {
    react: 'react'
  },

  // or

  externals : {
    lodash : {
      commonjs: 'lodash',
      amd: 'lodash',
      root: '_' // indicates global variable
    }
  },

  // or

  externals : {
    subtract : {
      root: ['math', 'subtract']
    }
  }
};
```

This syntax is used to describe all the possible ways that an external library can be made available. `lodash` here is available as `lodash` under AMD and CommonJS module systems but available as `_` in a global variable form. `subtract` here is available via the property `subtract` under the global `math` object (e.g. `window['math']['subtract']`).


### function

`function (context, request, callback)`

It might be useful to define your own function to control the behavior of what you want to externalize from webpack. [webpack-node-externals](https://www.npmjs.com/package/webpack-node-externals), for example, excludes all modules from the `node_modules` directory and provides options to whitelist packages.

The function receives three arguments:

- `context` (`string`): The directory of the file which contains the import.
- `request` (`string`): The import path being requested.
- `callback` (`function (err, result, type)`): Callback function used to indicate how the module should be externalized.

The callback function takes three arguments:

- `err` (`Error`): Used to indicate if there has been an error while externalizing the import. If there is an error, this should be the only parameter used.
- `result` (`string` `[string]` `object`): Describes the external module. Can accept a string in the format `${type} ${path}`, or one of the other standard external formats ([`string`](#string), [`[string]`](#string-1), or [`object`](#object))
- `type` (`string`): Optional parameter that indicates the module type (if it has not already been indicated in the `result` parameter).

As an example, to externalize all imports where the import path matches a regular expression you could do the following:

__webpack.config.js__

```javascript
module.exports = {
  //...
  externals: [
    function(context, request, callback) {
      if (/^yourregex$/.test(request)){
        // Externalize to a commonjs module using the request path
        return callback(null, 'commonjs ' + request);
      }

      // Continue without externalizing the import
      callback();
    }
  ]
};
```

Other examples using different module formats:

__webpack.config.js__

```javascript
module.exports = {
  externals: [
    function(context, request, callback) {
      // The external is a `commonjs2` module located in `@scope/library`
      callback(null, '@scope/library', 'commonjs2');
    }
  ]
};
```

__webpack.config.js__

```javascript
module.exports = {
  externals: [
    function(context, request, callback) {
      // The external is a global variable called `nameOfGlobal`.
      callback(null, 'nameOfGlobal');
    }
  ]
};
```

__webpack.config.js__

```javascript
module.exports = {
  externals: [
    function(context, request, callback) {
      // The external is a named export in the `@scope/library` module.
      callback(null, ['@scope/library', 'namedexport'], 'commonjs');
    }
  ]
};
```

__webpack.config.js__

```javascript
module.exports = {
  externals: [
    function(context, request, callback) {
      // The external is a UMD module
      callback(null, {
        root: 'componentsGlobal',
        commonjs: '@scope/components',
        commonjs2: '@scope/components',
        amd: 'components'
      });
    }
  ]
};
```

### RegExp

Every dependency that matches the given regular expression will be excluded from the output bundles.

__webpack.config.js__

```javascript
module.exports = {
  //...
  externals: /^(jquery|\$)$/i
};
```

In this case, any dependency named `jQuery`, capitalized or not, or `$` would be externalized.

### Combining syntaxes

Sometimes you may want to use a combination of the above syntaxes. This can be done in the following manner:

__webpack.config.js__

```javascript
module.exports = {
  //...
  externals: [
    {
      // String
      react: 'react',
      // Object
      lodash : {
        commonjs: 'lodash',
        amd: 'lodash',
        root: '_' // indicates global variable
      },
      // [string]
      subtract: ['./math', 'subtract']
    },
    // Function
    function(context, request, callback) {
      if (/^yourregex$/.test(request)){
        return callback(null, 'commonjs ' + request);
      }
      callback();
    },
    // Regex
    /^(jquery|\$)$/i
  ]
};
```

W> [Default type](/configuration/externals/#externalstype) will be used if you specify `externals` without a type e.g. `externals: { react: 'react' }` instead of `externals: { react: 'commonjs-module react' }`.

For more information on how to use this configuration, please refer to the article on [how to author a library](/guides/author-libraries).


## `externalsType`

`string = 'var'`

Specifies the default type of externals. `amd`, `umd`, `system` and `jsonp` externals __depend on the [`output.libraryTarget`](/configuration/output/#outputlibrarytarget)__ being set to the same value e.g. you can only consume `amd` externals within an `amd` library.

Supported types:

- `'var'`
- `'module'`
- `'assign'`
- `'this'`
- `'window'`
- `'self'`
- `'global'`
- `'commonjs'`
- `'commonjs-module'`
- `'amd'`
- `'amd-require'`
- `'umd'`
- `'umd2'`
- `'jsonp'`
- `'system'`
- `'promise'` - same as `'var'` but awaits the result (async module)
- `'import'` - uses `import()` to load a native EcmaScript module (async module)
- `'script'` - load script exposing predefined global variables with HTML `<script>` element

__webpack.config.js__

```javascript
module.exports = {
  //...
  externalsType: 'promise'
};
```

### `script`

External script can be loaded from any URL when [`externalsType`](#externalstype) is set to `'script'`. The `<script>` tag would be removed after the script has been loaded.

#### Syntax

```javascript
module.exports = {
  externals: {
    packageName: ['http://example.com/script.js', 'global', 'property', 'property'] // properties are optional
  }
};
```

You can also use the shortcut syntax if you're not going to specify any properties:

```javascript
module.exports = {
  externals: {
    packageName: 'global@http://example.com/script.js' // no properties here
  }
};
```

T> [`output.publicPath`](/configuration/output/#outputpublicpath) won't be added to the provided URL.

#### Example

Let's load a `lodash` from CDN:

__webpack.config.js__

```js
module.exports = {
  // ...
  externalsType: 'script',
  externals: {
    lodash: ['https://cdn.jsdelivr.net/npm/lodash@4.17.19/lodash.min.js', '_'],
  }
};
```

Then use it in code:

```js
import _ from 'lodash';
console.log(_.head([1, 2, 3]));
```

Here's how we specify properties for the above example:

```js
module.exports = {
  // ...
  externalsType: 'script',
  externals: {
    lodash: ['https://cdn.jsdelivr.net/npm/lodash@4.17.19/lodash.min.js', '_', 'head'],
  }
};
```

Both local variable `head` and global `window._` will be exposed when you `import` `lodash`:

```js
import head from 'lodash';
console.log(head([1, 2, 3])); // logs 1 here
console.log(window._.head(['a', 'b'])); // logs a here
```

T> When loading code with HTML `<script>` tags, the webpack runtime will try to find an existing `<script>` tag that matches the `src` attribute or has a specific `data-webpack` attribute. For chunk loading `data-webpack` attribute would have value of `'[output.uniqueName]:chunk-[chunkId]'` while external script has value of `'[output.uniqueName]:[global]'`. 

T> Options like `output.chunkLoadTimeout`, `output.crossOriginLoading` and `output.scriptType` will also have effect on the external scripts loaded this way.
