---
title: Dependency Graph
sort: 8
contributors:
  - TheLarkInn
  - EugeneHlushko
  - fokusferit
related:
  - title: HTTP2 Aggressive Splitting Example
    url: https://github.com/webpack/webpack/tree/master/examples/http2-aggressive-splitting
  - title: webpack & HTTP/2
    url: https://medium.com/webpack/webpack-http-2-7083ec3f3ce6
---

Any time one file depends on another, webpack treats this as a _dependency_. This allows webpack to take non-code assets, such as images or web fonts, and also provide them as _dependencies_ for your application.

When webpack processes your application, it starts from a list of modules defined on the command line or in its config file.
Starting from these [_entry points_](/concepts/entry-points/), webpack recursively builds a _dependency graph_ that includes every module your application needs, then bundles all of those modules into a small number of _bundles_ - often, only one - to be loaded by the browser.

T> Bundling your application is especially powerful for _HTTP/1.1_ clients, as it minimizes the number of times your app has to wait while the browser starts a new request. For _HTTP/2_, you can also use [Code Splitting](/guides/code-splitting/) to achieve best results.
