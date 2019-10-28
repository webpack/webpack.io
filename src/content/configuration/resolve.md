---
title: Resolve
sort: 8
contributors:
  - sokra
  - skipjack
  - SpaceK33z
  - pksjce
  - sebastiandeutsch
  - tbroadley
  - byzyk
  - numb86
  - jgravois
  - EugeneHlushko
  - Aghassi
---

These options change how modules are resolved. webpack provides reasonable defaults, but it is possible to change the resolving in detail. Have a look at [Module Resolution](/concepts/module-resolution) for more explanation of how the resolver works.


## `resolve`

`object`

Configure how modules are resolved. For example, when calling `import 'lodash'` in ES2015, the `resolve` options can change where webpack goes to look for `'lodash'` (see [`modules`](#resolvemodules)).

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    // configuration options
  }
};
```


### `resolve.alias`

`object`

Create aliases to `import` or `require` certain modules with less effort. For example, to alias a bunch of commonly used `src/` folders:

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    alias: {
      Utilities: path.resolve(__dirname, 'src/utilities/'),
      Templates: path.resolve(__dirname, 'src/templates/')
    }
  }
};
```

Now, instead of using relative paths when importing like so:

```js
import Utility from '../../utilities/utility';
```

you can use the alias:

```js
import Utility from 'Utilities/utility';
```

A trailing `$` can also be added to the given object's keys to signify an exact match:

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    alias: {
      xyz$: path.resolve(__dirname, 'path/to/file.js')
    }
  }
};
```

which would yield these results:

```js
import Test1 from 'xyz'; // Exact match, so path/to/file.js is resolved and imported
import Test2 from 'xyz/file.js'; // Not an exact match, normal resolution takes place
```

The following table explains other cases:

| `alias:`                            | `import 'xyz'`                        | `import 'xyz/file.js'`              |
| ----------------------------------- | ------------------------------------- | ----------------------------------- |
| `{}`                                | `/abc/node_modules/xyz/index.js`      | `/abc/node_modules/xyz/file.js`     |
| `{ xyz: '/abs/path/to/file.js' }`   | `/abs/path/to/file.js`                | error                               |
| `{ xyz$: '/abs/path/to/file.js' }`  | `/abs/path/to/file.js`                | `/abc/node_modules/xyz/file.js`     |
| `{ xyz: './dir/file.js' }`          | `/abc/dir/file.js`                    | error                               |
| `{ xyz$: './dir/file.js' }`         | `/abc/dir/file.js`                    | `/abc/node_modules/xyz/file.js`     |
| `{ xyz: '/some/dir' }`              | `/some/dir/index.js`                  | `/some/dir/file.js`                 |
| `{ xyz$: '/some/dir' }`             | `/some/dir/index.js`                  | `/abc/node_modules/xyz/file.js`     |
| `{ xyz: './dir' }`                  | `/abc/dir/index.js`                   | `/abc/dir/file.js`                  |
| `{ xyz: 'modu' }`                   | `/abc/node_modules/modu/index.js`     | `/abc/node_modules/modu/file.js`    |
| `{ xyz$: 'modu' }`                  | `/abc/node_modules/modu/index.js`     | `/abc/node_modules/xyz/file.js`     |
| `{ xyz: 'modu/some/file.js' }`      | `/abc/node_modules/modu/some/file.js` | error                               |
| `{ xyz: 'modu/dir' }`               | `/abc/node_modules/modu/dir/index.js` | `/abc/node_modules/dir/file.js`     |
| `{ xyz: 'xyz/dir' }`                | `/abc/node_modules/xyz/dir/index.js`  | `/abc/node_modules/xyz/dir/file.js` |
| `{ xyz$: 'xyz/dir' }`               | `/abc/node_modules/xyz/dir/index.js`  | `/abc/node_modules/xyz/file.js`     |

`index.js` may resolve to another file if defined in the `package.json`.

`/abc/node_modules` may resolve in `/node_modules` too.

W> `resolve.alias` takes precedence over other module resolutions.


### `resolve.aliasFields`

`[string]: ['browser']`

Specify a field, such as `browser`, to be parsed according to [this specification](https://github.com/defunctzombie/package-browser-field-spec).

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    aliasFields: ['browser']
  }
};
```


### `resolve.cacheWithContext`

`boolean` (since webpack 3.1.0)

If unsafe cache is enabled, includes `request.context` in the cache key. This option is taken into account by the [`enhanced-resolve`](https://github.com/webpack/enhanced-resolve/) module. Since webpack 3.1.0 context in resolve caching is ignored when resolve or resolveLoader plugins are provided. This addresses a performance regression.


### `resolve.descriptionFiles`

`[string] = ['package.json']`

The JSON files to use for descriptions.

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    descriptionFiles: ['package.json']
  }
};
```


### `resolve.enforceExtension`

`boolean = false`

If `true`, it will not allow extension-less files. So by default `require('./foo')` works if `./foo` has a `.js` extension, but with this enabled only `require('./foo.js')` will work.

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    enforceExtension: false
  }
};
```


