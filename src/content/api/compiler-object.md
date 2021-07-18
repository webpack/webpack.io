---
title: Compiler Object
group: Objects
sort: 26
contributors:
  - jeffin143
---

The Compiler object has many methods and properties available. On this page, we will list the available methods and properties.

## compiler object methods

### getCache

`function (name)`

Returns the cache facade instance.

Parameters:

- `name` - cache name

### getInfrastructureLogger

`function (name)`

Return a logger with that name

Parameters:

- `name` - name of the logger, or function called once to get the logger name

### watch

`function (watchOptions, handler)`

Returns a compiler watcher

- `watchOptions` - the watcher's options.
- `handler` - signals when the call finishes.

### emitAssets

`function (compilation, callback)`

- `compilation` - the compilation
- `callback` signals when the assets are emitted
