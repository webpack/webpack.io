---
title: BannerPlugin
contributors:
  - simon04
  - byzyk
related:
  - title: banner-plugin-hashing test
    url: https://github.com/webpack/webpack/blob/master/test/configCases/plugins/banner-plugin-hashing/webpack.config.js
---

Adds a banner to the top of each generated chunk.

```javascript
const webpack = require('webpack');

new webpack.BannerPlugin(banner);
// or
new webpack.BannerPlugin(options);
```


## Options

<!-- eslint-skip -->

```js
{
  banner: string | function, // the banner as string or function, it will be wrapped in a comment
  raw: boolean, // if true, banner will not be wrapped in a comment
  entryOnly: boolean, // if true, the banner will only be added to the entry chunks
  test: string | RegExp | Array,
  include: string | RegExp | Array,
  exclude: string | RegExp | Array,
}
```

## Usage


```javascript
import webpack from 'webpack';

// string
new webpack.BannerPlugin({
  banner: 'hello world'
});

// function
new webpack.BannerPlugin({
  banner: (yourVariable) => { return `yourVariable: ${yourVariable}`; }
});
```


## Placeholders

Since webpack 2.5.0, placeholders are evaluated in the `banner` string:

```javascript
import webpack from 'webpack';

new webpack.BannerPlugin({
  banner: 'hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]'
});
```
