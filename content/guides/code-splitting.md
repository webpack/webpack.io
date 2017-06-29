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
---

Code splitting is one of the most compelling features of webpack. This feature allows you to split your code into various bundles which can then be loaded on demand or in parallel. It can be used to achieve smaller bundles and control resource load prioritization which, if used correctly, can have a major impact on load time.

There are three general approaches to code splitting available:

- Entry Points: Manually split code using [`entry`](/configuration/entry-context) configuration.
- Plugins & Loaders: Certain plugins and loaders can be used to split code in a variety of different ways.
- Dynamic Imports: This method allows splitting code via inline function calls within modules.


## Entry Points

This is by far the easiest, and most intuitive, way to split code. However, it is more manual and has a some pitfalls we will go over. Let's take a look at how we might split the core libraries and frameworks an application uses from the actual source code:

__webpack.config.js__

``` js
const path = require('path');

module.exports = {
  entry: {
    index: './src/index.js',
    vendor: [
      'lodash'
    ]
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

This will yield the following build result:

``` bash
Hash: d1e4eab63dc6ba09c930
Version: webpack 2.6.1
Time: 531ms
           Asset    Size  Chunks                    Chunk Names
vendor.bundle.js  544 kB       0  [emitted]  [big]  vendor
 index.bundle.js  544 kB       1  [emitted]  [big]  index
   [0] ./~/lodash/lodash.js 540 kB {0} {1} [built]
   [1] (webpack)/buildin/global.js 509 bytes {0} {1} [built]
   [2] (webpack)/buildin/module.js 517 bytes {0} {1} [built]
   [3] ./src/index.js 216 bytes {1} [built]
   [4] multi lodash 28 bytes {0} [built]
```

As mentioned there are some pitfalls to this approach:

- If there are any duplicated modules between entry chunks they will be included in both bundles.
- It isn't as flexible and can't be used to dynamically split code with the core application logic.

The first of these two points is definitely an issue for our example, as `lodash` is also imported within `./src/index.js` and will thus be duplicated in the output. See the `CommonChunkPlugin` example below for a solution to this problem.


## Plugins & Loaders

There are multiple plugins and loaders in webpack's ecosystem that can help with splitting and managing split code. The most widely utilized of these is the [`CommonsChunkPlugin`](/plugins/commons-chunk-plugin), a fairly advanced tool that allows us to extract common dependencies into an existing entry chunk or an entirely new chunk. Let's use this to de-duplicate the `lodash` dependency from the previous example:

__webpack.config.js__

``` js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/index.js',
    vendor: [
      'lodash'
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor' // Specify the common bundle's name.
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

With the `CommonsChunkPlugin` in place, we should now see the duplicate dependency removed from our `index.bundle.js`. The plugin should notice that we've separated `lodash` out to a separate chunk and remove the dead weight from our main bundle. Let's do an `npm run build` to see if it worked:

``` bash
Hash: 5f3b08906b5e7d8d0799
Version: webpack 2.6.1
Time: 527ms
           Asset       Size  Chunks                    Chunk Names
 index.bundle.js  542 bytes       0  [emitted]         index
vendor.bundle.js     547 kB       1  [emitted]  [big]  vendor
   [0] ./~/lodash/lodash.js 540 kB {1} [built]
   [1] (webpack)/buildin/global.js 509 bytes {1} [built]
   [2] (webpack)/buildin/module.js 517 bytes {1} [built]
   [3] ./src/index.js 401 bytes {0} [built]
   [4] multi lodash 28 bytes {1} [built]
```

Here are some other useful plugins and loaders provide by the community for splitting code:

- [`ExtractTextPlugin`](/plugins/extract-text-webpack-plugin): Useful for splitting CSS out from the main application.
- [`bundle-loader`](/loaders/bundle-loader): Used to split code and lazy load the resulting bundles.
- [`promise-loader`](https://github.com/gaearon/promise-loader): Similar to the `bundle-loader` but uses promises.


## Dynamic Imports

Two similar techniques are supported by webpack when it comes to dynamic code splitting. The first and more preferable approach is use to the [`import()` syntax](/api/module-methods#import-) that conforms to the [ECMAScript proposal](https://github.com/tc39/proposal-dynamic-import) for dynamic imports. The legacy, webpack-specific approach is to use [`require.ensure`](/api/module-methods#require-ensure). Let's try using the first of these two approaches...

Here, instead of statically importing lodash, we'll use dynamic importing to separate it into a separate chunk:

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
+   return import(/* webpackChunkName: "lodash" */ 'lodash').then(module => {
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

Now, when we run webpack, we should see lodash separated out to a separate bundle:

?> Add bash example of webpack output

If you've enabled [`async` functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) via a pre-processor like babel, note that you can simplify the code as `import()` statements just return promises:

__src/index.js__

``` diff
- function getComponent() {
+ async function getComponent() {
-   return import(/* webpackChunkName: "lodash" */ 'lodash').then(module => {
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


## Next Steps

See [Lazy Loading](/guides/lazy-loading) for a more concrete example of how `import()` can be used in a real application and [Caching](/guides/caching) to learn how to split code more effectively.
