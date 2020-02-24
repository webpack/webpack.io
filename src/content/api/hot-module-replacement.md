---
title: Hot Module Replacement
sort: 4
contributors:
  - sokra
  - skipjack
  - tbroadley
  - byzyk
  - wizardofhogwarts
related:
  - title: Concepts - Hot Module Replacement
    url: /concepts/hot-module-replacement
  - title: Guides - Hot Module Replacement
    url: /guides/hot-module-replacement
---

If [Hot Module Replacement](/concepts/hot-module-replacement) has been enabled via the [`HotModuleReplacementPlugin`](/plugins/hot-module-replacement-plugin), its interface will be exposed under the [`module.hot` property](/api/module-variables/#modulehot-webpack-specific). Typically, users will check to see if the interface is accessible, then begin working with it. As an example, here's how you might `accept` an updated module:

``` js
if (module.hot) {
  module.hot.accept('./library.js', function() {
    // Do something with the updated library module...
  });
}
```

The following methods are supported...

## Module API

### `accept`

Accept updates for the given `dependencies` and fire a `callback` to react to those updates.

``` js
module.hot.accept(
  dependencies, // Either a string or an array of strings
  callback // Function to fire when the dependencies are updated
);
```

When using ESM `import` all imported symbols from `dependencies` are automatically updated. Note: The dependency string must match exactly with the `from` string in the `import`. In some cases `callback` can even be omitted. Using `require()` in the `callback` doesn't make sense here.

When using CommonJS you need to update dependencies manually by using `require()` in the `callback`. Omitting the `callback` doesn't make sense here.

### `accept` (self)

Accept updates for itself.

``` js
module.hot.accept(
  errorHandler // Function to handle errors when evaluating the new version
);
```

When this module or dependencies are updated, this module can be disposed and re-evaluated without informing parents. This makes sense if this module has no exports (or exports are updated in another way).

The `errorHandler` is fired when the evaluation of this module (or dependencies) has thrown an exception.

### `decline`

Reject updates for the given `dependencies` forcing the update to fail with a `'decline'` code.

``` js
module.hot.decline(
  dependencies // Either a string or an array of strings
);
```

Flag a dependency as not-update-able. This makes sense when changing exports of this dependency can be handled or handling is not implemented yet. Depending on your HMR management code, an update to these dependencies (or unaccepted dependencies of it) usually causes a full-reload of the page.

### `decline` (self)

Reject updates for itself.

``` js
module.hot.decline();
```

Flag this module as not-update-able. This makes sense when this module has irreversible side-effects, or HMR handling is not implemented for this module yet. Depending on your HMR management code, an update to this module (or unaccepted dependencies) usually causes a full-reload of the page.

### `dispose` (or `addDisposeHandler`)

Add a handler which is executed when the current module code is replaced. This should be used to remove any persistent resource you have claimed or created. If you want to transfer state to the updated module, add it to the given `data` parameter. This object will be available at `module.hot.data` after the update.

``` js
module.hot.dispose(data => {
  // Clean up and pass data to the updated module...
});
```


### `removeDisposeHandler`

Remove the handler added via `dispose` or `addDisposeHandler`.

``` js
module.hot.removeDisposeHandler(callback);
```

## Management API

### `status`

Retrieve the current status of the hot module replacement process.

``` js
module.hot.status(); // Will return one of the following strings...
```

| Status      | Description                                                                            |
| ----------- | -------------------------------------------------------------------------------------- |
| idle        | The process is waiting for a call to `check` (see below)                               |
| check       | The process is checking for updates                                                    |
| prepare     | The process is getting ready for the update (e.g. downloading the updated module)      |
| ready       | The update is prepared and available                                                   |
| dispose     | The process is calling the `dispose` handlers on the modules that will be replaced     |
| apply       | The process is calling the `accept` handlers and re-executing self-accepted modules    |
| abort       | An update was aborted, but the system is still in its previous state                  |
| fail        | An update has thrown an exception and the system's state has been compromised          |


### `check`

Test all loaded modules for updates and, if updates exist, `apply` them.

``` js
module.hot.check(autoApply).then(outdatedModules => {
  // outdated modules...
}).catch(error => {
  // catch errors
});
```

The `autoApply` parameter can either be a boolean or `options` to pass to the `apply` method when called.


### `apply`

Continue the update process (as long as `module.hot.status() === 'ready'`).

``` js
module.hot.apply(options).then(outdatedModules => {
  // outdated modules...
}).catch(error => {
  // catch errors
});
```

The optional `options` object can include the following properties:

- `ignoreUnaccepted` (boolean): Ignore changes made to unaccepted modules.
- `ignoreDeclined` (boolean): Ignore changes made to declined modules.
- `ignoreErrored` (boolean): Ignore errors thrown in accept handlers, error handlers and while reevaluating module.
- `onDeclined` (function(info)): Notifier for declined modules
- `onUnaccepted` (function(info)): Notifier for unaccepted modules
- `onAccepted` (function(info)): Notifier for accepted modules
- `onDisposed` (function(info)): Notifier for disposed modules
- `onErrored` (function(info)): Notifier for errors

The `info` parameter will be an object containing some of the following values:

<!-- eslint-skip -->

```js
{
  type: 'self-declined' | 'declined' |
        'unaccepted' | 'accepted' |
        'disposed' | 'accept-errored' |
        'self-accept-errored' | 'self-accept-error-handler-errored',
  moduleId: 4, // The module in question.
  dependencyId: 3, // For errors: the module id owning the accept handler.
  chain: [1, 2, 3, 4], // For declined/accepted/unaccepted: the chain from where the update was propagated.
  parentId: 5, // For declined: the module id of the declining parent
  outdatedModules: [1, 2, 3, 4], // For accepted: the modules that are outdated and will be disposed
  outdatedDependencies: { // For accepted: The location of accept handlers that will handle the update
    5: [4]
  },
  error: new Error(...), // For errors: the thrown error
  originalError: new Error(...) // For self-accept-error-handler-errored:
                                // the error thrown by the module before the error handler tried to handle it.
}
```


### `addStatusHandler`

Register a function to listen for changes in `status`.

``` js
module.hot.addStatusHandler(status => {
  // React to the current status...
});
```


### `removeStatusHandler`

Remove a registered status handler.

``` js
module.hot.removeStatusHandler(callback);
```
