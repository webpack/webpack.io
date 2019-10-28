---
title: HotModuleReplacementPlugin
contributors:
  - skipjack
  - byzyk
related:
  - title: Concepts - Hot Module Replacement
    url: /concepts/hot-module-replacement
  - title: API - Hot Module Replacement
    url: /api/hot-module-replacement
---

Enables [Hot Module Replacement](/concepts/hot-module-replacement), otherwise known as HMR.

W> HMR should __never__ be used in production.


## Basic Usage

Enabling HMR doesn't require a lot of knowledge and in most cases no options are necessary.

``` javascript
new webpack.HotModuleReplacementPlugin({
  // Options...
});
```


## Options

The following options are accepted:

- `multiStep` (boolean): If `true`, the plugin will build in two steps -- first compiling the hot update chunks, and then the remaining normal assets.
- `fullBuildTimeout` (number): The delay between the two steps when `multiStep` is enabled.
- `requestTimeout` (number): The timeout used for manifest download (since webpack 3.0.0)

W> These options are experimental and may be deprecated. As mentioned above, they are typically not necessary and including a `new webpack.HotModuleReplacementPlugin()` is enough.
