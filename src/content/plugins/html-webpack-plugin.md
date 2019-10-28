---
title: HtmlWebpackPlugin
contributors:
  - ampedandwired
  - simon04
  - Sibiraj-S
  - EugeneHlushko
---

The [`HtmlWebpackPlugin`](https://github.com/jantimon/html-webpack-plugin) simplifies creation of HTML files to serve your webpack bundles. This is especially useful for webpack bundles that include a hash in the filename which changes every compilation. You can either let the plugin generate an HTML file for you, supply your own template using [lodash templates](https://lodash.com/docs#template), or use your own [loader](/loaders).


## Installation

``` bash
npm install --save-dev html-webpack-plugin
```


## Basic Usage

The plugin will generate an HTML5 file for you that includes all your webpack
bundles in the body using `script` tags. Add the plugin to your webpack
config as follows:

```javascript
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');

module.exports = {
  entry: 'index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'index_bundle.js'
  },
  plugins: [new HtmlWebpackPlugin()]
};
```

This will generate a file `dist/index.html` containing the following:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>webpack App</title>
  </head>
  <body>
    <script src="index_bundle.js"></script>
  </body>
</html>
```

If you have multiple webpack entry points, they will all be included with `<script>` tags in the generated HTML.

If you have any CSS assets in webpack's output (for example, CSS extracted with the [MiniCssExtractPlugin](/plugins/mini-css-extract-plugin/)) then these will be included with `<link>` tags in the `<head>` element of generated HTML.


## Configuration

For all configuration options, please see the [plugin documentation](https://github.com/jantimon/html-webpack-plugin#options).


## Third party addons

The plugin supports addons. For a list see the [documentation](https://github.com/jantimon/html-webpack-plugin#plugins).
