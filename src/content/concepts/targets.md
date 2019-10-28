---
title: Targets
sort: 9
contributors:
  - TheLarkInn
  - rouzbeh84
  - johnstew
  - srilman
  - byzyk
  - EugeneHlushko
  - fokusferit
---

Because JavaScript can be written for both server and browser, webpack offers multiple deployment _targets_ that you can set in your webpack [configuration](/configuration).

W> The webpack `target` property is not to be confused with the `output.libraryTarget` property. For more information see [our guide](/concepts/output/) on the `output` property.

## Usage

Set the [`target` property](/configuration/target/#target) in your webpack configuration:

__webpack.config.js__

```javascript
module.exports = {
  target: 'node'
};
```

In the example above, using `node` webpack will compile for usage in a Node.js-like environment (uses Node.js `require` to load chunks and not touch any built in modules like `fs` or `path`).

Each _target_ has a variety of deployment/environment specific additions, support to fit its needs. See what [targets are available](/configuration/target/).

?> Further expansion for other popular target values

## Multiple Targets

Although webpack does __not__ support multiple strings being passed into the `target` property, you can create an isomorphic library by bundling two separate configurations:

__webpack.config.js__

```javascript
const path = require('path');
const serverConfig = {
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.node.js'
  }
  //…
};

const clientConfig = {
  target: 'web', // <=== can be omitted as default is 'web'
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'lib.js'
  }
  //…
};

module.exports = [ serverConfig, clientConfig ];
```

The example above will create a `lib.js` and `lib.node.js` file in your `dist` folder.

## Resources

As seen from the options above, there are multiple deployment _targets_ that you can choose from. Below is a list of examples and resources that you can refer to.

-  __[compare-webpack-target-bundles](https://github.com/TheLarkInn/compare-webpack-target-bundles)__: A great resource for testing and viewing different webpack _targets_. Also great for bug reporting.
- __[Boilerplate of Electron-React Application](https://github.com/chentsulin/electron-react-boilerplate)__: A good example of a build process for electron's main process and renderer process.

?> Need to find up to date examples of these webpack targets being used in live code or boilerplates.
