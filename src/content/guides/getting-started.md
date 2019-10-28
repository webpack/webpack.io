---
title: Getting Started
sort: 1
contributors:
  - bebraw
  - varunjayaraman
  - cntanglijun
  - chrisVillanueva
  - johnstew
  - simon04
  - aaronang
  - TheDutchCoder
  - sudarsangp
  - Vanguard90
  - chenxsan
  - EugeneHlushko
  - ATGardner
  - ayvarot
  - bjarki
  - ztomasze
  - Spiral90210
  - byzyk
  - wizardofhogwarts
---

webpack is used to compile JavaScript modules. Once [installed](/guides/installation), you can interface with webpack either from its [CLI](/api/cli) or [API](/api/node). If you're still new to webpack, please read through the [core concepts](/concepts) and [this comparison](/comparison) to learn why you might use it over the other tools that are out in the community.

## Basic Setup

First let's create a directory, initialize npm, [install webpack locally](/guides/installation/#local-installation), and install the webpack-cli (the tool used to run webpack on the command line):

``` bash
mkdir webpack-demo
cd webpack-demo
npm init -y
npm install webpack webpack-cli --save-dev
```

T> Throughout the Guides we will use `diff` blocks to show you what changes we're making to directories, files, and code.

Now we'll create the following directory structure, files and their contents:

__project__

``` diff
  webpack-demo
  |- package.json
+ |- index.html
+ |- /src
+   |- index.js
```

__src/index.js__

``` javascript
function component() {
  const element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
```

__index.html__

``` html
<!doctype html>
<html>
  <head>
    <title>Getting Started</title>
    <script src="https://unpkg.com/lodash@4.16.6"></script>
  </head>
  <body>
    <script src="./src/index.js"></script>
  </body>
</html>
```

We also need to adjust our `package.json` file in order to make sure we mark our package as `private`, as well as removing the `main` entry. This is to prevent an accidental publish of your code.

