---
title: Code Splitting
sort: 9
contributors:
  - pksjce
  - pastelsky
  - simon04
  - jonwheeler
  - johnstew
  - shinxi
  - tomtasche
  - levy9527
  - rahulcs
  - chrisVillanueva
  - rafde
  - bartushek
  - shaunwallace
  - skipjack
  - jakearchibald
  - TheDutchCoder
  - rouzbeh84
  - shaodahong
  - sudarsangp
  - kcolton
  - efreitasn
  - EugeneHlushko
related:
  - title: <link rel=”prefetch/preload”> in webpack
    url: https://medium.com/webpack/link-rel-prefetch-preload-in-webpack-51a52358f84c
  - title: Preload, Prefetch And Priorities in Chrome
    url: https://medium.com/reloading/preload-prefetch-and-priorities-in-chrome-776165961bbf
  - title: Preloading content with rel="preload"
    url: https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content
---

T> This guide extends the examples provided in [Getting Started](/guides/getting-started) and [Output Management](/guides/output-management). Please make sure you are at least familiar with the examples provided in them.

Code splitting is one of the most compelling features of webpack. This feature allows you to split your code into various bundles which can then be loaded on demand or in parallel. It can be used to achieve smaller bundles and control resource load prioritization which, if used correctly, can have a major impact on load time.

There are three general approaches to code splitting available:

- Entry Points: Manually split code using [`entry`](/configuration/entry-context) configuration.
- Prevent Duplication: Use the [`CommonsChunkPlugin`](/plugins/commons-chunk-plugin) to dedupe and split chunks.
- Dynamic Imports: Split code via inline function calls within modules.


## Entry Points

This is by far the easiest, and most intuitive, way to split code. However, it is more manual and has some pitfalls we will go over. Let's take a look at how we might split another module from the main bundle:

__project__

``` diff
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
+ |- another-module.js
|- /node_modules
```

__another-module.js__

``` js
import _ from 'lodash';

console.log(
  _.join(['Another', 'module', 'loaded!'], ' ')
);
```

__webpack.config.js__

``` js
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    index: './src/index.js',
    another: './src/another-module.js'
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Code Splitting'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

This will yield the following build result:

``` bash
Hash: 309402710a14167f42a8
Version: webpack 2.6.1
Time: 570ms
            Asset    Size  Chunks                    Chunk Names
  index.bundle.js  544 kB       0  [emitted]  [big]  index
another.bundle.js  544 kB       1  [emitted]  [big]  another
   [0] ./~/lodash/lodash.js 540 kB {0} {1} [built]
   [1] (webpack)/buildin/global.js 509 bytes {0} {1} [built]
   [2] (webpack)/buildin/module.js 517 bytes {0} {1} [built]
   [3] ./src/another-module.js 87 bytes {1} [built]
   [4] ./src/index.js 216 bytes {0} [built]
```

As mentioned there are some pitfalls to this approach:

- If there are any duplicated modules between entry chunks they will be included in both bundles.
- It isn't as flexible and can't be used to dynamically split code with the core application logic.

The first of these two points is definitely an issue for our example, as `lodash` is also imported within `./src/index.js` and will thus be duplicated in both bundles. Let's remove this duplication by using the `CommonsChunkPlugin`.


## Prevent Duplication

The [`CommonsChunkPlugin`](/plugins/commons-chunk-plugin) allows us to extract common dependencies into an existing entry chunk or an entirely new chunk. Let's use this to de-duplicate the `lodash` dependency from the previous example:

First, let's install this plugin: `syntax-dynamic-import`
``` npm
npm install --save-dev babel-plugin-syntax-dynamic-import
```

__webpack.config.js__

``` diff
  const path = require('path');
+ const webpack = require('webpack');
  const HTMLWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
      index: './src/index.js',
      another: './src/another-module.js'
    },
+   module: {
+     rules: [
+       {
+         test: /\.js$/,
+         exclude: /node_modules/,
+         use: {
+           loader: 'babel-loader',
+           plugins: ['syntax-dynamic-import'] // important!
+         }
+       }
+     ]
+   },
    plugins: [
      new HTMLWebpackPlugin({
        title: 'Code Splitting'
-     })
+     }),
+     new webpack.optimize.CommonsChunkPlugin({
+       name: 'common' // Specify the common bundle's name.
+     })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

