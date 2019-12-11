---
title: Command Line Interface
sort: 1
contributors:
  - evenstensberg
  - simon04
  - tbroadley
  - chenxsan
  - rencire
  - madhavarshney
  - EugeneHlushko
  - byzyk
  - wizardofhogwarts
  - EslamHiko
related:
  - title: Analyzing Build Statistics
    url: https://survivejs.com/webpack/optimizing-build/analyzing-build-statistics/
  - title: Three simple ways to inspect a webpack bundle
    url: https://medium.com/@joeclever/three-simple-ways-to-inspect-a-webpack-bundle-7f6a8fe7195d#.7d2i06mjx
  - title: Optimising your application bundle size with webpack
    url: https://hackernoon.com/optimising-your-application-bundle-size-with-webpack-e85b00bab579#.5w5ko08pq
  - title: Analyzing & optimizing your webpack bundle
    url: https://medium.com/@ahmedelgabri/analyzing-optimizing-your-webpack-bundle-8590818af4df#.hce4vdjs9
  - title: Analysing and minimising the size of client side bundle with webpack and source-map-explorer
    url: https://medium.com/@nimgrg/analysing-and-minimising-the-size-of-client-side-bundle-with-webpack-and-source-map-explorer-41096559beca#.c3t2srr8x
---

For proper usage and easy distribution of this configuration, webpack can be configured with `webpack.config.js`. Any parameters sent to the CLI will map to a corresponding parameter in the config file.

Read the [installation guide](/guides/installation) if you don't already have webpack and CLI installed.


## Usage with config file

```bash
webpack [--config webpack.config.js]
```

See [configuration](/configuration) for the options in the configuration file.


## Usage without config file

```sh
webpack <entry> [<entry>] -o <output>
```

__`<entry>`__

A filename or a set of named filenames which act as the entry point to build your project. You can pass multiple entries (every entry is loaded on startup). If you pass a pair in the form `<name>=<request>`, you can create an additional entry point. It will be mapped to the configuration option `entry`.

__`<output>`__

A path and filename for the bundled file to be saved in. It will be mapped to the configuration options `output.path` and `output.filename`.

__Example__

If your project structure is as follows -

```bash
.
├── dist
├── index.html
└── src
    ├── index.js
    ├── index2.js
    └── others.js
```

```bash
webpack src/index.js -o dist/bundle.js
```

This will bundle your source code with entry as `index.js`, and the output bundle file will have a path of `dist`, and the filename will be `bundle.js`

```bash
 | Asset     | Size    | Chunks      | Chunk Names |
 | --------- | ------- | ----------- | ----------- |
 | bundle.js | 1.54 kB | 0 [emitted] | index       |
	[0] ./src/index.js 51 bytes {0} [built]
	[1] ./src/others.js 29 bytes {0} [built]
```

```bash
webpack index=./src/index.js entry2=./src/index2.js -o dist/bundle.js
```

This will form the bundle with both the files as separate entry points.

```bash
 | Asset     | Size    | Chunks        | Chunk Names   |
 | --------- | ------- | ------------- | ------------- |
 | bundle.js | 1.55 kB | 0,1 [emitted] | index, entry2 |
	[0] ./src/index.js 51 bytes {0} [built]
	[0] ./src/index2.js 54 bytes {1} [built]
	[1] ./src/others.js 29 bytes {0} {1} [built]
```


### Common Options

