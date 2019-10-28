---
title: NormalModuleReplacementPlugin
contributors:
  - gonzoyumo
  - byzyk
---

The `NormalModuleReplacementPlugin` allows you to replace resources that match `resourceRegExp` with `newResource`. If `newResource` is relative, it is resolved relative to the previous resource. If `newResource` is a function, it is expected to overwrite the request attribute of the supplied resource.

This can be useful for allowing different behaviour between builds.

``` js
new webpack.NormalModuleReplacementPlugin(
  resourceRegExp,
  newResource
);
```


## Basic Example

Replace a specific module when building for a [development environment](/guides/production).

Say you have a config file `some/path/config.development.module.js` and a specific version for production in `some/path/config.production.module.js`

Add the following plugin when building for production:

``` javascript
new webpack.NormalModuleReplacementPlugin(
  /some\/path\/config\.development\.js/,
  './config.production.js'
);
```


## Advanced Example

Conditional build depending on an [specified environment](/configuration/configuration-types).

Say you want a configuration with specific values for different build targets.

``` javascript
module.exports = function(env) {
  var appTarget = env.APP_TARGET || 'VERSION_A';
  return {
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/(.*)-APP_TARGET(\.*)/, function(resource) {
        resource.request = resource.request.replace(/-APP_TARGET/, `-${appTarget}`);
      })
    ]
  };

};
```

Create the two config files:

__app/config-VERSION_A.js__

``` javascript
export default {
  title : 'I am version A'
};
```

__app/config-VERSION_B.js__

``` javascript
export default {
  title : 'I am version B'
};
```

Then import that config using the keyword you're looking for in the regexp:

``` javascript
import config from 'app/config-APP_TARGET';
console.log(config.title);
```

And now you will get the right config imported depending on which target you're building for:

```bash
webpack --env.APP_TARGET VERSION_A
=> 'I am version A'

webpack --env.APP_TARGET VERSION_B
=> 'I am version B'
```
