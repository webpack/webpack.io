---
title: Plugins
contributors:
  - simon04
  - gonzoyumo
  - rouzbeh84
  - aretecode
  - eko3alpha
---

webpack has a rich plugin interface. Most of the features within webpack itself use this plugin interface. This makes webpack **flexible**.

Name                                                     | Description
-------------------------------------------------------- | -----------
[`AggressiveSplittingPlugin`](/plugins/aggressive-splitting-plugin) | Splits the original chunks into smaller chunks
[`BabelMinifyWebpackPlugin`](/plugins/babel-minify-webpack-plugin) | Minification with [babel-minify](https://github.com/babel/minify)
[`BannerPlugin`](/plugins/banner-plugin)                 | Add a banner to the top of each generated chunk
[`CommonsChunkPlugin`](/plugins/commons-chunk-plugin)    | Extract common modules shared between chunks
[`ComponentWebpackPlugin`](/plugins/component-webpack-plugin) | Use components with webpack
[`CompressionWebpackPlugin`](/plugins/compression-webpack-plugin) | Prepare compressed versions of assets to serve them with Content-Encoding
[`ContextReplacementPlugin`](/plugins/context-replacement-plugin) | Override the inferred context of a `require` expression
[`DefinePlugin`](/plugins/define-plugin)           | Allow global constants configured at compile time
[`DllPlugin`](/plugins/dll-plugin)                 | Split bundles in order to drastically improve build time
[`EnvironmentPlugin`](/plugins/environment-plugin) | Shorthand for using the [`DefinePlugin`](./define-plugin) on `process.env` keys
[`ExtractTextWebpackPlugin`](/plugins/extract-text-webpack-plugin) | Extract text (CSS) from your bundles into a separate file
[`HotModuleReplacementPlugin`](/plugins/hot-module-replacement-plugin) | Enable Hot Module Replacement (HMR)
[`HtmlWebpackPlugin`](/plugins/html-webpack-plugin)          | Easily create HTML files to serve your bundles
[`I18nWebpackPlugin`](/plugins/i18n-webpack-plugin)          | Add i18n support to your bundles
[`IgnorePlugin`](/plugins/ignore-plugin)                     | Exclude certain modules from bundles
[`LimitChunkCountPlugin`](/plugins/limit-chunk-count-plugin) | Set min/max limits for chunking to better control chunking
[`LoaderOptionsPlugin`](/plugins/loader-options-plugin)      | Used for migrating from webpack 1 to 2
[`MinChunkSizePlugin`](/plugins/min-chunk-size-plugin)       | Keep chunk size above the specified limit
[`NoEmitOnErrorsPlugin`](/plugins/no-emit-on-errors-plugin)  | Skip the emitting phase when there are compilation errors
[`NormalModuleReplacementPlugin`](/plugins/normal-module-replacement-plugin) | Replace resource(s) that matches a regexp
[`NpmInstallWebpackPlugin`](/plugins/npm-install-webpack-plugin) | Auto-install missing dependencies during development
[`ProvidePlugin`](/plugins/provide-plugin)                       | Use modules without having to use import/require
[`SourceMapDevToolPlugin`](/plugins/source-map-dev-tool-plugin)  | Enables a more fine grained control of source maps
[`UglifyjsWebpackPlugin`](/plugins/uglifyjs-webpack-plugin)      | Enables control of the version of UglifyJS in your project
[`ZopfliWebpackPlugin`](/plugins/zopfli-webpack-plugin)          | Prepare compressed versions of assets with node-zopfli

For more third-party plugins, see the list from [awesome-webpack](https://github.com/webpack-contrib/awesome-webpack#webpack-plugins).

![Awesome](../assets/awesome-badge.svg)