With the [`CommonsChunkPlugin`](/plugins/commons-chunk-plugin) in place, we should now see the duplicate dependency removed from our `index.bundle.js`. The plugin should notice that we've separated `lodash` out to a separate chunk and remove the dead weight from our main bundle. Let's do an `npm run build` to see if it worked:

``` bash
Hash: 70a59f8d46ff12575481
Version: webpack 2.6.1
Time: 510ms
            Asset       Size  Chunks                    Chunk Names
  index.bundle.js  665 bytes       0  [emitted]         index
another.bundle.js  537 bytes       1  [emitted]         another
 common.bundle.js     547 kB       2  [emitted]  [big]  common
   [0] ./~/lodash/lodash.js 540 kB {2} [built]
   [1] (webpack)/buildin/global.js 509 bytes {2} [built]
   [2] (webpack)/buildin/module.js 517 bytes {2} [built]
   [3] ./src/another-module.js 87 bytes {1} [built]
   [4] ./src/index.js 216 bytes {0} [built]
```

Here are some other useful plugins and loaders provided by the community for splitting code:

- [`ExtractTextPlugin`](/plugins/extract-text-webpack-plugin): Useful for splitting CSS out from the main application.
- [`bundle-loader`](/loaders/bundle-loader): Used to split code and lazy load the resulting bundles.
- [`promise-loader`](https://github.com/gaearon/promise-loader): Similar to the `bundle-loader` but uses promises.

T> The [`CommonsChunkPlugin`](/plugins/commons-chunk-plugin) is also used to split vendor modules from core application code using [explicit vendor chunks](/plugins/commons-chunk-plugin/#explicit-vendor-chunk).


## Dynamic Imports

Two similar techniques are supported by webpack when it comes to dynamic code splitting. The first and more preferable approach is to use the [`import()` syntax](/api/module-methods#import-) that conforms to the [ECMAScript proposal](https://github.com/tc39/proposal-dynamic-import) for dynamic imports. The legacy, webpack-specific approach is to use [`require.ensure`](/api/module-methods#require-ensure). Let's try using the first of these two approaches...

W> `import()` calls use [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) internally. If you use `import()` with older browsers, remember to shim `Promise` using a polyfill such as [es6-promise](https://github.com/stefanpenner/es6-promise) or [promise-polyfill](https://github.com/taylorhakes/promise-polyfill).

Before we start, let's remove the extra [`entry`](/concepts/entry-points/) and [`CommonsChunkPlugin`](/plugins/commons-chunk-plugin) from our config as they won't be needed for this next demonstration:

__webpack.config.js__

``` diff
  const path = require('path');
- const webpack = require('webpack');
  const HTMLWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
+     index: './src/index.js'
-     index: './src/index.js',
-     another: './src/another-module.js'
    },
    plugins: [
      new HTMLWebpackPlugin({
        title: 'Code Splitting'
-     }),
+     })
-     new webpack.optimize.CommonsChunkPlugin({
-       name: 'common' // Specify the common bundle's name.
-     })
    ],
    output: {
      filename: '[name].bundle.js',
+     chunkFilename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

Note the use of `chunkFilename`, which determines the name of non-entry chunk files. For more information on `chunkFilename`, see [output documentation](/configuration/output/#output-chunkfilename). We'll also update our project to remove the now unused files:

__project__

``` diff
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
- |- another-module.js
|- /node_modules
```

Now, instead of statically importing `lodash`, we'll use dynamic importing to separate a chunk:

__src/index.js__

``` diff
- import _ from 'lodash';
-
- function component() {
+ function getComponent() {
-   var element = document.createElement('div');
-
-   // Lodash, now imported by this script
-   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   return import(/* webpackChunkName: "lodash" */ 'lodash').then(_ => {
+     var element = document.createElement('div');
+
+     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+
+     return element;
+
+   }).catch(error => 'An error occurred while loading the component');
  }

- document.body.appendChild(component());
+ getComponent().then(component => {
+   document.body.appendChild(component);
+ })
```

Note the use of `webpackChunkName` in the comment. This will cause our separate bundle to be named `lodash.bundle.js` instead of just `[id].bundle.js`. For more information on `webpackChunkName` and the other available options, see the [`import()` documentation](/api/module-methods#import-). Let's run webpack to see `lodash` separated out to a separate bundle:

``` bash
Hash: a27e5bf1dd73c675d5c9
Version: webpack 2.6.1
Time: 544ms
           Asset     Size  Chunks                    Chunk Names
lodash.bundle.js   541 kB       0  [emitted]  [big]  lodash
 index.bundle.js  6.35 kB       1  [emitted]         index
   [0] ./~/lodash/lodash.js 540 kB {0} [built]
   [1] ./src/index.js 377 bytes {1} [built]
   [2] (webpack)/buildin/global.js 509 bytes {0} [built]
   [3] (webpack)/buildin/module.js 517 bytes {0} [built]
```

As `import()` returns a promise, it can be used with [`async` functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function). However, this requires using a pre-processor like Babel and the [Syntax Dynamic Import Babel Plugin](https://babeljs.io/docs/plugins/syntax-dynamic-import/#installation). Here's how it would simplify the code:

__src/index.js__

``` diff
- function getComponent() {
+ async function getComponent() {
-   return import(/* webpackChunkName: "lodash" */ 'lodash').then(_ => {
-     var element = document.createElement('div');
-
-     element.innerHTML = _.join(['Hello', 'webpack'], ' ');
-
-     return element;
-
-   }).catch(error => 'An error occurred while loading the component');
+   var element = document.createElement('div');
+   const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');
+
+   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+
+   return element;
  }

  getComponent().then(component => {
    document.body.appendChild(component);
  });
```


## Prefetching/Preloading modules

webpack 4.6.0+ adds support for prefetching and preloading.

Using these inline directives while declaring your imports allows webpack to output “Resource Hint” which tells the browser that for:

- prefetch: resource is probably needed for some navigation in the future
- preload: resource might be needed during the current navigation

Simple prefetch example can be having a `HomePage` component, which renders a `LoginButton` component which then on demand loads a `LoginModal` component after being clicked.

__LoginButton.js__

```js
//...
import(/* webpackPrefetch: true */ "LoginModal");

```

This will result in `<link rel="prefetch" href="login-modal-chunk.js">` being appended in the head of the page, which will instruct the browser to prefetch in idle time the `login-modal-chunk.js` file.

T> webpack will add the prefetch hint once the parent chunk has been loaded.

Preload directive has a bunch of differences compared to prefetch:

- A preloaded chunk starts loading in parallel to the parent chunk. A prefetched chunk starts after the parent chunk finish.
- A preloaded chunk has medium priority and instantly downloaded. A prefetched chunk is downloaded in browser idle time.
- A preloaded chunk should be instantly requested by the parent chunk. A prefetched chunk can be used anytime in the future.
- Browser support is different.

Simple preload example can be having a `Component` which always depends on a big library that should be in a separate chunk.

Lets image component `ChartComponent` which needs huge `ChartingLibrary`. It displays a `LoadingIndicator` when rendered and instantly does an on demand import of `ChartingLibrary`:

__ChartComponent.js__

```js
//...
import(/* webpackPreload: true */ "ChartingLibrary")
```

When a page which uses the `ChartComponent` is requested, the charting-library-chunk is also requested via `<link rel="preload">`. Assuming the page-chunk is smaller and finishes faster, the page will be displayed with a `LoadingIndicator`, until the already requested `charting-library-chunk` finishes. This will give a little load time boost since it only needs one round-trip instead of two. Especially in high-latency environments.

T> Using webpackPreload incorrectly can actually hurt performance, so be careful when using it.


## Bundle Analysis

Once you start splitting your code, it can be useful to analyze the output to check where modules have ended up. The [official analyze tool](https://github.com/webpack/analyse) is a good place to start. There are some other community-supported options out there as well:

- [webpack-chart](https://alexkuz.github.io/webpack-chart/): Interactive pie chart for webpack stats.
- [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/): Visualize and analyze your bundles to see which modules are taking up space and which might be duplicates.
- [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer): A plugin and CLI utility that represents bundle content as convenient interactive zoomable treemap.


## Next Steps

See [Lazy Loading](/guides/lazy-loading) for a more concrete example of how `import()` can be used in a real application and [Caching](/guides/caching) to learn how to split code more effectively.
