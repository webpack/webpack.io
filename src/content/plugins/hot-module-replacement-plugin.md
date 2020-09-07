---
title: HotModuleReplacementPlugin
contributors:
  - skipjack
  - byzyk
  - chenxsan
  - snitin315
related:
  - title: Concepts - Hot Module Replacement
    url: /concepts/hot-module-replacement
  - title: API - Hot Module Replacement
    url: /api/hot-module-replacement
---

Enables [Hot Module Replacement](/concepts/hot-module-replacement), otherwise known as HMR.

W> HMR should __never__ be used in production.


## Basic Usage

Enabling HMR is easy and in most cases no options are necessary.

``` javascript
new webpack.HotModuleReplacementPlugin({
  // Options...
});
```