### `resolve.enforceModuleExtension`

`boolean = false`

W> Removed in webpack 5

Tells webpack whether to require to use an extension for modules (e.g. loaders).

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    enforceModuleExtension: false
  }
};
```


### `resolve.extensions`

`[string] = ['.wasm', '.mjs', '.js', '.json']`

Attempt to resolve these extensions in order.

W> If multiple files share the same name but have different extensions, webpack will resolve the one with the extension listed first in the array and skip the rest.

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    extensions: ['.wasm', '.mjs', '.js', '.json']
  }
};
```

which is what enables users to leave off the extension when importing:

```js
import File from '../path/to/file';
```

W> Using this will __override the default array__, meaning that webpack will no longer try to resolve modules using the default extensions.


### `resolve.mainFields`

`[string]`

When importing from an npm package, e.g. `import * as D3 from 'd3'`, this option will determine which fields in its `package.json` are checked. The default values will vary based upon the [`target`](/concepts/targets) specified in your webpack configuration.

When the `target` property is set to `webworker`, `web`, or left unspecified:

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    mainFields: ['browser', 'module', 'main']
  }
};
```

For any other target (including `node`):

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    mainFields: ['module', 'main']
  }
};
```

For example, consider an arbitrary library called `upstream` with a `package.json` that contains the following fields:

```json
{
  "browser": "build/upstream.js",
  "module": "index"
}
```

When we `import * as Upstream from 'upstream'` this will actually resolve to the file in the `browser` property. The `browser` property takes precedence because it's the first item in `mainFields`. Meanwhile, a Node.js application bundled by webpack will first try to resolve using the file in the `module` field.


### `resolve.mainFiles`

`[string] = ['index']`

The filename to be used while resolving directories.

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    mainFiles: ['index']
  }
};
```


### `resolve.modules`

`[string] = ['node_modules']`

Tell webpack what directories should be searched when resolving modules.

Absolute and relative paths can both be used, but be aware that they will behave a bit differently.

A relative path will be scanned similarly to how Node scans for `node_modules`, by looking through the current directory as well as its ancestors (i.e. `./node_modules`, `../node_modules`, and on).

With an absolute path, it will only search in the given directory.

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    modules: ['node_modules']
  }
};
```

If you want to add a directory to search in that takes precedence over `node_modules/`:

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
};
```


### `resolve.unsafeCache`

`RegExp` `[RegExp]` `boolean: true`

Enable aggressive, but __unsafe__, caching of modules. Passing `true` will cache everything.

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    unsafeCache: true
  }
};
```

A regular expression, or an array of regular expressions, can be used to test file paths and only cache certain modules. For example, to only cache utilities:

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    unsafeCache: /src\/utilities/
  }
};
```

W> Changes to cached paths may cause failure in rare cases.


### `resolve.plugins`

[`[Plugin]`](/plugins/)

A list of additional resolve plugins which should be applied. It allows plugins such as [`DirectoryNamedWebpackPlugin`](https://www.npmjs.com/package/directory-named-webpack-plugin).

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    plugins: [
      new DirectoryNamedWebpackPlugin()
    ]
  }
};
```


### `resolve.symlinks`

`boolean = true`

Whether to resolve symlinks to their symlinked location.

When enabled, symlinked resources are resolved to their _real_ path, not their symlinked location. Note that this may cause module resolution to fail when using tools that symlink packages (like `npm link`).

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    symlinks: true
  }
};
```


### `resolve.cachePredicate`

`function(module) => boolean`

A function which decides whether a request should be cached or not. An object is passed to the function with `path` and `request` properties. It must return a boolean.

__webpack.config.js__

```js
module.exports = {
  //...
  resolve: {
    cachePredicate: (module) => {
      // additional logic
      return true;
    }
  }
};
```


## `resolveLoader`

`object { modules [string] = ['node_modules'], extensions [string] = ['.js', '.json'], mainFields [string] = ['loader', 'main']}`

This set of options is identical to the `resolve` property set above, but is used only to resolve webpack's [loader](/concepts/loaders) packages.

__webpack.config.js__

```js
module.exports = {
  //...
  resolveLoader: {
    modules: ['node_modules'],
    extensions: ['.js', '.json'],
    mainFields: ['loader', 'main']
  }
};
```

T> Note that you can use alias here and other features familiar from resolve. For example `{ txt: 'raw-loader' }` would shim `txt!templates/demo.txt` to use `raw-loader`.


### `resolveLoader.moduleExtensions`

`[string]`

W> Removed in webpack 5

The extensions/suffixes that are used when resolving loaders. Since version two, we [strongly recommend](/migrate/3/#automatic--loader-module-name-extension-removed) using the full name, e.g. `example-loader`, as much as possible for clarity. However, if you really wanted to exclude the `-loader` bit, i.e. to use `example`, you can use this option to do so:

__webpack.config.js__

```js
module.exports = {
  //...
  resolveLoader: {
    moduleExtensions: ['-loader']
  }
};
```
