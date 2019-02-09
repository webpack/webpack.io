---
title: NormalModuleReplacementPlugin
contributors:
  - gonzoyumo
  - byzyk
  - robertmclaws
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

Say you have a config file `some/path/config.development.module.js` and a special version for production in `some/path/config.production.module.js`

Just add the following plugin when building for production:

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
module.exports = function(env, args) {
  return {
    plugins: [
      new webpack.NormalModuleReplacementPlugin(/(.*)-APP_TARGET(\.*)/, function(resource) {
        var original = resource.request;
        var replace = resource.request.replace(/-APP_TARGET/, `-${env}`);
        resource.request = replace;
        // This will help you debug the replacement during the build process.
        console.log(`Original Config: '${original}', Replacement: '${replace}'`);
      })
    ]
  };

};
```

Create the two config files (the conventions are the same for JavaScript and TypeScript):

__config/config-BETA.js (OR .ts)__ 

``` javascript
export default {
  title : 'I am the Beta configuration.'
};
```

__config/config-PROD.js (OR .ts)__

``` javascript
export default {
  title : 'I am the Production configuration.'
};
```

Then import that config using the keyword you're looking for in the regexp:

``` javascript
import config from './config/config-APP_TARGET';
console.log(config.title);
```

And now the right config will be imported depending on which target you're building for:

``` shell
webpack --mode production --env BETA
=> 'I am the Beta configuration.'

webpack --mode production --env PROD
=> 'I am the Production configuration.'
```


## TypeScript Considerations

The TypeScript compiler requires that all files be physically-present in order to generate an output. After making the above changes and running Webpack, `ts-loader` is likely to throw the following error:

``` shell
TS2307: Cannot find module './config/config-APP_TARGET'.
```

To resolve this situation, you'll need to create an additional file to satisfy the compiler without breaking the
NormalModuleReplacementPlugin. Add the following file to your project:

__config/config-APP_TARGET.ts__

``` javascript
export default {
  // Set default values that will help you identify when the replacement process doesn't work.
  title : ''
};
```

With this, the compiler will be satisfied at compile-time, and you'll know during runtime if the configuration wasn't 
replaced because the values will be empty.
