---
title: Authoring Libraries
contributors:
    - pksjce
    - johnstew
    - simon04
---
webpack是一个用来打包应用（application）和库（library）的代码的工具。如果你是一个JavaScript库的作者，并且想要将你的打包逻辑给流程化（streamline），那么这篇文档将会帮助到你。

## 创建一个库

假设你正在写一个小的 library `webpack-numbers'，允许将数字1到5从数字转换为文本表示，反之亦然。实现使用ES6模块，可能看起来像这样：

__src/index.js__
```javascript
import _ from 'lodash';
import numRef from './ref.json';

export function numToWord(num) {
    return _.reduce(numRef, (accum, ref) => {
        return ref.num === num ? ref.word : accum;
    }, '');
};

export function wordToNum(word) {
    return _.reduce(numRef, (accum, ref) => {
        return ref.word === word && word.toLowerCase() ? ref.num : accum;
    }, -1);
};
```
该库的使用方式如下：

```javascript
import * as webpackNumbers from 'webpack-numbers';
...
webpackNumbers.wordToNum('Two') // 输出 2
...

// 使用 CommonJS 模块引入

var webpackNumbers = require('webpack-numbers');
...
webpackNumbers.numToWord(3); // output is Three
...
```

```html
// 使用 script 标签引入

<html>
...
<script src="https://unpkg.com/webpack-numbers"></script>
<script>
    ...
    /* webpackNumbers 是一个全局变量 */
    webpackNumbers.wordToNum('Five') //输出 5
    ...
</script>
</html>
```
完整的源代码和配置请参阅 [webpack-library-example](https://github.com/kalcifer/webpack-library-example)。

## 配置 webpack

现在需要打包这个库，同时要完成以下要求：
  - 不要打包 lodash，而是引用（require）用户加载好的lodash。
  - 库的名字是 `webpack-numbers`，而其变量是 `webpackNumbers`。
  - 库可以用两种方式来引入：`import webpackNumbers from 'webpack-numbers'` 或者 `require('webpack-numbers')`。
  - 当库通过 `script` 标签引入的时候，可以通过全局变量 `webpackNumbers` 来使用。
  - 库可以在 Node.js 中使用。

### 增加 webpack

增加基本的 webpack 配置。

__webpack.config.js__

```javascript
var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'webpack-numbers.js'
    }
};

```

以上代码是打包该库的基本配置。

### 增加 Loaders

我们还需要增加相关的 loader 来编译代码。这里需要一个 `json-loader` 来预编译我们的json文件。

__webpack.config.js__

```javascript
module.exports = {
    // ...
    module: {
        rules: [{
            test: /.json$/,
            use: 'json-loader'
        }]
    }
};
```

### 增加 `externals`

现在，如果执行 `webpack`，你会发现输出了一个非常巨大的文件。进一步观察该文件，你会发现 lodash 和你的代码被一起打包了。

然而对于你的库本身来说，并不需要打包 `lodash`。因此你可能会想将该外部库（external）的控制权交给你的库的用户。

这一点可以通过配置 `externals` 来实现：

__webpack.config.js__

```javascript
module.exports = {
    ...
    externals: {
        "lodash": {
            commonjs: "lodash",
            commonjs2: "lodash",
            amd: "lodash",
            root: "_"
        }
    }
    ...
};
```

这意味着你的库需要能够在用户的环境中获取一个名为 `lodash` 的依赖。

### 增加 `libraryTarget`

为了让该库能够被广泛使用，你需要让它能够兼容不同的环境，例如 CommonJS，AMD，Node.js 或者作为一个全局变量。

为了让你的代码能够被重用，需要在 webpack 配置中增加一个 `library` 属性。

__webpack.config.js__

```javascript
module.exports = {
    ...
    output: {
        ...
        library: 'webpackNumbers'
    }
    ...
};
```

这能让你的库被引入后，可以通过全局变量来使用。

为了让库可以兼容其他环境，还需要在配置中增加 `libraryTarget` 属性。

__webpack.config.js__

```javascript
module.exports = {
    ...
    output: {
        ...
        library: 'webpackNumbers',
        libraryTarget: 'umd' // 其他可取值 - amd, commonjs, commonjs2, commonjs-module, this, var
    }
    ...
};
```

如果设置了 `library` 但没设置 `libraryTarget`， 则`libraryTarget` 默认为 `var`，详见 [config 文档](/configuration/output) 。

### 最终步骤

[使用 webpack 打包你的生产代码](/guides/production-build).

在 `package.json` 中指定主文件（main file）为你生成的文件的路径。

__package.json__

```javascript
{
    ...
    "main": "dist/webpack-numbers.js",
    "module": "src/index.js", // 增加标准的模块，参照： https://github.com/dherman/defense-of-dot-js/blob/master/proposal.md#typical-usage
    ...
}
```

现在你可以 [将其作为一个 npm 包来发布](https://docs.npmjs.com/getting-started/publishing-npm-packages) 并且在 [unpkg.com](https://unpkg.com/#/) 找到它并向你的用户分发。
***

> 原文：https://webpack.js.org/guides/author-libraries/