---
title: ContextExclusionPlugin
contributors:
  - jeffin
---

_Context_ refers to a [require with an expression](/guides/dependency-management/#require-with-expression) such as `require('./locale/' + name + '.json')`.

The `ContextExclusionPlugin` allows you to exclude context. Provide RegExp as an argument when initializing the Plugin to exclude all context that matches it.

__webpack.config.js__

``` javascript
module.exports = {
  plugins: [
    new webpack.ContextExclusionPlugin(/dont/)
  ]
};
```