W> Note that Command Line Interface has a higher precedence for the arguments you use it with than your configuration file. For instance, if you pass [`--mode="production"`](/configuration/mode/#usage) to webpack CLI and your configuration file uses `development`, `production` will be used.

__List all of the options available on the cli__

```bash
webpack --help
webpack -h
```

__Build source using a config file__

Specifies a different [configuration](/configuration) file to pick up. Use this if you want to specify something different from `webpack.config.js`, which is the default.

```bash
webpack --config example.config.js
```

__Print result of webpack as a JSON__

```bash
webpack --json
webpack --json > stats.json
```

In every other case, webpack prints out a set of stats showing bundle, chunk and timing details. Using this option, the output can be a JSON object. This response is accepted by webpack's [analyse tool](https://webpack.github.io/analyse/), or chrisbateman's [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/), or th0r's [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer). The analyse tool will take in the JSON and provide all the details of the build in graphical form.

### Environment Options

When the webpack configuration [exports a function](/configuration/configuration-types/#exporting-a-function), an "environment" may be passed to it.

```bash
webpack --env.production    # sets env.production == true
webpack --env.platform=web  # sets env.platform == "web"
```

The `--env` argument accepts various syntaxes:

| Invocation                              | Resulting environment       |
| --------------------------------------- | --------------------------- |
| `webpack --env prod`                    | `"prod"`                    |
| `webpack --env.prod`                    | `{ prod: true }`            |
| `webpack --env.prod=1`                  | `{ prod: 1 }`               |
| `webpack --env.prod=foo`                | `{ prod: "foo" }`           |
| `webpack --env.prod --env.min`          | `{ prod: true, min: true }` |
| `webpack --env.prod --env min`          | `[{ prod: true }, "min"]`   |
| `webpack --env.prod=foo --env.prod=bar` | `{prod: [ "foo", "bar" ]}`  |

T> See the [environment variables](/guides/environment-variables) guide for more information on its usage.

### Config Options

| Parameter               | Explanation                                                          | Input type | Default                             |
| ----------------------- | -------------------------------------------------------------------- | ---------- | ----------------------------------- |
| `--config`              | Path to the config file                                              | string     | webpack.config.js or webpackfile.js |
| `--config-register, -r` | Preload one or more modules before loading the webpack configuration | array      |
| `--config-name`         | Name of the config to use                                            | string     |
| `--env`                 | Environment passed to the config, when it is a function              |            |
| `--mode`                | Mode to use, either "development" or "production"                    | string     |

### Output Options

This set of options allows you to manipulate certain [output](/configuration/output) parameters of your build.

| Parameter                      | Explanation                                                     | Input type | Default                                                                         |
| ------------------------------ | --------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------- |
| `--output-chunk-filename`      | The output filename for additional chunks                       | string     | filename with [id] instead of [name] or [id] prefixed                           |
| `--output-filename`            | The output filename of the bundle                               | string     | [name].js                                                                       |
| `--output-jsonp-function`      | The name of the JSONP function used for chunk loading           | string     | webpackJsonp                                                                    |
| `--output-library`             | Expose the exports of the entry point as library                | string     |
| `--output-library-target`      | The type for exposing the exports of the entry point as library | string     | var                                                                             |
| `--output-path`                | The output path for compilation assets                          | string     | Current directory                                                               |
| `--output-pathinfo`            | Include a comment with the request for every dependency         | boolean    | false                                                                           |
| `--output-public-path`         | The public path for the assets                                  | string     | /                                                                               |
| `--output-source-map-filename` | The output filename for the SourceMap                           | string     | [name].map or [outputFilename].map                                              |
| `--build-delimiter`            | Display custom text after build output                          | string     | Default string is null. You could provide a string such as `=== Build done ===` |

### Cascade Options

CLI allows to provide variables by adding `--` before the variable name and value. You can access such variables in the configuration file.

For npm:

```bash
"build": "webpack --mode production --config webpack.prod.config.js"
"build:compress": "npm run build -- --env.presets compress",
```

For yarn, we can skip `--` :

```bash
"build:compress": "yarn build --env.presets compress",
```

T> Hence you can get only `{ presets: "compress" }` in [environment variables](/guides/environment-variables) when you run `build:compress`.

In webpack config you can access the variable as follows:

``` js
module.export = ({ presets }) => {
  // presets variable is available in webpack config
};
```

#### Example Usage

```bash
webpack index=./src/index.js index2=./src/index2.js --output-path='./dist' --output-filename='[name][hash].bundle.js'

| Asset                                | Size    | Chunks      | Chunk Names |
| ------------------------------------ | ------- | ----------- | ----------- |
| index2740fdca26e9348bedbec.bundle.js | 2.6 kB  | 0 [emitted] | index2      |
| index740fdca26e9348bedbec.bundle.js  | 2.59 kB | 1 [emitted] | index       |
	[0] ./src/others.js 29 bytes {0} {1} [built]
	[1] ./src/index.js 51 bytes {1} [built]
	[2] ./src/index2.js 54 bytes {0} [built]
```

```bash
webpack.js index=./src/index.js index2=./src/index2.js --output-path='./dist' --output-filename='[name][hash].bundle.js' --devtool source-map --output-source-map-filename='[name]123.map'

| Asset                                | Size    | Chunks      | Chunk Names |
| ------------------------------------ | ------- | ----------- | ----------- |
| index2740fdca26e9348bedbec.bundle.js | 2.76 kB | 0 [emitted] | index2      |
| index740fdca26e9348bedbec.bundle.js  | 2.74 kB | 1 [emitted] | index       |
| index2123.map                        | 2.95 kB | 0 [emitted] | index2      |
| index123.map                         | 2.95 kB | 1 [emitted] | index       |
	[0] ./src/others.js 29 bytes {0} {1} [built]
	[1] ./src/index.js 51 bytes {1} [built]
	[2] ./src/index2.js 54 bytes {0} [built]
```


### Debug Options

This set of options allows you to better debug the application containing assets compiled with webpack

| Parameter                 | Explanation                                                                 | Input type | Default value |
| ------------------------- | --------------------------------------------------------------------------- | ---------- | ------------- |
| `--debug`                 | Switch loaders to debug mode                                                | boolean    | false         |
| `--devtool`               | Define [source map type](/configuration/devtool/) for the bundled resources | string     | -             |
| `--progress`              | Print compilation progress in percentage                                    | boolean    | false         |
| `--display-error-details` | Display details about errors                                                | boolean    | false         |

### Module Options

These options allow you to bind [modules](/configuration/module/) as allowed by webpack

| Parameter            | Explanation                            | Usage                           |
| -------------------- | -------------------------------------- | ------------------------------- |
| `--module-bind`      | Bind a file extension to a loader      | `--module-bind js=babel-loader` |
| `--module-bind-post` | Bind a file extension to a post loader |
| `--module-bind-pre`  | Bind a file extension to a pre loader  |


### Watch Options

These options make the build [watch](/configuration/watch/) for changes in files of the dependency graph and perform the build again.

| Parameter                   | Explanation                                             |
| --------------------------- | ------------------------------------------------------- |
| `--watch`, `-w`             | Watch the filesystem for changes                        |
| `--watch-aggregate-timeout` | Timeout for gathering changes while watching            |
| `--watch-poll`              | The polling interval for watching (also enable polling) |
| `--watch-stdin`, `--stdin`  | Exit the process when stdin is closed                   |


### Optimize Options

These options allow you to manipulate optimizations for a production build using webpack

| Parameter                   | Explanation                                            | Plugin Used                                                                                              |
| --------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `--optimize-max-chunks`     | Try to keep the chunk count below a limit              | [LimitChunkCountPlugin](/plugins/limit-chunk-count-plugin)                                               |
| `--optimize-min-chunk-size` | Try to keep the chunk size above a limit               | [MinChunkSizePlugin](/plugins/min-chunk-size-plugin)                                                     |
| `--optimize-minimize`       | Minimize javascript and switches loaders to minimizing | [TerserPlugin](/plugins/terser-webpack-plugin/) & [LoaderOptionsPlugin](/plugins/loader-options-plugin/) |


### Resolve Options

These allow you to configure the webpack [resolver](/configuration/resolve/) with aliases and extensions.

| Parameter                | Explanation                                             | Example                                     |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------- |
| `--resolve-alias`        | Setup a module alias for resolving                      | --resolve-alias jquery-plugin=jquery.plugin |
| `--resolve-extensions`   | Setup extensions that should be used to resolve modules | --resolve-extensions .es6 .js .ts           |
| `--resolve-loader-alias` | Minimize javascript and switches loaders to minimizing  |


### Stats Options

These options allow webpack to display various [stats](/configuration/stats/) and style them differently in the console output.

| Parameter                        | Explanation                                                                                                                | Type    |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------- |
| `--color`, `--colors`            | Force colors on the console [default: enabled for TTY output only]                                                         | boolean |
| `--no-color`, `--no-colors`      | Force no colors on the console                                                                                             | boolean |
| `--display`                      | Select [display preset](/configuration/stats) (verbose, detailed, normal, minimal, errors-only, none; since webpack 3.0.0) | string  |
| `--display-cached`               | Display also cached modules in the output                                                                                  | boolean |
| `--display-cached-assets`        | Display also cached assets in the output                                                                                   | boolean |
| `--display-chunks`               | Display chunks in the output                                                                                               | boolean |
| `--display-depth`                | Display distance from entry point for each module                                                                          | boolean |
| `--display-entrypoints`          | Display entry points in the output                                                                                         | boolean |
| `--display-error-details`        | Display details about errors                                                                                               | boolean |
| `--display-exclude`              | Exclude modules in the output                                                                                              | boolean |
| `--display-max-modules`          | Sets the maximum number of visible modules in output                                                                       | number  |
| `--display-modules`              | Display even excluded modules in the output                                                                                | boolean |
| `--display-optimization-bailout` | Scope hoisting fallback trigger (since webpack 3.0.0)                                                                      | boolean |
| `--display-origins`              | Display origins of chunks in the output                                                                                    | boolean |
| `--display-provided-exports`     | Display information about exports provided from modules                                                                    | boolean |
| `--display-reasons`              | Display reasons about module inclusion in the output                                                                       | boolean |
| `--display-used-exports`         | Display information about used exports in modules (Tree Shaking)                                                           | boolean |
| `--hide-modules`                 | Hides info about modules                                                                                                   | boolean |
| `--sort-assets-by`               | Sorts the assets list by property in asset                                                                                 | string  |
| `--sort-chunks-by`               | Sorts the chunks list by property in chunk                                                                                 | string  |
| `--sort-modules-by`              | Sorts the modules list by property in module                                                                               | string  |
| `--verbose`                      | Show more details                                                                                                          | boolean |

### Advanced Options

| Parameter               | Explanation                                                        | Usage                                           |
| ----------------------- | ------------------------------------------------------------------ | ----------------------------------------------- |
| `--bail`                | Abort the compilation on first error                               |
| `--cache`               | Enable in memory caching [Enabled by default for watch]            | `--cache=false`                                 |
| `--define`              | Define any free variable, see [shimming](/guides/shimming)         | `--define process.env.NODE_ENV="'development'"` |
| `--hot`                 | Enables [Hot Module Replacement](/concepts/hot-module-replacement) | `--hot=true`                                    |
| `--labeled-modules`     | Enables labeled modules [Uses LabeledModulesPlugin]                |
| `--plugin`              | Load this [plugin](/configuration/plugins/)                        |
| `--prefetch`            | Prefetch the particular file                                       | `--prefetch=./files.js`                         |
| `--provide`             | Provide these modules as globals, see [shimming](/guides/shimming) | `--provide jQuery=jquery`                       |
| `--records-input-path`  | Path to the records file (reading)                                 |
| `--records-output-path` | Path to the records file (writing)                                 |
| `--records-path`        | Path to the records file                                           |
| `--target`              | The [targeted](/configuration/target/) execution environment       | `--target='node'`                               |

### Shortcuts

| Shortcut | Replaces                                                                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------- |
| -d       | `--debug --devtool cheap-module-eval-source-map --output-pathinfo`                                                  |
| -p       | `--optimize-minimize --define process.env.NODE_ENV="production"`, see [building for production](/guides/production) |

### Profiling

The `--profile` option captures timing information for each step of the compilation and includes this in the output.

```bash
webpack --profile

⋮
[0] ./src/index.js 90 bytes {0} [built]
    factory:22ms building:16ms = 38ms
```

For each module, the following details are included in the output as applicable:

- `factory`: time to collect module metadata (e.g. resolving the filename)
- `building`: time to build the module (e.g. loaders and parsing)
- `dependencies`: time to identify and connect the module’s dependencies

Paired with `--progress`, `--profile` gives you an in-depth idea of which step in the compilation is taking how long. This can help you optimize your build in a more informed manner.

```bash
webpack --progress --profile

30ms building modules
1ms sealing
1ms optimizing
0ms basic module optimization
1ms module optimization
1ms advanced module optimization
0ms basic chunk optimization
0ms chunk optimization
1ms advanced chunk optimization
0ms module and chunk tree optimization
1ms module reviving
0ms module order optimization
1ms module id optimization
1ms chunk reviving
0ms chunk order optimization
1ms chunk id optimization
10ms hashing
0ms module assets processing
13ms chunk assets processing
1ms additional chunk assets processing
0ms recording
0ms additional asset processing
26ms chunk asset optimization
1ms asset optimization
6ms emitting
⋮
```
