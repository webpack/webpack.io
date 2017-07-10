---
title: Output Management
sort: 4
contributors:
  - skipjack
  - TheDutchCoder
---

>T This guide extends on code examples found in the [`Asset Management`](/guides/asset-management) guide.

So far we've manually included all our assets in our `index.html` file, but as your application grows and once you start [using hashes in filenames](/guides/caching) and outputting [multiple bundles](/guides/code-splitting), it will be difficult to keep managing your `index.html` file manually. However, there's no need to fear as a few plugins exist that will make this process much easier to manage.

## Preparation

First, let's adjust our project a little bit:

__project__

``` diff
  webpack-demo
  |- package.json
  |- webpack.config.js
  |- /dist
  |- /src
    |- index.js
+   |- print.js
  |- /node_modules
```

Let's add some logic to our `src/print.js` file:

__src/print.js__

``` js
export default function printMe() {
  console.log('I get called from print.js!');
}
```

And use that function in our `src/index.js` file:

__src/index.js__

``` diff
  import _ from 'lodash';
+ import printMe from './print.js';

  function component() {
    var element = document.createElement('div');
+   var btn = document.createElement('button');

    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

+   btn.innerHTML = 'Click me and check the console!';
+   btn.onclick = printMe;
+
+   element.appendChild(btn);

    return element;
  }

  document.body.appendChild(component());
```

Let's also update our `dist/index.html` file, in preparation for webpack to split out entries:

__dist/index.html__

``` diff
  <html>
    <head>
-     <title>Asset Management</title>
+     <title>Output Management</title>
+     <script src="./print.bundle.js"></script>
    </head>
    <body>
-     <script src="./bundle.js"></script>
+     <script src="./app.bundle.js"></script>
    </body>
  </html>
```

Now adjust the config. We'll be adding our `src/print.js` as a new entry point (`print`) and we'll change the output as well, so that it will dynamically generate bundle names, based on the entry point names:

__webpack.config.js__

``` diff
  const path = require('path');

  module.exports = {
    entry: {
-     index: './src/index.js',
+     app: './src/index.js',
+     print: './src/print.js'
    },
    output: {
-     filename: 'bundle.js',
+     filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

Let's run `npm run build` and see what this generates:

``` bash
Hash: aa305b0f3373c63c9051
Version: webpack 3.0.0
Time: 536ms
          Asset     Size  Chunks                    Chunk Names
  app.bundle.js   545 kB    0, 1  [emitted]  [big]  app
print.bundle.js  2.74 kB       1  [emitted]         print
   [0] ./src/print.js 84 bytes {0} {1} [built]
   [1] ./src/index.js 403 bytes {0} [built]
   [3] (webpack)/buildin/global.js 509 bytes {0} [built]
   [4] (webpack)/buildin/module.js 517 bytes {0} [built]
    + 1 hidden module
```

We can see that webpack generates our `print.bundle.js` and `app.bundle.js` files, which we also specified in our `index.html` file. if you open `index.html` in your browser, you can see what happens when you click the button.

But what would happen if we changed the name of one of our entry points, or even added a new one? The generated bundles would be renamed on a build, but our `index.html` file would still reference the old names. Let's fix that with the [`HtmlWebpackPlugin`](/plugins/html-webpack-plugin).


## Setting up HtmlWebpackPlugin

First install the plugin and adjust the `webpack.config.js` file:

``` bash
npm install --save-dev html-webpack-plugin
```

__webpack.config.js__

``` diff
  const path = require('path');
+ const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      vendor: ['lodash']
    },
+   plugins: [
+     new HtmlWebpackPlugin({
+       title: 'Output Management'
+     })
+   ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

Before we do a build, you should know that the `HtmlWebpackPlugin` by default will generate its own `index.html` file, even though we already have one in the `dist/` folder. This means that it will replace our `index.html` file with a newly generated one. Let's see what happens when we do an `npm run build`:

``` bash
Hash: 81f82697c19b5f49aebd
Version: webpack 2.6.1
Time: 854ms
           Asset       Size  Chunks                    Chunk Names
vendor.bundle.js     544 kB       0  [emitted]  [big]  vendor
   app.bundle.js    2.81 kB       1  [emitted]         app
      index.html  249 bytes          [emitted]
   [0] ./~/lodash/lodash.js 540 kB {0} [built]
   [1] (webpack)/buildin/global.js 509 bytes {0} [built]
   [2] (webpack)/buildin/module.js 517 bytes {0} [built]
   [3] ./src/index.js 172 bytes {1} [built]
   [4] multi lodash 28 bytes {0} [built]
Child html-webpack-plugin for "index.html":
       [0] ./~/lodash/lodash.js 540 kB {0} [built]
       [1] ./~/html-webpack-plugin/lib/loader.js!./~/html-webpack-plugin/default_index.ejs 538 bytes {0} [built]
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
```

If you open `index.html` in your code editor, you'll see that the `HtmlWebpackPlugin` has created an entirely new file for you and that all the bundles are automatically added.

If you want to learn more about all the features and options that the `HtmlWebpackPlugin` provides, then you should read up on it on the [`HtmlWebpackPlugin`](https://github.com/jantimon/html-webpack-plugin) repo.

You can also take a look at [`html-webpack-template`](https://github.com/jaketrent/html-webpack-template) which provides a couple of extra features in addition to the default template.


## Cleaning up the `/dist` folder

As you might have noticed over the past guides and code example, our `/dist` folder has become quite cluttered. Webpack will generate the files and put them in the `/dist` folder for you, but it doesn't keep track of which files are actually in use by your project.

In general it's good practice to clean the `/dist` folder before each build, so that only used files will be generated. Let's take care of that.

A popular plugin to manage this is the [`clean-webpack-plugin`](https://www.npmjs.com/package/clean-webpack-plugin) so let's install and configure it.

``` bash
npm install clean-webpack-plugin --save-dev
```

__webpack.config.js__

``` diff
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CleanWebpackPlugin = require('clean-webpack-plugin');

  module.exports = {
    entry: {
      app: './src/index.js',
      vendor: ['lodash']
    },
    plugins: [
+     new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({
        title: 'Output Management',
        filename: 'index.html',
        template: 'src/index.html'
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
  };
```

Now run an `npm run build` and inspect the `/dist` folder. If everything went well you should now only see the files generated from the build and no more old files!


## The Manifest

You might be wondering how webpack and its plugins seem to "know" what files are being generated. The answer is in the manifest that webpack keeps to track how all the modules map to the output bundles. If you're interested in managing webpack's [`ouput`](/configuration/output) in other ways, the manifest would be a good place to start.

The manifest data can be extracted into a json file for easy consumption using the [`WebpackManifestPlugin`](https://github.com/danethurber/webpack-manifest-plugin).

We won't go through a full example of how to use this plugin within your projects, but you can read up on [the concept page](/concepts/manifest) and the [caching guide](/guides/caching) to find out how this ties into long term caching.


## Conclusion

Now that you've learned about dynamically adding bundles to your HTML, let's dive into the next guide: [`Development`](/guides/development). If you want to dive into more advanced topics, we would recommend heading over to the [`Code Splitting`](/guides/code-splitting) guide.
