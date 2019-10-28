---
title: Concepts
sort: -1
contributors:
  - TheLarkInn
  - jhnns
  - grgur
  - johnstew
  - jimrfenner
  - TheDutchCoder
  - adambraimbridge
  - EugeneHlushko
  - jeremenichelli
  - arjunsajeev
  - byzyk
  - yairhaimo
  - farskid
  - LukeMwila
  - Jalitha
  - fokusferit
---

At its core, __webpack__ is a _static module bundler_ for modern JavaScript applications. When webpack processes your application, it internally builds a [dependency graph](/concepts/dependency-graph/) which maps every module your project needs and generates one or more _bundles_.

T> Learn more about JavaScript modules and webpack modules [here](/concepts/modules).

Since version 4.0.0, __webpack does not require a configuration file__ to bundle your project. Nevertheless, it is [incredibly configurable](/configuration) to better fit your needs.

To get started you only need to understand its __Core Concepts__:

- [Entry](#entry)
- [Output](#output)
- [Loaders](#loaders)
- [Plugins](#plugins)
- [Mode](#mode)
- [Browser Compatibility](#browser-compatibility)

This document is intended to give a __high-level__ overview of these concepts, while providing links to detailed concept-specific use cases.

For a better understanding of the ideas behind module bundlers and how they work under the hood, consult these resources:

- [Manually Bundling an Application](https://www.youtube.com/watch?v=UNMkLHzofQI)
- [Live Coding a Basic Module Bundler](https://www.youtube.com/watch?v=Gc9-7PBqOC8)
- [Detailed Explanation of a Basic Module Bundler](https://github.com/ronami/minipack)


## Entry

An __entry point__ indicates which module webpack should use to begin building out its internal [dependency graph](/concepts/dependency-graph/). webpack will figure out which other modules and libraries that entry point depends on (directly and indirectly).

By default its value is `./src/index.js`, but you can specify a different (or multiple entry points) by setting an [`entry` property in the webpack configuration](/configuration/entry-context/#entry). For example:

__webpack.config.js__

``` js
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

T> Learn more in the [entry points](/concepts/entry-points) section.


## Output

The __output__ property tells webpack where to emit the _bundles_ it creates and how to name these files. It defaults to `./dist/main.js` for the main output file and to the `./dist` folder for any other generated file.

You can configure this part of the process by specifying an `output` field in your configuration:

__webpack.config.js__

```javascript
const path = require('path');

module.exports = {
  entry: './path/to/my/entry/file.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'my-first-webpack.bundle.js'
  }
};
```

In the example above, we use the `output.filename` and the `output.path` properties to tell webpack the name of our bundle and where we want it to be emitted to. In case you're wondering about the path module being imported at the top, it is a core [Node.js module](https://nodejs.org/api/modules.html) that gets used to manipulate file paths.

T> The `output` property has [many more configurable features](/configuration/output). If you want to learn about the concepts behind it, you can [read more in the output section](/concepts/output).


## Loaders

Out of the box, webpack only understands JavaScript and JSON files. __Loaders__ allow webpack to process other types of files and convert them into valid [modules](/concepts/modules) that can be consumed by your application and added to the dependency graph.

W> Note that the ability to `import` any type of module, e.g. `.css` files, is a feature specific to webpack and may not be supported by other bundlers or task runners. We feel this extension of the language is warranted as it allows developers to build a more accurate dependency graph.

At a high level, __loaders__ have two properties in your webpack configuration:

1. The `test` property identifies which file or files should be transformed.
2. The `use` property indicates which loader should be used to do the transforming.

__webpack.config.js__

```javascript
const path = require('path');

module.exports = {
  output: {
    filename: 'my-first-webpack.bundle.js'
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  }
};
```

The configuration above has defined a `rules` property for a single module with two required properties: `test` and `use`. This tells webpack's compiler the following:

> "Hey webpack compiler, when you come across a path that resolves to a '.txt' file inside of a `require()`/`import` statement, __use__ the `raw-loader` to transform it before you add it to the bundle."

W> It is important to remember that when defining rules in your webpack config, you are defining them under `module.rules` and not `rules`. For your benefit, webpack will warn you if this is done incorrectly.

W> Keep in mind that when using regex to match files, you may not quote it. i.e `/\.txt$/` is not the same as `'/\.txt$/'` or `"/\.txt$/"`. The former instructs webpack to match any file that ends with .txt and the latter instructs webpack to match a single file with an absolute path '.txt'; this is likely not your intention.

You can check further customization when including loaders in the [loaders section](/concepts/loaders).


## Plugins

While loaders are used to transform certain types of modules, plugins can be leveraged to perform a wider range of tasks like bundle optimization, asset management and injection of environment variables.

T> Check out the [plugin interface](/api/plugins) and how to use it to extend webpack's capabilities.

In order to use a plugin, you need to `require()` it and add it to the `plugins` array. Most plugins are customizable through options. Since you can use a plugin multiple times in a config for different purposes, you need to create an instance of it by calling it with the `new` operator.

__webpack.config.js__

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin'); //installed via npm
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: './src/index.html'})
  ]
};
```

In the example above, the `html-webpack-plugin` generates an HTML file for your application by injecting automatically all your generated bundles.

T> There are many plugins that webpack provides out of the box! Check out the [list of plugins](/plugins).

Using plugins in your webpack config is straightforward. However, there are many use cases that are worth further exploration. [Learn more about them here](/concepts/plugins).


## Mode

By setting the `mode` parameter to either `development`, `production` or `none`, you can enable webpack's built-in optimizations that correspond to each environment. The default value is `production`.

```javascript
module.exports = {
  mode: 'production'
};
```

Learn more about the [mode configuration here](/configuration/mode) and what optimizations take place on each value.


## Browser Compatibility

webpack supports all browsers that are [ES5-compliant](https://kangax.github.io/compat-table/es5/) (IE8 and below are not supported). webpack needs `Promise` for [`import()` and `require.ensure()`](/guides/code-splitting/#dynamic-imports). If you want to support older browsers, you will need to [load a polyfill](/guides/shimming/) before using these expressions.
