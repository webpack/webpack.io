---
title: Shimming
sort: 19
contributors:
  - pksjce
  - jhnns
  - simon04
  - jeremenichelli
  - svyandun
  - byzyk
  - EugeneHlushko
  - AnayaDesign
  - dhurlburtusa
  - plr108
  - NicolasLetellier
  - wizardofhogwarts
  - fokusferit
related:
  - title: Reward modern browser users script
    url: https://hackernoon.com/10-things-i-learned-making-the-fastest-site-in-the-world-18a0e1cdf4a7#c665
  - title: useBuiltIns in babel-preset-env
    url: https://babeljs.io/docs/en/babel-preset-env#usebuiltins
---

The `webpack` compiler can understand modules written as ES2015 modules, CommonJS or AMD. However, some third party libraries may expect global dependencies (e.g. `$` for `jQuery`). The libraries might also create globals which need to be exported. These "broken modules" are one instance where _shimming_ comes into play.

W> __We don't recommend using globals!__ The whole concept behind webpack is to allow more modular front-end development. This means writing isolated modules that are well contained and do not rely on hidden dependencies (e.g. globals). Please use these features only when necessary.

Another instance where _shimming_ can be useful is when you want to [polyfill](https://en.wikipedia.org/wiki/Polyfill_%28programming%29) browser functionality to support more users. In this case, you may only want to deliver those polyfills to the browsers that need patching (i.e. load them on demand).

The following article will walk through both of these use cases.

T> For simplicity, this guide stems from the examples in [Getting Started](/guides/getting-started). Please make sure you are familiar with the setup there before moving on.


## Shimming Globals

Let's start with the first use case of shimming global variables. Before we do anything let's take another look at our project:

__project__

``` diff
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
|- /node_modules
```

Remember that `lodash` package we were using? For demonstration purposes, let's say we wanted to instead provide this as a global throughout our application. To do this, we can use `ProvidePlugin`.

The [`ProvidePlugin`](/plugins/provide-plugin) makes a package available as a variable in every module compiled through webpack. If webpack sees that variable used, it will include the given package in the final bundle. Let's go ahead by removing the `import` statement for `lodash` and instead provide it via the plugin:

__src/index.js__

``` diff
- import _ from 'lodash';
-
  function component() {
    const element = document.createElement('div');

-   // Lodash, now imported by this script
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

__webpack.config.js__

``` diff
  const path = require('path');
+ const webpack = require('webpack');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
+   plugins: [
+     new webpack.ProvidePlugin({
+       _: 'lodash',
+     }),
+   ],
  };
```

What we've essentially done here is tell webpack...

> If you encounter at least one instance of the variable `_`, include the `lodash` package and provide it to the modules that need it.

If we run a build, we should still see the same output:

``` bash
...
    Asset    Size  Chunks                    Chunk Names
