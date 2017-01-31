---
title: define-plugin
---

``` javascript
new webpack.DefinePlugin(definitions)
```

The `DefinePlugin` allows you to create global constants which can be configured at **compile** time. This can be useful for allowing different behaviour between development builds and release builds. For example, you might use a global constant to determine whether logging takes place; perhaps you perform logging in your development build but not in the release build. That's the sort of scenario the `DefinePlugin` facilitates.

**Example:**

``` javascript
new webpack.DefinePlugin({
  PRODUCTION: JSON.stringify(true),
  VERSION: JSON.stringify("5fa3b9"),
  BROWSER_SUPPORTS_HTML5: true,
  TWO: "1+1",
  "typeof window": JSON.stringify("object")
})
```

``` javascript
console.log("Running App version " + VERSION);
if(!BROWSER_SUPPORTS_HTML5) require("html5shiv");
```

T> Note that because the plugin does a direct text replacement, the value given to it must include actual quotes inside of the string itself. Typically, this is done either with alternate quotes, such as `'"production"'`, or by using `JSON.stringify('production')`.

Each key passed into `DefinePlugin` is an identifier or multiple identifiers joined with `.`.

* If the value is a string it will be used as a code fragment.
* If the value isn't a string, it will be stringified (including functions).
* If the value is an object all keys are defined the same way.
* If you prefix `typeof` to the key, it's only defined for typeof calls.

The values will be inlined into the code which allows a minification pass to remove the redundant conditional.

**Example:**

``` javascript
if (!PRODUCTION) {
  console.log('Debug info')
}
if (PRODUCTION) {
  console.log('Production log')
}
`````
After passing through webpack with no minification results in:

``` javascript
if (!true) {
  console.log('Debug info')
}
if (true) {
  console.log('Production log')
}
```

and then after a minification pass results in:

``` javascript
console.log('Production log')
```
