---
title: The Manifest
sort: 10
contributors:
  - skipjack
  - EugeneHlushko
  - fokusferit
related:
  - title: Separating a Manifest
    url: https://survivejs.com/webpack/optimizing/separating-manifest/
  - title: Predictable Long Term Caching with webpack
    url: https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
  - title: Caching
    url: /guides/caching/
---

In a typical application or site built with webpack, there are three main types of code:

1. The source code you, and maybe your team, have written.
2. Any third-party library or "vendor" code your source is dependent on.
3. A webpack runtime and __manifest__ that conducts the interaction of all modules.

This article will focus on the last of these three parts: the runtime and, in particular, the manifest.


## Runtime

The runtime, along with the manifest data, is all the code webpack needs to connect your modularized application while it's running in the browser. It contains the loading and resolving logic needed to connect your modules as they interact. This includes connecting modules that have already been loaded into the browser as well as logic to lazy-load the ones that haven't.


## Manifest

Once your application hits the browser in the form of `index.html` file, some bundles and a variety of other assets required by your application must be loaded and linked somehow. That `/src` directory you meticulously laid out is now bundled, minified and maybe even split into smaller chunks for lazy-loading by webpack's [`optimization`](/configuration/optimization/). So how does webpack manage the interaction between all of your required modules? This is where the manifest data comes in...

As the compiler enters, resolves, and maps out your application, it keeps detailed notes on all your modules. This collection of data is called the "Manifest," and it's what the runtime will use to resolve and load modules once they've been bundled and shipped to the browser. No matter which [module syntax](/api/module-methods) you have chosen, those `import` or `require` statements have now become `__webpack_require__` methods that point to module identifiers. Using the data in the manifest, the runtime will be able to find out where to retrieve the modules behind the identifiers.


## The Problem

So now you have a little bit of insight about how webpack works behind the scenes. "But, how does this affect me?", you might ask. The answer is that most of the time it doesn't. The runtime will do its thing, utilizing the manifest, and everything will appear to magically work once your application hits the browser. However, if you decide to improve the performance of your projects by utilizing browser caching, this process will all of a sudden become an important thing to understand.

By using content hashes within your bundle file names, you can indicate to the browser when the content of a file has changed, thus invalidating the cache. Once you start doing this though, you'll immediately notice some funny behavior. Certain hashes change even when their content apparently does not. This is caused by the injection of the runtime and manifest, which changes every build.

See [the manifest section](/guides/output-management/#the-manifest) of our _Output management_ guide to learn how to extract the manifest, and read the guides below to learn more about the intricacies of long term caching.
