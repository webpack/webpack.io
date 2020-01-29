---
title: Compilation Object
group: Objects
sort: 14
contributors:
  - EugeneHlushko
  - wizardofhogwarts
  - jamesgeorge007
---

Compilation object has many methods and hooks available. On this page, we will list the available methods and properties.

## compilation object methods

### getStats

`function`

Returns Stats object for the current compilation.

### addModule

`function (module, cacheGroup)`

Adds a module to the current compilation.

Parameters:

- `module` - module to be added
- `cacheGroup` - `cacheGroup` of the module

### getModule

`function (module)`

Fetches a module from a compilation by its identifier.

Parameters:

- `module` - module to be fetched. Identifier is extracted from the module by the compilation using `module.identifier()` method.

### findModule

`function (module)`

Attempts to search for a module by its identifier.

Parameters:

- `module` - module to be searched for. Identifier is extracted from the module by the compilation using `module.identifier()` method.

### waitForBuildingFinished

`function (module, callback)`

Runs a given `callback` function when given module was built.

Parameters:

- `module` - module at question.
- `callback` - a function to be invoked.

### buildModule

`function (module, optional, origin, dependencies)`

Builds the given module.

Parameters:

- `module` - the module to be built.
- `optional` - optional flag.
- `origin` - origin module from which this module build was requested.
- `dependencies` - optional dependencies of the module to be built.

### processModuleDependencies

`function (module, callback)`

Process the given module dependencies.

Parameters:

- `module` - module to be processed for the dependencies.
- `callback` - function to be invoked when dependencies of the module had been processed.

### addModuleDependencies

`function (module, dependencies, bail, cacheGroup, recursive, callback)`

Adds dependencies to the module. Automatically called by `processModuleDependencies` after processing dependencies.

Parameters:

- `module` - module to add dependencies to.
- `dependencies` - set of sorted dependencies to iterate through and add to the module.
- `bail` - whether to bail or not when an error occurs.
- `cacheGroup` - `cacheGroup` of the module.
- `recursive` - whether it is a recursive traversal.
- `callback` - function to invoke after adding the module dependencies.


### addEntry

`function (context, entry, name, callback)`

Adds an entry to the compilation.

Parameters:

- `context` - context path for entry.
- `entry` - entry dependency.
- `name` - name of entry.
- `callback` - function to be invoked when addEntry finishes.

### prefetch

`function (context, dependency, callback)`

Creates a module from given dependency.

Parameters:

- `context` - context path.
- `dependency` - dependency that was used to create the module.
- `callback` - module callback that sends a module up one level.

### rebuildModule

`function (module, thisCallback)`

Triggers a re-build of the module.

Parameters:

- `module` - module to be rebuilt.
- `thisCallback` - function to be invoked when the module finishes rebuilding.

### finish

`function (callback)`

Finishes compilation and invokes given callback.

Parameters:

- `callback` - function to be invoked when the compilation has been finished.

### seal

`function (callback)`

Seals the compilation.

Parameters:

- `callback` - function to be invoked when the compilation has been sealed.

### unseal

`function`

Unseals the compilation.

Parameters:

- `callback` - function to be invoked when the compilation has been unsealed.

### reportDependencyErrorsAndWarnings

`function (module, blocks)`

Adds errors and warnings of the given module to the compilation errors and warnings.

Parameters:

- `module` - the module whose errors and warnings are to be reported.
- `blocks` - a set of dependency blocks to report from.

### addChunkInGroup

`function (groupOptions, module, loc, request)`

Adds module to an existing chunk group or creates a new one. Returns a `chunkGroup`.

Parameters:

- `groupOptions` - options for the chunk group.
- `module` - a module that references the chunk group.
- `loc` - the location from which the chunk group is referenced (inside of the module).
- `request` - the request from which the chunk group is referenced.

### addChunk

`function (name)`

Creates and adds a new chunk to the `compilation.chunks`. Returns that `chunk`.

Parameters:

- `name` - the name of the chunk.

### assignDepth

`function (module)`

Assigns `depth` to the given module and its dependency blocks recursively.

Parameters:

- `module` - the module to assign depth to.

### getDependencyReference

`function (module, dependency)`

Returns the reference to the dependency from a given module.

Parameters:

- `module` - the module at question.
- `dependency` - the dependency to get reference to.

### processDependenciesBlocksForChunkGroups

`function (inputChunkGroups)`

Creates the `Chunk` graph from the `Module` graph. The process is done in two phases. Phase one: traverse the module graph and build a basic chunks graph in `chunkDependencies`. Phase two: traverse every possible way through the basic chunk graph and track the available modules. While traversing, `processDependenciesBlocksForChunkGroups` connects chunks with each other and `Blocks` with `Chunks`. It stops traversing when all modules for a chunk are already available and it doesn't connect unneeded chunks.

Parameters:

- `inputChunkGroups` - chunk groups which are processed.

### removeReasonsOfDependencyBlock

`function (module, block)`

Removes relation of the module to dependency block.

Parameters:

- `module` - a module relationship to be removed.
- `block` - dependency block.

### patchChunksAfterReasonRemoval

`function (module, chunk)`

Patches ties of module and chunk after removing dependency reasons. Called automatically by `removeReasonsOfDependencyBlock`.

Parameters:

- `module` - a module to patch tie.
- `chunk` - a chunk to patch tie.

### removeChunkFromDependencies

`function (block, chunk)`

Removes given chunk from a dependencies block module and chunks after removing dependency reasons. Called automatically by `removeReasonsOfDependencyBlock`.

Parameters:

- `block` - block tie for `Chunk`.
- `chunk` - a chunk to remove from dependencies.

### sortItemsWithModuleIds

`function`

### sortItemsWithChunkIds

`function`

### summarizeDependencies

`function`

### createHash

`function`

### modifyHash

`function (update)`

### createModuleAssets

`function`

### createChunkAssets

`function`

### getPath

`function (filename, data)`

Parameters:

- `filename` - used to get asset path with hash.
- `data` - data object.

### createChildCompiler

`function (name, outputOptions, plugins)`

Allows to run another instance of webpack inside of webpack. However as a child with different settings and configurations applied. It copies all hooks and plugins from parent (or top-level compiler) and creates a child `Compiler` instance. Returns the created `Compiler`.

Parameters:

- `name` - name for the child `Compiler`.
- `outputOptions` - output options object.
- `plugins` - webpack plugins that will be applied.

### checkConstraints

`function`

### emitAsset

`function (file, source, assetInfo = {})`

W> Available since webpack 4.40.0

Parameters:

- `file` - file name of the asset
- `source` - source of the asset
- `assetInfo` - additional asset information

### updateAsset

`function (file, newSourceOrFunction, assetInfoUpdateOrFunction)`

W> Available since webpack 4.40.0

Parameters:

- `file` - file name of the asset
- `newSourceOrFunction` - new asset source or function converting old to new
- `assetInfoUpdateOrFunction` - new asset info or function converting old to new

### getAssets

`function`

W> Available since webpack 4.40.0

Returns array of all assets under current compilation.

### getAsset

`function (name)`

W> Available since webpack 4.40.0

Parameters:

`name` - the name of the asset to return
