---
title: Entry Points
sort: 1
contributors:
  - TheLarkInn
  - chrisVillanueva
  - byzyk
  - sokra
  - EugeneHlushko
  - Zearin
  - opl-
---

As mentioned in [Getting Started](/guides/getting-started/#using-a-configuration), there are multiple ways to define the `entry` property in your webpack configuration. We will show you the ways you __can__ configure the `entry` property, in addition to explaining why it may be useful to you.


## Single Entry (Shorthand) Syntax

Usage: `entry: string | [string]`

__webpack.config.js__

```javascript
module.exports = {
  entry: './path/to/my/entry/file.js'
};
```

The single entry syntax for the `entry` property is a shorthand for:

__webpack.config.js__

```javascript
module.exports = {
  entry: {
    main: './path/to/my/entry/file.js'
  }
};
```

This is a great choice when you are looking to quickly setup a webpack configuration for an application or tool with one entry point (i.e. a library). However, there is not much flexibility in extending or scaling your configuration with this syntax.


## Object Syntax

Usage: `entry: { <entryChunkName> string | [string] }`

__webpack.config.js__

```javascript
module.exports = {
  entry: {
    app: './src/app.js',
    adminApp: './src/adminApp.js'
  }
};
```

The object syntax is more verbose. However, this is the most scalable way of defining entry/entries in your application.

T> __"Scalable webpack configurations"__ are ones that can be reused and combined with other partial configurations. This is a popular technique used to separate concerns by environment, build target, and runtime. They are then merged using specialized tools like [webpack-merge](https://github.com/survivejs/webpack-merge).


## Array Syntax

Usage: `entry: [string] | {[string entryChunkName]: [string]}`

Passing an array of file paths to the `entry` property creates what is known as a __"multi-main entry"__. This is useful when you would like to inject multiple dependent files together and graph their dependencies into one "chunk". The entry point will depend on and load each of the specified modules, but only the export value of the last module will be exported by the entry point.

__webpack.config.js__

```javascript
module.exports = {
  entry: [
    'source-map-support/register',
    './src/app.ts'
  ]
};
```

__What does this do?__ This config tells webpack that the `main` entry point should require both the `source-map-support/register` module and our app's entry point, then expose the value exported by our app (since it's the last file listed in the array).


## Scenarios

Below is a list of entry configurations and their real-world use cases:

### Separate App and Vendor Entries

__webpack.config.js__

```javascript
module.exports = {
  entry: {
    main: './src/app.js',
    vendor: './src/vendor.js'
  }
};
```

__webpack.prod.js__

```javascript
module.exports = {
  output: {
    filename: '[name].[contentHash].bundle.js'
  }
};
```

__webpack.dev.js__

```javascript
module.exports = {
  output: {
    filename: '[name].bundle.js'
  }
};
```

__What does this do?__ We are telling webpack that we would like 2 separate entry points (like the above example).

__Why?__ With this you can import required libraries or files that aren't modified (e.g. Bootstrap, jQuery, images, etc) inside `vendor.js` and they will be bundled together into their own chunk. Content hash remains the same, which allows the browser to cache them separately thereby reducing load time.

T> In webpack version < 4 it was common to add vendors as a separate entry point to compile it as a separate file (in combination with the `CommonsChunkPlugin`). <br><br> This is discouraged in webpack 4. Instead, the [`optimization.splitChunks`](/configuration/optimization/#optimizationsplitchunks) option takes care of separating vendors and app modules and creating a separate file. __Do not__ create an entry for vendors or other stuff that is not the starting point of execution.

### Multi Page Application

__webpack.config.js__

```javascript
module.exports = {
  entry: {
    pageOne: './src/pageOne/index.js',
    pageTwo: './src/pageTwo/index.js',
    pageThree: './src/pageThree/index.js'
  }
};
```

__What does this do?__ We are telling webpack that we would like 3 separate dependency graphs (like the above example).

__Why?__ In a multi-page application, the server is going to fetch a new HTML document for you. The page reloads this new document and assets are redownloaded. However, this gives us the unique opportunity to do things like using [`optimization.splitChunks`](/configuration/optimization/#optimizationsplitchunks) to create bundles of shared application code between each page. Multi-page applications that reuse a lot of code/modules between entry points can greatly benefit from these techniques, as the number of entry points increases.

T> As a rule of thumb: Use exactly one entry point for each HTML document.
