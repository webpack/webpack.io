---
title: TypeScript
sort: 20
contributors:
  - morsdyce
  - kkamali
  - mtrivera
  - byzyk
---

T> This guide stems from the [_Getting Started_](/guides/getting-started/) guide.

[TypeScript](https://www.typescriptlang.org) is a typed superset of JavaScript that compiles to plain JavaScript. In this guide we will learn how to integrate TypeScript with webpack.


## Basic Setup

First install the TypeScript compiler and loader by running:

``` bash
npm install --save-dev typescript ts-loader
```

Now we'll modify the directory structure & the configuration files:

__project__

``` diff
  webpack-demo
  |- package.json
+ |- tsconfig.json
  |- webpack.config.js
  |- /dist
    |- bundle.js
    |- index.html
  |- /src
    |- index.js
+   |- index.ts
  |- /node_modules
```

__tsconfig.json__

Let's set up a configuration to support JSX and compile TypeScript down to ES5...

``` json
{
  "compilerOptions": {
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "es6",
    "target": "es5",
    "jsx": "react",
    "allowJs": true
  }
}
```

See [TypeScript's documentation](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) to learn more about `tsconfig.json` configuration options.

To learn more about webpack configuration, see the [configuration concepts](/concepts/configuration/).

Now let's configure webpack to handle TypeScript:

__webpack.config.js__

``` js
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

This will direct webpack to _enter_ through `./index.ts`, _load_ all `.ts` and `.tsx` files through the `ts-loader`, and _output_ a `bundle.js` file in our current directory.


## Loader

[`ts-loader`](https://github.com/TypeStrong/ts-loader)

We use `ts-loader` in this guide as it makes enabling additional webpack features, such as importing other web assets, a bit easier.


## Source Maps

To learn more about source maps, see the [development guide](/guides/development).

To enable source maps, we must configure TypeScript to output inline source maps to our compiled JavaScript files. The following line must be added to our TypeScript configuration:

__tsconfig.json__

``` diff
  {
    "compilerOptions": {
      "outDir": "./dist/",
+     "sourceMap": true,
      "noImplicitAny": true,
      "module": "commonjs",
      "target": "es5",
      "jsx": "react",
      "allowJs": true
    }
  }
```

Now we need to tell webpack to extract these source maps and include in our final bundle:

__webpack.config.js__

``` diff
  const path = require('path');

  module.exports = {
    entry: './src/index.ts',
+   devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
  };
```

See the [devtool documentation](/configuration/devtool/) for more information.


## Using Third Party Libraries

When installing third party libraries from npm, it is important to remember to install the typing definition for that library. These definitions can be found at [TypeSearch](https://microsoft.github.io/TypeSearch/).

For example if we want to install lodash we can run the following command to get the typings for it:

``` bash
npm install --save-dev @types/lodash
```

For more information see [this blog post](https://blogs.msdn.microsoft.com/typescript/2016/06/15/the-future-of-declaration-files/).


## Importing Other Assets

To use non-code assets with TypeScript, we need to defer the type for these imports. This requires a `custom.d.ts` file which signifies custom definitions for TypeScript in our project. Let's set up a declaration for `.svg` files:

__custom.d.ts__

```typescript
declare module "*.svg" {
  const content: any;
  export default content;
}
```

Here we declare a new module for SVGs by specifying any import that ends in `.svg` and defining the module's `content` as `any`. We could be more explicit about it being a url by defining the type as string. The same concept applies to other assets including CSS, SCSS, JSON and more.


## Build Performance

W> This may degrade build performance.

See the [Build Performance](/guides/build-performance/) guide on build tooling.
