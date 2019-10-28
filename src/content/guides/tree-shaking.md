---
title: Tree Shaking
sort: 16
contributors:
  - simon04
  - zacanger
  - alexjoverm
  - avant1
  - MijaelWatts
  - dmitriid
  - probablyup
  - gish
  - lumo10
  - byzyk
  - pnevares
  - EugeneHlushko
  - AnayaDesign
  - torifat
  - fokusferit
related:
  - title: "webpack 4 beta — try it today!"
    url: https://medium.com/webpack/webpack-4-beta-try-it-today-6b1d27d7d7e2#9a67
  - title: Debugging Optimization Bailouts
    url: https://webpack.js.org/plugins/module-concatenation-plugin/#debugging-optimization-bailouts
  - title: Issue 6074 - Add support for more complex selectors for sideEffects
    url: https://github.com/webpack/webpack/issues/6074
---

_Tree shaking_ is a term commonly used in the JavaScript context for dead-code elimination. It relies on the [static structure](http://exploringjs.com/es6/ch_modules.html#static-module-structure) of ES2015 module syntax, i.e. [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) and [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export). The name and concept have been popularized by the ES2015 module bundler [rollup](https://github.com/rollup/rollup).

The webpack 2 release came with built-in support for ES2015 modules (alias _harmony modules_) as well as unused module export detection. The new webpack 4 release expands on this capability with a way to provide hints to the compiler via the `"sideEffects"` `package.json` property to denote which files in your project are "pure" and therefore safe to prune if unused.

T> The remainder of this guide will stem from [Getting Started](/guides/getting-started). If you haven't read through that guide already, please do so now.


## Add a Utility

Let's add a new utility file to our project, `src/math.js`, that exports two functions:

__project__

``` diff
webpack-demo
|- package.json
|- webpack.config.js
|- /dist
  |- bundle.js
  |- index.html
|- /src
  |- index.js
+ |- math.js
|- /node_modules
```

__src/math.js__

```javascript
export function square(x) {
  return x * x;
}

export function cube(x) {
  return x * x * x;
}
```

Set the `mode` configuration option to [development](/configuration/mode/#mode-development) to make sure that the bundle is not minified:

__webpack.config.js__

``` diff
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
+ mode: 'development',
+ optimization: {
+   usedExports: true,
+ },
};
```

With that in place, let's update our entry script to utilize one of these new methods and remove `lodash` for simplicity:

__src/index.js__

``` diff
- import _ from 'lodash';
+ import { cube } from './math.js';

  function component() {
-   const element = document.createElement('div');
+   const element = document.createElement('pre');

-   // Lodash, now imported by this script
-   element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   element.innerHTML = [
+     'Hello webpack!',
+     '5 cubed is equal to ' + cube(5)
+   ].join('\n\n');

    return element;
  }

  document.body.appendChild(component());
```

Note that we __did not `import` the `square` method__ from the `src/math.js` module. That function is what's known as "dead code", meaning an unused `export` that should be dropped. Now let's run our npm script, `npm run build`, and inspect the output bundle:

__dist/bundle.js (around lines 90 - 100)__

```js
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {
  'use strict';
  /* unused harmony export square */
  /* harmony export (immutable) */ __webpack_exports__['a'] = cube;
  function square(x) {
    return x * x;
  }

  function cube(x) {
    return x * x * x;
  }
});
```

Note the `unused harmony export square` comment above. If you look at the code below it, you'll notice that `square` is not being imported, however, it is still included in the bundle. We'll fix that in the next section.


## Mark the file as side-effect-free

In a 100% ESM module world, identifying side effects is straightforward. However, we aren't there yet, so in the mean time it's necessary to provide hints to webpack's compiler on the "pureness" of your code.

The way this is accomplished is the `"sideEffects"` package.json property.

```json
{
  "name": "your-project",
  "sideEffects": false
}
```

All the code noted above does not contain side effects, so we can mark the property as `false` to inform webpack that it can safely prune unused exports.

T> A "side effect" is defined as code that performs a custom behavior when imported, other than exposing one or more exports. An example of this are polyfills, which affect the global scope and usually do not provide an export.

If your code did have some side effects though, an array can be provided instead:

```json
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js"
  ]
}
```

The array accepts relative, absolute, and glob patterns to the relevant files. It uses [micromatch](https://github.com/micromatch/micromatch#matching-features) under the hood.

T> Note that any imported file is subject to tree shaking. This means if you use something like `css-loader` in your project and import a CSS file, it needs to be added to the side effect list so it will not be unintentionally dropped in production mode:

```json
{
  "name": "your-project",
  "sideEffects": [
    "./src/some-side-effectful-file.js",
    "*.css"
  ]
}
```

Finally, `"sideEffects"` can also be set from the [`module.rules` configuration option](/configuration/module/#modulerules).

## Clarifying tree shaking and `sideEffects`

The [`sideEffects`](/configuration/optimization/#optimizationsideeffects) and [`usedExports`](/configuration/optimization/#optimizationusedexports) (more known as tree shaking) optimizations are two different things.

__`sideEffects` is much more effective__ since it allows to skip whole modules/files and the complete subtree.

`usedExports` relies on [terser](https://github.com/terser-js/terser) to detect side effects in statements. It is a difficult task in JavaScript and not as effective as straighforward `sideEffects` flag. It also can't skip subtree/dependencies since the spec says that side effects need to be evaluated. While exporting function works fine, React's Higher Order Components (HOC) are problematic in this regard.

Let's make an example:

```javascript
import { Button } from '@shopify/polaris';
```

The pre-bundled version looks like this:

```javascript
import hoistStatics from 'hoist-non-react-statics';

function Button(_ref) {
  // ...
}

function merge() {
  var _final = {};

  for (var _len = arguments.length, objs = new Array(_len), _key = 0; _key < _len; _key++) {
    objs[_key] = arguments[_key];
  }

  for (var _i = 0, _objs = objs; _i < _objs.length; _i++) {
    var obj = _objs[_i];
    mergeRecursively(_final, obj);
  }

  return _final;
}

function withAppProvider() {
  return function addProvider(WrappedComponent) {
    var WithProvider =
    /*#__PURE__*/
    function (_React$Component) {
      // ...
      return WithProvider;
    }(Component);

    WithProvider.contextTypes = WrappedComponent.contextTypes ? merge(WrappedComponent.contextTypes, polarisAppProviderContextTypes) : polarisAppProviderContextTypes;
    var FinalComponent = hoistStatics(WithProvider, WrappedComponent);
    return FinalComponent;
  };
}

var Button$1 = withAppProvider()(Button);

export {
  // ...,
  Button$1
};
```

When `Button` is unused you can effectively remove the `export { Button$1 };` which leaves all the remaining code. So the question is "Does this code have any side effects or can it be safely removed?". Difficult to say, especially because of this line `withAppProvider()(Button)`. `withAppProvider` is called and the return value is also called. Are there any side effects when calling `merge` or `hoistStatics`? Are there side effects when assigning `WithProvider.contextTypes` (Setter?) or when reading `WrappedComponent.contextTypes` (Getter?).

Terser actually tries to figure it out, but it doesn't know for sure in many cases. This doesn't mean that terser is not doing its job well because it can't figure it out. It's too difficult to determine it reliably in a dynamic language like JavaScript.

But we can help terser by using the `/*#__PURE__*/` annotation. It flags a statement as side effect free. The following change would make it possible to tree-shake the code:

`var Button$1 = /*#__PURE__*/ withAppProvider()(Button);`

This would allow to remove this piece of code. But there are still questions with the imports which need to be included/evaluated because they could contain side effects.

To tackle this, we use the [`"sideEffects"`](/guides/tree-shaking/#mark-the-file-as-side-effect-free) property in `package.json`.

It's similar to `/*#__PURE__*/` but on a module level instead of a statement level. It says (`"sideEffects"` property): "If no direct export from a module flagged with no-sideEffects is used, the bundler can skip evaluating the module for side effects.".

In the Shopify's Polaris example, original modules look like this:

__index.js__

```javascript
import './configure';
export * from './types';
export * from './components';
```

__components/index.js__

```javascript
// ...
export { default as Breadcrumbs } from './Breadcrumbs';
export { default as Button, buttonFrom, buttonsFrom, } from './Button';
export { default as ButtonGroup } from './ButtonGroup';
// ...
```

__package.json__

```json
// ...
"sideEffects": [
  "**/*.css",
  "**/*.scss",
  "./esnext/index.js",
  "./esnext/configure.js"
],
// ...
```

For `import { Button } from "@shopify/polaris";` this has the following implications:

- include it: include the module, evaluate it and continue analysing dependencies
- skip over: don't include it, don't evaluate it but continue analysing dependencies
- exclude it: don't include it, don't evaluate it and don't analyse dependencies

Specifically per matching resource(s):

- `index.js`: No direct export is used, but flagged with sideEffects -> include it
- `configure.js`: No export is used, but flagged with sideEffects -> include it
- `types/index.js`: No export is used, not flagged with sideEffects -> exclude it
- `components/index.js`: No direct export is used, not flagged with sideEffects, but reexported exports are used -> skip over
- `components/Breadcrumbs.js`: No export is used, not flagged with sideEffects -> exclude it. This also excluded all dependencies like `components/Breadcrumbs.css` even if they are flagged with sideEffects.
- `components/Button.js`: Direct export is used, not flagged with sideEffects -> include it
- `components/Button.css`: No export is used, but flagged with sideEffects -> include it

In this case only 4 modules are included into the bundle:

- `index.js`: pretty much empty
- `configure.js`
- `components/Button.js`
- `components/Button.css`

After this optimization, other optimizations can still apply. For example: `buttonFrom` and `buttonsFrom` exports from `Button.js` are unused too. `usedExports` optimization will pick it up and terser may be able to drop some statements from the module.

Module Concatenation also applies. So that these 4 modules plus the entry module (and probably more dependencies) can be concatenated. __`index.js` has no code generated in the end__.

## Minify the Output

So we've cued up our "dead code" to be dropped by using the `import` and `export` syntax, but we still need to drop it from the bundle. To do that, set the `mode` configuration option to [`production`](/configuration/mode/#mode-production).

__webpack.config.js__

``` diff
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
- mode: 'development',
- optimization: {
-   usedExports: true,
- }
+ mode: 'production',
};
```

T> Note that the `--optimize-minimize` flag can be used to enable `TerserPlugin` as well.

With that squared away, we can run another `npm run build` and see if anything has changed.

Notice anything different about `dist/bundle.js`? The whole bundle is now minified and mangled, but, if you look carefully, you won't see the `square` function included but will see a mangled version of the `cube` function (`function r(e){return e*e*e}n.a=r`). With minification and tree shaking, our bundle is now a few bytes smaller! While that may not seem like much in this contrived example, tree shaking can yield a significant decrease in bundle size when working on larger applications with complex dependency trees.

T> [ModuleConcatenationPlugin](/plugins/module-concatenation-plugin) is needed for the tree shaking to work. It is added by `mode: "production"`. If you are not using it, remember to add the [ModuleConcatenationPlugin](/plugins/module-concatenation-plugin) manually.

## Conclusion

So, what we've learned is that in order to take advantage of _tree shaking_, you must...

- Use ES2015 module syntax (i.e. `import` and `export`).
- Ensure no compilers transform your ES2015 module syntax into CommonJS modules (this is the default behavior of the popular Babel preset @babel/preset-env - see the [documentation](https://babeljs.io/docs/en/babel-preset-env#modules) for more details).
- Add a `"sideEffects"` property to your project's `package.json` file.
- Use the [`production`](/configuration/mode/#mode-production) `mode` configuration option to enable [various optimizations](/configuration/mode/#usage) including minification and tree shaking.

You can imagine your application as a tree. The source code and libraries you actually use represent the green, living leaves of the tree. Dead code represents the brown, dead leaves of the tree that are consumed by autumn. In order to get rid of the dead leaves, you have to shake the tree, causing them to fall.

If you are interested in more ways to optimize your output, please jump to the next guide for details on building for [production](/guides/production).