bundle.js  544 kB       0  [emitted]  [big]  main
...
```

We can also use the `ProvidePlugin` to expose a single export of a module by configuring it with an "array path" (e.g. `[module, child, ...children?]`). So let's imagine we only wanted to provide the `join` method from `lodash` wherever it's invoked:

__src/index.js__

``` diff
  function component() {
    const element = document.createElement('div');

-   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

__webpack.config.js__

``` diff
  const path = require('path');
  const webpack = require('webpack');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new webpack.ProvidePlugin({
-       _: 'lodash',
+       join: ['lodash', 'join'],
      }),
    ],
  };
```

This would go nicely with [Tree Shaking](/guides/tree-shaking) as the rest of the `lodash` library should get dropped.


## Granular Shimming

Some legacy modules rely on `this` being the `window` object. Let's update our `index.js` so this is the case:

``` diff
  function component() {
    const element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');
+
+   // Assume we are in the context of `window`
+   this.alert('Hmmm, this probably isn\'t a great idea...')

    return element;
  }

  document.body.appendChild(component());
```

This becomes a problem when the module is executed in a CommonJS context where `this` is equal to `module.exports`. In this case you can override `this` using the [`imports-loader`](/loaders/imports-loader/):

__webpack.config.js__

``` diff
  const path = require('path');
  const webpack = require('webpack');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
+   module: {
+     rules: [
+       {
+         test: require.resolve('index.js'),
+         use: 'imports-loader?this=>window',
+       },
+     ],
+   },
    plugins: [
      new webpack.ProvidePlugin({
        join: ['lodash', 'join'],
      }),
    ],
  };
```


## Global Exports

Let's say a library creates a global variable that it expects its consumers to use. We can add a small module to our setup to demonstrate this:

__project__

``` diff
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
  |- /src
    |- index.js
+   |- globals.js
  |- /node_modules
```

__src/globals.js__

``` js
const file = 'blah.txt';
const helpers = {
  test: function() { console.log('test something'); },
  parse: function() { console.log('parse something'); },
};
```

Now, while you'd likely never do this in your own source code, you may encounter a dated library you'd like to use that contains similar code to what's shown above. In this case, we can use [`exports-loader`](/loaders/exports-loader/), to export that global variable as a normal module export. For instance, in order to export `file` as `file` and `helpers.parse` as `parse`:

__webpack.config.js__

``` diff
  const path = require('path');
  const webpack = require('webpack');

  module.exports = {
    entry: './src/index.js',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: require.resolve('index.js'),
          use: 'imports-loader?this=>window',
        },
+       {
+         test: require.resolve('globals.js'),
+         use: 'exports-loader?file,parse=helpers.parse',
+       },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        join: ['lodash', 'join'],
      }),
    ],
  };
```

Now from within our entry script (i.e. `src/index.js`), we could `import { file, parse } from './globals.js';` and all should work smoothly.


## Loading Polyfills

Almost everything we've discussed thus far has been in relation to handling legacy packages. Let's move on to our second topic: __polyfills__.

There's a lot of ways to load polyfills. For example, to include the [`babel-polyfill`](https://babeljs.io/docs/en/babel-polyfill/) we need to:

``` bash
npm install --save babel-polyfill
```

and `import` it so as to include it in our main bundle:

__src/index.js__

``` diff
+ import 'babel-polyfill';
+
  function component() {
    const element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

T> Note that we aren't binding the `import` to a variable. This is because polyfills can run on their own, prior to the rest of the code base, allowing us to then assume certain native functionality exists.

Note that this approach prioritizes correctness over bundle size. To be safe and robust, polyfills/shims must run __before all other code__, and thus either need to load synchronously, or, all app code needs to load after all polyfills/shims load.
There are many misconceptions in the community, as well, that modern browsers "don't need" polyfills, or that polyfills/shims merely serve to add missing features - in fact, they often _repair broken implementations_, even in the most modern of browsers.
The best practice thus remains to unconditionally and synchronously load all polyfills/shims, despite the bundle size cost this incurs.

If you feel that you have mitigated these concerns and wish to incur the risk of brokenness, here's one way you might do it:
Let's move our `import` to a new file and add the [`whatwg-fetch`](https://github.com/github/fetch) polyfill:

``` bash
npm install --save whatwg-fetch
```

__src/index.js__

``` diff
- import 'babel-polyfill';
-
  function component() {
    const element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

__project__

``` diff
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
  |- /src
    |- index.js
    |- globals.js
+   |- polyfills.js
  |- /node_modules
```

__src/polyfills.js__

```javascript
import 'babel-polyfill';
import 'whatwg-fetch';
```

__webpack.config.js__

``` diff
  const path = require('path');
  const webpack = require('webpack');

  module.exports = {
-   entry: './src/index.js',
+   entry: {
+     polyfills: './src/polyfills.js',
+     index: './src/index.js',
+   },
    output: {
-     filename: 'bundle.js',
+     filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: require.resolve('index.js'),
          use: 'imports-loader?this=>window',
        },
        {
          test: require.resolve('globals.js'),
          use: 'exports-loader?file,parse=helpers.parse',
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        join: ['lodash', 'join'],
      }),
    ],
  };
```

With that in place, we can add the logic to conditionally load our new `polyfills.bundle.js` file. How you make this decision depends on the technologies and browsers you need to support. We'll do some testing to determine whether our polyfills are needed:

__dist/index.html__

``` diff
  <!doctype html>
  <html>
    <head>
      <title>Getting Started</title>
+     <script>
+       const modernBrowser = (
+         'fetch' in window &&
+         'assign' in Object
+       );
+
+       if ( !modernBrowser ) {
+         const scriptElement = document.createElement('script');
+
+         scriptElement.async = false;
+         scriptElement.src = '/polyfills.bundle.js';
+         document.head.appendChild(scriptElement);
+       }
+     </script>
    </head>
    <body>
      <script src="index.bundle.js"></script>
    </body>
  </html>
```

Now we can `fetch` some data within our entry script:

__src/index.js__

``` diff
  function component() {
    const element = document.createElement('div');

    element.innerHTML = join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
+
+ fetch('https://jsonplaceholder.typicode.com/users')
+   .then(response => response.json())
+   .then(json => {
+     console.log('We retrieved some data! AND we\'re confident it will work on a variety of browser distributions.')
+     console.log(json)
+   })
+   .catch(error => console.error('Something went wrong when fetching this data: ', error))
```

If we run our build, another `polyfills.bundle.js` file will be emitted and everything should still run smoothly in the browser. Note that this set up could likely be improved upon but it should give you a good idea of how you can provide polyfills only to the users that actually need them.


## Further Optimizations

The `babel-preset-env` package uses [browserslist](https://github.com/browserslist/browserslist) to transpile only what is not supported in your browsers matrix. This preset comes with the [`useBuiltIns`](https://babeljs.io/docs/en/babel-preset-env#usebuiltins) option, `false` by default, which converts your global `babel-polyfill` import to a more granular feature by feature `import` pattern:

``` js
import 'core-js/modules/es7.string.pad-start';
import 'core-js/modules/es7.string.pad-end';
import 'core-js/modules/web.timers';
import 'core-js/modules/web.immediate';
import 'core-js/modules/web.dom.iterable';
```

See [the babel-preset-env documentation](https://babeljs.io/docs/en/babel-preset-env) for more information.


## Node Built-Ins

Node built-ins, like `process`, can be polyfilled right directly from your configuration file without the use of any additional loaders or plugins. See the [node configuration page](/configuration/node) for more information and examples.


## Other Utilities

There are a few other tools that can help when dealing with legacy modules.

The [`script-loader`](/loaders/script-loader/) evaluates code in the global context, similar to inclusion via a `script` tag. In this mode, every normal library should work. `require`, `module`, etc. are undefined.

W> When using the `script-loader`, the module is added as a string to the bundle. It is not minimized by `webpack`, so use a minimized version. There is also no `devtool` support for libraries added by this loader.

When there is no AMD/CommonJS version of the module and you want to include the `dist`, you can flag this module in [`noParse`](/configuration/module/#modulenoparse). This will cause webpack to include the module without parsing it or resolving `require()` and `import` statements. This practice is also used to improve the build performance.

W> Any feature requiring the AST, like the `ProvidePlugin`, will not work.

Lastly, there are some modules that support multiple [module styles](/concepts/modules); e.g. a combination of AMD, CommonJS, and legacy. In most of these cases, they first check for `define` and then use some quirky code to export properties. In these cases, it could help to force the CommonJS path by setting `define=>false` via the [`imports-loader`](/loaders/imports-loader/).