T> If you want to learn more about the inner workings of `package.json`, then we recommend reading the [npm documentation](https://docs.npmjs.com/files/package.json).

__package.json__

``` diff
  {
    "name": "webpack-demo",
    "version": "1.0.0",
    "description": "",
+   "private": true,
-   "main": "index.js",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "webpack": "^4.20.2",
      "webpack-cli": "^3.1.2"
    },
    "dependencies": {}
  }
```

In this example, there are implicit dependencies between the `<script>` tags. Our `index.js` file depends on `lodash` being included in the page before it runs. This is because `index.js` never explicitly declared a need for `lodash`; it assumes that the global variable `_` exists.

There are problems with managing JavaScript projects this way:

- It is not immediately apparent that the script depends on an external library.
- If a dependency is missing, or included in the wrong order, the application will not function properly.
- If a dependency is included but not used, the browser will be forced to download unnecessary code.

Let's use webpack to manage these scripts instead.

## Creating a Bundle

First we'll tweak our directory structure slightly, separating the "source" code (`/src`) from our "distribution" code (`/dist`). The "source" code is the code that we'll write and edit. The "distribution" code is the minimized and optimized `output` of our build process that will eventually be loaded in the browser. Tweak the directory structure as follows:

__project__

``` diff
  webpack-demo
  |- package.json
+ |- /dist
+   |- index.html
- |- index.html
  |- /src
    |- index.js
```

To bundle the `lodash` dependency with `index.js`, we'll need to install the library locally:

``` bash
npm install --save lodash
```

T> When installing a package that will be bundled into your production bundle, you should use `npm install --save`. If you're installing a package for development purposes (e.g. a linter, testing libraries, etc.) then you should use `npm install --save-dev`. More information can be found in the [npm documentation](https://docs.npmjs.com/cli/install).

Now, lets import `lodash` in our script:

__src/index.js__

``` diff
+ import _ from 'lodash';
+
  function component() {
    const element = document.createElement('div');

-   // Lodash, currently included via a script, is required for this line to work
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');

    return element;
  }

  document.body.appendChild(component());
```

Now, since we'll be bundling our scripts, we have to update our `index.html` file. Let's remove the lodash `<script>`, as we now `import` it, and modify the other `<script>` tag to load the bundle, instead of the raw `/src` file:

__dist/index.html__

``` diff
  <!doctype html>
  <html>
   <head>
     <title>Getting Started</title>
-    <script src="https://unpkg.com/lodash@4.16.6"></script>
   </head>
   <body>
-    <script src="./src/index.js"></script>
+    <script src="main.js"></script>
   </body>
  </html>
```

In this setup, `index.js` explicitly requires `lodash` to be present, and binds it as `_` (no global scope pollution). By stating what dependencies a module needs, webpack can use this information to build a dependency graph. It then uses the graph to generate an optimized bundle where scripts will be executed in the correct order.

With that said, let's run `npx webpack`, which will take our script at `src/index.js` as the [entry point](/concepts/entry-points), and will generate `dist/main.js` as the [output](/concepts/output). The `npx` command, which ships with Node 8.2/npm 5.2.0 or higher, runs the webpack binary (`./node_modules/.bin/webpack`) of the webpack package we installed in the beginning:

``` bash
npx webpack

...
Built at: 13/06/2018 11:52:07
  Asset      Size  Chunks             Chunk Names
main.js  70.4 KiB       0  [emitted]  main
...

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```

T> Your output may vary a bit, but if the build is successful then you are good to go. Also, don't worry about the warning, we'll tackle that later.

Open `index.html` in your browser and, if everything went right, you should see the following text: 'Hello webpack'.

W> If you are getting a syntax error in the middle of minified JavaScript when opening `index.html` in the browser, set [`development mode`](/configuration/mode/#mode-development) and run `npx webpack` again. This is related to running `npx webpack` on latest Node.js (v12.5+) instead of [LTS version](https://nodejs.org/en/).


## Modules

The [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) statements have been standardized in [ES2015](https://babeljs.io/docs/en/learn/). Although they are not supported in most browsers yet, webpack does support them out of the box.

Behind the scenes, webpack actually "transpiles" the code so that older browsers can also run it. If you inspect `dist/main.js`, you might be able to see how webpack does this, it's quite ingenious! Besides `import` and `export`, webpack supports various other module syntaxes as well, see [Module API](/api/module-methods) for more information.

Note that webpack will not alter any code other than `import` and `export` statements. If you are using other [ES2015 features](http://es6-features.org/), make sure to [use a transpiler](/loaders/#transpiling) such as [Babel](https://babeljs.io/) or [Bublé](https://buble.surge.sh/guide/) via webpack's [loader system](/concepts/loaders/).


## Using a Configuration

As of version 4, webpack doesn't require any configuration, but most projects will need a more complex setup, which is why webpack supports a [configuration file](/concepts/configuration). This is much more efficient than having to manually type in a lot of commands in the terminal, so let's create one:

__project__

``` diff
  webpack-demo
  |- package.json
+ |- webpack.config.js
  |- /dist
    |- index.html
  |- /src
    |- index.js
```

__webpack.config.js__

``` javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

Now, let's run the build again but instead using our new configuration file:

``` bash
npx webpack --config webpack.config.js

...
  Asset      Size  Chunks             Chunk Names
main.js  70.4 KiB       0  [emitted]  main
...

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/
```

T> If a `webpack.config.js` is present, the `webpack` command picks it up by default. We use the `--config` option here only to show that you can pass a config of any name. This will be useful for more complex configurations that need to be split into multiple files.

A configuration file allows far more flexibility than CLI usage only. We can specify loader rules, plugins, resolve options and many other enhancements this way. See the [configuration documentation](/configuration) to learn more.


## NPM Scripts

Given it's not particularly fun to run a local copy of webpack from the CLI, we can set up a little shortcut. Let's adjust our _package.json_ by adding an [npm script](https://docs.npmjs.com/misc/scripts):

__package.json__

``` diff
  {
    "name": "webpack-demo",
    "version": "1.0.0",
    "description": "",
    "scripts": {
-      "test": "echo \"Error: no test specified\" && exit 1"
+      "test": "echo \"Error: no test specified\" && exit 1",
+      "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "webpack": "^4.20.2",
      "webpack-cli": "^3.1.2"
    },
    "dependencies": {
      "lodash": "^4.17.5"
    }
  }
```

Now the `npm run build` command can be used in place of the `npx` command we used earlier. Note that within `scripts` we can reference locally installed npm packages by name the same way we did with `npx`. This convention is the standard in most npm-based projects because it allows all contributors to use the same set of common scripts (each with flags like `--config` if necessary).

Now run the following command and see if your script alias works:

``` bash
npm run build

...
  Asset      Size  Chunks             Chunk Names
main.js  70.4 KiB       0  [emitted]  main
...

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value. Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/.
```

T> Custom parameters can be passed to webpack by adding two dashes between the `npm run build` command and your parameters, e.g. `npm run build -- --colors`.


## Conclusion

Now that you have a basic build together you should move on to the next guide [`Asset Management`](/guides/asset-management) to learn how to manage assets like images and fonts with webpack. At this point, your project should look like this:

__project__

``` diff
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
  |- main.js
  |- index.html
|- /src
  |- index.js
|- /node_modules
```

T> If you're using npm 5, you'll probably also see a `package-lock.json` file in your directory.

If you want to learn more about webpack's design, you can check out the [basic concepts](/concepts) and [configuration](/configuration) pages. Furthermore, the [API](/api) section digs into the various interfaces webpack offers.
