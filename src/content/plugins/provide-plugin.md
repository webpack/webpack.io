---
title: ProvidePlugin
contributors:
  - sokra
  - simon04
  - re-fort
  - byzyk
  - seckin92
  - fokusferit
---

Automatically load modules instead of having to `import` or `require` them everywhere.

``` js
new webpack.ProvidePlugin({
  identifier: 'module1',
  // ...
});
```

or

``` js
new webpack.ProvidePlugin({
  identifier: ['module1', 'property1'],
  // ...
});
```

By default, module resolution path is current folder (`./**)` and `node_modules`.

It is also possible to specify full path:

```js
new webpack.ProvidePlugin({
  identifier: path.resolve(path.join(__dirname, 'src/module1'))
  // ...
});
```

Whenever the `identifier` is encountered as free variable in a module, the `module` is loaded automatically and the `identifier` is filled with the exports of the loaded `module` (or `property` in order to support named exports).

For importing the default export of an ES2015 module, you have to specify the default property of module.

## Usage: jQuery

To automatically load `jquery` we can point both variables it exposes to the corresponding node module:

```javascript
new webpack.ProvidePlugin({
  $: 'jquery',
  jQuery: 'jquery'
});
```

Then in any of our source code:

```javascript
// in a module
$('#item'); // <= just works
jQuery('#item'); // <= just works
// $ is automatically set to the exports of module "jquery"
```


## Usage: jQuery with Angular 1

Angular looks for `window.jQuery` in order to determine whether jQuery is present, see the [source code](https://github.com/angular/angular.js/blob/v1.5.9/src/Angular.js#L1821-L1823).

```javascript
new webpack.ProvidePlugin({
  'window.jQuery': 'jquery'
});
```


## Usage: Lodash Map

```javascript
new webpack.ProvidePlugin({
  _map: ['lodash', 'map']
});
```

### Usage: Vue.js

```javascript
new webpack.ProvidePlugin({
  Vue: ['vue/dist/vue.esm.js', 'default']
});
```
