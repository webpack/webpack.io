---
title: webpack
---

## Write your code

<div class="homepage__wrap">
<div class="homepage__left">
__app.js__

```js
import bar from './bar';

bar();
```
</div>
<div class="homepage__right">
__bar.js__

```js
export default function bar() {
  //
}
```
</div>
</div>


## Bundle with webpack

<div class="homepage__wrap">
<div class="homepage__left">
__webpack.config.js__

```js
module.exports = {
  entry: './app.js',
  output: {
    filename: 'bundle.js'
  }
}
```
</div>
<div class="homepage__right">
__page.html__

```html
<html>
  <head>
    ...
  </head>
  <body>
    ...
    <script src="bundle.js"></script>
  </body>
</html>
```

Then run `webpack` on the command-line to create `bundle.js`.
</div>
</div>

## It's that simple

__[Get Started](/guides/getting-started)__ quickly in our __Guides__ section, or dig into the __[Concepts](/concepts)__ section for more high-level information on the core notions behind behind webpack.
