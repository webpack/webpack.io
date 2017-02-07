---
title: style-loader
source: https://raw.githubusercontent.com/webpack/style-loader/master/README.md
edit: https://github.com/webpack/style-loader/edit/master/README.md

---
# webpack的样式加载器

通过注入`<style>`标签将CSS添加到DOM中

## 安装
```
npm install style-loader --save-dev
```

## 用法

[文档：使用加载器](http://webpack.github.io/docs/using-loaders.html)

### 简单API
``` javascript
require("style-loader!raw-loader!./file.css");
// => 在file.css文件中添加规则
```

建议将它与[`css-loader`](https://github.com/webpack/css-loader)结合使用: `require("style-loader!css-loader!./file.css")`.

也可以添加URL而不是CSS字符串：
``` javascript
require("style-loader/url!file-loader!./file.css");
// => 把<link rel=“stylesheet”这一行添加到文档file.css中
```

### 本地作用域的CSS
(实验)

当使用本地[作用域的CSS](https://github.com/webpack/css-loader#local-scope)时，模块导出生成的标识符：
``` javascript
var style = require("style-loader!css-loader!./file.css");
style.placeholder1 === "z849f98ca812bc0d099a43e0f90184"
```

### 引用计数API
``` javascript
var style = require("style-loader/useable!css-loader!./file.css");
style.use(); // = style.ref();
style.unuse(); // = style.unref();
```

样式不会在`require`上添加，而是在调用`use`/`ref`时添加样式。如果`unuse`/`unref`的调用次数与`use`/`ref`一样，样式则会从页面中删除

注意：当`unuse`/`unref`被调用次数多时，行为是未定义的。所以不要这样做。

### 选项

#### `insertAt`

默认情况下，样式加载器将`<style>`元素附加到页面的`<head>`标记的末尾。这将导致由加载器创建的CSS优先于文档头中已经存在的CSS。要在头部的开头插入样式元素，请将此查询参数设置为“top”，例如。`require('../style.css?insertAt=top')`.

#### `singleton`

如果已定义，则style-loader将重用单个 `<style>` 元素，而不是为每个所需的模块添加/删除单个元素。注意：默认情况下，IE9中启用此选项，这对页面上允许的样式标记数有严格的限制。您可以使用singleton查询参数启用或禁用它(`?singleton` or `?-singleton`)。

## 推荐配置

按照惯例，引用计数的API应绑定到.useable.css，而简单的API绑定到.css（其他文件类型也类似，即.useable.less和.less）

所以推荐的webpack配置是
``` javascript
{
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
        ],
      },
      {
        test: /\.useable\.css$/,
        use: [
          {
            loader: "style-loader",
            options: {
              useable: true
            },
          },
          { loader: "css-loader" },
        ],
      },
    ],
  },
}
```

关于source map支持和资源方面，引用URL应注意：当样式加载器与？sourceMap选项一起使用时，CSS模块将生成为`Blob`s，因此相对路径无法辨别（它们将是相对于`chrome:blob`或`chrome:devtools`）。为了使资源保持正确的路径，必须设置webpack配置的`output.publicPath`属性，以便生成绝对路径。
## License

MIT (http://www.opensource.org/licenses/mit-license.php)

***

> 原文：https://webpack.js.org/loaders/style-loader/
