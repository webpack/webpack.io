---
title: Lazy Loading
sort: 10
contributors:
  - iammerrick
  - chrisVillanueva
  - skipjack
related:
  - title: Lazy Loading ES2015 Modules in the Browser
    url: https://dzone.com/articles/lazy-loading-es2015-modules-in-the-browser
---

T> This guide is a small follow-up to [Code Splitting](/guides/code-splitting). If you have not yet read through that guide, please do so now.

Lazy, or "on demand", loading is a great way to optimize your site or application. This practice essentially boils down to splitting your code at logical breakpoints, and then loading it once the user has done something that requires, or will require, a new block of code. This speeds up the initial load of the application and makes the lightens its overall weight as some blocks may never even be loaded.


## Example

Let's take the example from [Code Splitting](/guides/code-splitting#dynamic-imports) and tweak it a bit to demonstrate this concept even more. The code there does cause a separate chunk, `lodash.bundle.js`, to be generated and technically "lazy-loads" it as soon as the script is run. The trouble is that no user interaction is required to load the bundle -- meaning that every time the page is loaded, the request will fire. This doesn't help us too much, and actually may impact performance negatively.

Let's try something different. We'll add an interaction to log some text to the console when the user clicks a button. However, we'll wait to load that code until the actual interaction occurs for the first time. To do this we'll go back and extend the original example from [Getting Started](/guides/getting-started) and leave the `lodash` in the main chunk.

__src/print.js__

``` js
console.log('The print.js module has loaded! See the network tab in dev tools...');

export default () => {
  console.log('Button Clicked: Here\'s "some text"!');
}
```

__src/index.js__

``` diff
  import _ from 'lodash';

  function component() {
    var element = document.createElement('div');
+   var button = document.createElement('button');
+   var break = document.createElement('br');

-   // Lodash, now imported by this script
+   button.innerHTML = 'Click me and look at the console!';
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   element.appendChild(break);
+   element.appendChild(button);
+
+   button.onclick = e => import(/* webpackChunkName: "console" */ './console').then(module => {
+     var print = module.default;
+
+     print();
+   })

    return element;
  }

  document.body.appendChild(component());
```

W> Note that when using `import()` on ES6 modules you must reference the `.default` property as it's the actual `module` object that will be returned when the promise is resolved.

Now let's run webpack and check out our new lazy-loading functionality:

?> Add bash example of webpack output


## Frameworks

Many frameworks and libraries have their own recommendations on how this should be accomplished within their methodologies. Here are a few examples:

- React: [Code Splitting and Lazy Loading](https://reacttraining.com/react-router/web/guides/code-splitting)
