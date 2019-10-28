---
title: Entry and Context
sort: 4
contributors:
  - sokra
  - skipjack
  - tarang9211
  - byzyk
  - madhavarshney
  - EugeneHlushko
  - fokusferit
---

The entry object is where webpack looks to start building the bundle. The context is an absolute string to the directory that contains the entry files.


## `context`

`string`

The base directory, an __absolute path__, for resolving entry points and loaders from configuration.

``` js
module.exports = {
  //...
  context: path.resolve(__dirname, 'app')
};
```

By default the current directory is used, but it's recommended to pass a value in your configuration. This makes your configuration independent from CWD (current working directory).

---


## `entry`

`string` `[string]` `object = { <key> string | [string] }` `(function() => string | [string] | object = { <key> string | [string] })`

The point or points where to start the application bundling process. If an array is passed then all items will be processed.

A dynamically loaded module is __not__ an entry point.

General rule: one entry point per HTML page. Single-page application: one entry point. Multi-page application: multiple entry points.

```js
module.exports = {
  //...
  entry: {
    home: './home.js',
    about: './about.js',
    contact: './contact.js'
  }
};
```


### Naming

If a string or array of strings is passed, the chunk is named `main`. If an object is passed, each key is the name of a chunk, and the value describes the entry point for the chunk.


### Dynamic entry

If a function is passed then it will be invoked on every [make](/api/compiler-hooks/#make) event.

> Note that the make event triggers when webpack starts and for every invalidation when [watching for file changes](/configuration/watch/).

```js
module.exports = {
  //...
  entry: () => './demo'
};
```

or

```js
module.exports = {
  //...
  entry: () => new Promise((resolve) => resolve(['./demo', './demo2']))
};
```

For example: you can use dynamic entries to get the actual entries from an external source (remote server, file system content or database):

__webpack.config.js__

``` js
module.exports = {
  entry() {
    return fetchPathsFromSomeExternalSource(); // returns a promise that will be resolved with something like ['src/main-layout.js', 'src/admin-layout.js']
  }
};
```

When combining with the [`output.library`](/configuration/output/#outputlibrary) option: If an array is passed only the last item is exported.
