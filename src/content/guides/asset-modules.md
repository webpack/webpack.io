---
title: Asset Modules
sort: 24
contributors:
  - smelukov
  - EugeneHlushko
related:
  - title: webpack 5 - Asset Modules
    url: https://dev.to/smelukov/webpack-5-asset-modules-2o3h
---

Asset Modules is a type of module that allows to use asset files (fonts, icons, etc) without configuring additional loaders.

Prior to webpack 5 it was common to use:

- [`raw-loader`](/loaders/raw-loader/) to import a file as a string
- [`url-loader`](/loaders/url-loader/) to inline a file into the bundle as a data URI
- [`file-loader`](/loaders/file-loader/) to emit a file into the output directory

Asset Modules type replaces all of these loaders by adding 4 new module types:

- `asset/resource` emits a separate file and exports the URL. Previously achievable by using `url-loader`.
- `asset/inline` exports a data URI of the asset. Previously achievable by using `url-loader`.
- `asset/source` exports the source code of the asset. Previously achievable by using `raw-loader`.
- `asset` automatically chooses between exporting a data URI and emitting a separate file. Previously achievable by using `url-loader` with asset size limit.

W> This is an experimental feature. Enable Asset Modules by setting `experiments.asset: true` in [experiments](/configuration/experiments/) option of your webpack configuration.

__webpack.config.js__

```diff
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
+ experiments: {
+   asset: true
+ },
};
```

## Resource assets

__webpack.config.js__

``` diff
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  experiments: {
    asset: true
  },
+ module: {
+   rules: [
+     {
+       test: /\.png/,
+       type: 'asset/resource'
+     }
+   ]
+ },
};
```

__src/index.js__

```js
import mainImage from './images/main.png';

img.src = mainImage; // '/dist/151cfcfa1bd74779aadb.png'
```

All `.png` files will be emitted to the output directory and their paths will be injected into the bundles.

### Custom output filename

By default, `asset/resource` modules are emitting with `[hash][ext]` filename into output directory.

You can modify this template by setting [`output.assetModuleFilename`](/configuration/output/#outputassetmodulefilename) in your webpack configuration:

__webpack.config.js__

```diff
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
+   assetModuleFilename: 'images/[hash][ext]'
  },
  experiments: {
    asset: true
  },
  module: {
    rules: [
      {
        test: /\.png/,
        type: 'asset/resource'
      }
    ]
  },
};
```

Another case to customize output filename is to emit some kind of assets to a specified directory:

```diff
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
+   assetModuleFilename: 'images/[hash][ext]'
  },
  experiments: {
    asset: true
  },
  module: {
    rules: [
      {
        test: /\.png/,
        type: 'asset/resource'
-     }
+     },
+     {
+       test: /\.html/,
+       type: 'asset/resource',
+       generator: {
+         filename: 'static/[hash][ext]'
+       }
+     }
    ]
  },
};
```

With this configuration all the `html` files will be emitted into a `static` directory within the output directory.

`Rule.generator.filename` is the same as [`output.assetModuleFilename`](/configuration/output/#outputassetmodulefilename) and works only with `asset` and `asset/resource` module types.

## Inlining assets

__webpack.config.js__

``` diff
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
-   assetModuleFilename: 'images/[hash][ext]'
  },
  experiments: {
    asset: true
  },
  module: {
    rules: [
      {
-       test: /\.png/,
-       type: 'asset/resource'
+       test: /\.svg/,
+       type: 'asset/inline'
-     },
+     }
-     {
-       test: /\.html/,
-       type: 'asset/resource',
-       generator: {
-         filename: 'static/[hash][ext]'
-       }
-     }
    ]
  }
};
```

__src/index.js__

```diff
- import mainImage from './images/main.png';
+ import metroMap from './images/matro.svg';

- img.src = mainImage; // '/dist/151cfcfa1bd74779aadb.png'
+ block.style.background = `url(${metroMap}); // url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDo...vc3ZnPgo=)
```

All `.svg` files will be injected into the bundles as data URI.

### Custom data URI generator

By default, data URI emitted by webpack represents file contents encoded by using Base64 algorithm.

If you want to use a custom encoding algorithm, you may specify a custom function to encode a file content:

__webpack.config.js__

```diff
const path = require('path');
+ const svgToMiniDataURI = require('mini-svg-data-uri');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  experiments: {
    asset: true
  },
  module: {
    rules: [
      {
        test: /\.svg/,
        type: 'asset/inline',
+       generator: {
+         dataUrl: content => {
+           content = content.toString();
+           return svgToMiniDataURI(content);
+         }
+       }
      }
    ]
  },
};
```

Now all `.svg` files will be encoded by `mini-svg-data-uri` package.

## Source assets

__webpack.config.js__

```diff
const path = require('path');
- const svgToMiniDataURI = require('mini-svg-data-uri');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  experiments: {
    asset: true
  },
  module: {
    rules: [
      {
-       test: /\.svg/,
-       type: 'asset/inline',
-       generator: {
-         dataUrl: content => {
-           content = content.toString();
-           return svgToMiniDataURI(content);
-         }
-       }
+       test: /\.txt/,
+       type: 'asset/source',
      }
    ]
  },
};
```

__src/example.txt__

```text
Hello world
```

__src/index.js__

```diff
- import metroMap from './images/matro.svg';
+ import exampleText from './example.txt';

- block.style.background = `url(${metroMap}); // url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDo...vc3ZnPgo=)
+ block.textContent = exampleText; // 'Hello world'
```

All `.txt` files will be injected into the bundles as is.

## General asset type

__webpack.config.js__

``` diff
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  experiments: {
    asset: true
  },
  module: {
    rules: [
      {
+       test: /\.txt/,
+       type: 'asset',
      }
    ]
  },
};
```

Now webpack will automatically choose between `resource` and `inline` by following a default condition: a file with size less than 8kb will be treated as a `inline` module type and `resource` module type otherwise.

You can change this condition by setting a [`Rule.parser.dataUrlCondition.maxSize`](/configuration/module/#ruleparserdataurlcondition) option on the module rule level of your webpack configuration:

__webpack.config.js__

``` diff
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  experiments: {
    asset: true
  },
  module: {
    rules: [
      {
        test: /\.txt/,
        type: 'asset',
+       parser: {
+         dataUrlCondition: {
+           maxSize: 4 * 1024 // 4kb
+         }
+       }
      }
    ]
  },
};
```

Also you can [specify a function](/configuration/module/#ruleparserdataurlcondition) to decide to inlining a module or not.
