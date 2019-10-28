---
title: Writing a Scaffold
sort: 4
contributors:
  - pranshuchittora
  - EugeneHlushko
  - misterdev
  - rishabh3112
---

A scaffold is an ECMAScript Module which exports a `yeoman generator` based on [Scaffolding API](/guides/scaffolding/#api). Scaffolds can be used but not limited to initialize a new webpack project, tailored to a specific use case. To view what we are building today, run `webpack init webpack-scaffold-demo`. This demo will show you how to build your own webpack scaffold. Let's start by creating a file named `generator.js`.

## Quick Start

[`webpack-scaffold-starter`](https://github.com/rishabh3112/webpack-scaffold-starter) can be used to setup a new scaffold project. To do so, follow the following commands.

```bash
mkdir my-scaffold && cd my-scaffold
npm install webpack-scaffold-starter
npx webpack-scaffold
git init # optional
```

## Setup

Before writing a `webpack-cli` scaffold, think about what you're trying to achieve. Do you want a "general" scaffold that could be used by any project or type of app? Do you want something focused, like a scaffold that writes both your `webpack.config.js` and your framework code? It's also useful to think about the user experience for your scaffold.

`webpack-cli` offers interactive experience to customize the output accordingly. For example asking questions like: "What is your entry point?".

Let's create our skeleton. In order for the webpack CLI to detect our options, we have to define some properties in the constructor.

__generator.js__

```js
const Generator = require('yeoman-generator');

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {}
    };
  }
};
```

`configuration` object has to have one property you name (we named it `dev` in the snippet above). A good practice is to name the underlying property with the name you want to give to your `webpack.config.js` file for a better indication of what configuration each file has.

## Make it interactive

In order for us to interact with the users, we make use of the [`prompting`](http://yeoman.io/authoring/user-interactions.html) method yeoman has. In this method, we can get various answers from the user, like asking for entry points or plugins. You can either manually create each object representing a question or you can make good use of our utilities from [`webpack-scaffold`](https://github.com/webpack/webpack-cli/tree/master/packages/webpack-scaffold). We are in a good mood today, so let's build a configuration only if the user chooses `Pengwings`.


```js
const Generator = require('yeoman-generator');
const List = require('@webpack-cli/webpack-scaffold').List;

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {}
    };
  }

  prompting() {
    return this.prompt([
      List('confirm', 'Welcome to the demo scaffold! Are you ready?', ['Yes', 'No', 'Pengwings'])
    ]).then(answer => {
      if (answer['confirm'] === 'Pengwings') {
        // build the configuration
      }
    });
  }
};
```

## Configuring Webpack

So far, we've made an interaction with the user. If you were coding along, great! So how do we proceed from here? Let's try to build a webpack configuration that has an [entry point](/configuration/entry-context/#entry), an [output](/concepts/#output), and a [context property](/configuration/entry-context/#context). For this, we need to create a `webpackOptions` property on our `dev` object. This is where `entry`, `output` and `context` is going to be hooked up, later resulting in a `webpack.config.js`.

T> Define the `webpackOptions` property in the constructor to keep your scaffold as clean as possible!

```js
const Generator = require('yeoman-generator');
const List = require('@webpack-cli/webpack-scaffold').List;

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {
        webpackOptions: {}
      }
    };
  }

  prompting() {
    return this.prompt([
      List('confirm', 'Welcome to the demo scaffold! Are you ready?', ['Yes', 'No', 'Pengwings'])
    ]).then(answer => {
      if (answer['confirm'] === 'Pengwings') {
        // build the configuration
      }
    });
  }
};
```


## Dev Configurations

Congratulations! You've now created the base of a `webpack-scaffold`! Let's now add some more stuff to our future configuration file!
Following best practices, we are going to extract our configuration into another JavaScript file, named `dev-config.js`. Export a function, and supply our `entry` as a parameter for us to build up a configuration file from.

__dev-config.js__

```js
module.exports = function createDevConfig(answer) {
  let devConfig = {};
};
```

__generator.js__

```js
const Generator = require('yeoman-generator');
const List = require('@webpack-cli/webpack-scaffold').List;
const createDevConfig = require('./dev-config');

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {
        webpackOptions: {}
      }
    };
  }

  prompting() {
    return this.prompt([
      List('confirm', 'Welcome to the demo scaffold! Are you ready?', ['Yes', 'No', 'Pengwings'])
    ]).then(answer => {
      if (answer['confirm'] === 'Pengwings') {
        this.options.env.configuration.dev.webpackOptions = createDevConfig(answer);
      }
    });
  }
};
```

We've now abstracted that part of the code that's probably going to be really big. Let's go ahead and add another question, like asking for an entry point.

```js
const Generator = require('yeoman-generator');
const List = require('@webpack-cli/webpack-scaffold').List;
const Input = require('@webpack-cli/webpack-scaffold').Input;
const createDevConfig = require('./dev-config');

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {
        webpackOptions: {}
      }
    };
  }

  prompting() {
    return this.prompt([
      List('confirm', 'Welcome to the demo scaffold! Are you ready?', ['Yes', 'No', 'Pengwings']),
      Input('entry', 'What is the entry point in your app?')
    ]).then(answer => {
      if (answer['confirm'] === 'Pengwings') {
        this.options.env.configuration.dev.webpackOptions = createDevConfig(answer);
      }
    });
  }
};
```

## Some more configs

Let's look at `dev-config.js`. We have access to user's answers, use them to assign values to desired config properties, in this case - `entry`. We've also added an output property that has a `filename`.

T> String values must be quoted twice. This is to preserve our ability to add other functionality, using only " ", while " 'Mystring' " resolves to a string.

__dev-config.js__

```js
module.exports = function createDevConfig(answer) {
  let entryProp = answer.entry ? ( '\'' + answer.entry + '\'') : '\'index.js\'';
  let devConfig = {
    entry: entryProp,
    output: {
      filename: '\'[name].js\''
    }
  };
  return devConfig;
};

```

Run `webpack init webpack-scaffold-demo`, and you should see scaffold working.

## Basic Scaffold

Now that we've got our initial scaffold. Let's add the rest of our options! For the `context`, let's say we need to use `path`'s `join` function. For this, we use a single quote string. By default, the current directory is used, but it's recommended to pass a value in your configuration (context). This makes your configuration independent from CWD (current working directory).

```js
module.exports = function createDevConfig(answer) {
  let entryProp = answer.entry ? ( '\'' + answer.entry + '\'') : '\'index.js\'';
  let devConfig = {
    entry: entryProp,
    output: {
      filename: '\'[name].js\''
    },
    context: 'path.join(__dirname, "src")'
  };
  return devConfig;
};
```

## Add more functionality

Now we are ready to add a plugin. For this, let's create an utility for [`html-webpack-plugin`](/plugins/html-webpack-plugin/) based on the input from the user. Start by adding another question to our prompt.

```js
const Generator = require('yeoman-generator');
const List = require('@webpack-cli/webpack-scaffold').List;
const Input = require('@webpack-cli/webpack-scaffold').Input;
const createDevConfig = require('./dev-config');

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {
        webpackOptions: {}
      }
    };
  }

  prompting() {
    return this.prompt([
      List('confirm', 'Welcome to the demo scaffold! Are you ready?', ['Yes', 'No', 'Pengwings']),
      Input('entry', 'What is the entry point in your app?'),
      Input('plugin', 'What do you want to name your html file?')
    ]).then(answer => {
      if (answer['confirm'] === 'Pengwings') {
        this.options.env.configuration.dev.webpackOptions = createDevConfig(answer);
      }
    });
  }
};
```

## Create string with name

Now, we've got to create a string with our answer. This is how it looks.

```js
module.exports = function createHtmlPlugin(name) {
  return (
    ` new HtmlWebpackPlugin({filename: "${name}.html" }) `
  );
};
```

We've now created a scaffold with `entry`, `output`, `context` and a `plugin`. If you're curious on the API, check the [API](/guides/scaffolding/) for more info on how to scaffold with `regexps`, `module` and other!

## Defining scopes

In order for webpack to compile, we've got to import `path`. For this, we've got to define something called `topScope`. This is where our code before `module.exports` is going to, where you can add everything from imports and variables to functions. The syntax is the same as with the plugins, except for that the `topScope` property must be an array. In `topScope` you can define and import what's needed for your specific use case.

__generator.js__

```js
const Generator = require('yeoman-generator');
const List = require('@webpack-cli/webpack-scaffold').List;
const Input = require('@webpack-cli/webpack-scaffold').Input;
const createDevConfig = require('./dev-config');

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {
        webpackOptions: {}
      }
    };
  }

  prompting() {
    return this.prompt([
      List('confirm', 'Welcome to the demo scaffold! Are you ready?', ['Yes', 'No', 'Pengwings']),
      Input('entry', 'What is the entry point in your app?'),
      Input('plugin', 'What do you want to name your html file?')
    ]).then(answer => {
      if (answer['confirm'] === 'Pengwings') {
        this.options.env.configuration.dev.webpackOptions = createDevConfig(answer);
        this.options.env.configuration.dev.topScope = [
          'const path = require("path")',
          'const webpack = require("webpack")'
        ];
      }
    });
  }
};
```

## Configuration nomenclature

We recommend you to name your configuration file something meaningful, like in our case: "penguins". To do it, set the `this.options.env.configuration.dev.configName` to desired string.

```js
const Generator = require('yeoman-generator');
const List = require('@webpack-cli/webpack-scaffold').List;
const Input = require('@webpack-cli/webpack-scaffold').Input;
const createDevConfig = require('./dev-config');

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {
        webpackOptions: {}
      }
    };
  }

  prompting() {
    return this.prompt([
      List('confirm', 'Welcome to the demo scaffold! Are you ready?', ['Yes', 'No', 'Pengwings']),
      Input('entry', 'What is the entry point in your app?'),
      Input('plugin', 'What do you want to name your html file?')
    ]).then(answer => {
      if(answer['confirm'] === 'Pengwings') {
        this.options.env.configuration.dev.webpackOptions = createDevConfig(answer);
        this.options.env.configuration.dev.topScope = [
          'const path = require("path")',
          'const webpack = require("webpack")'
        ];
        this.options.env.configuration.dev.configName = 'pengwings';
      }
    });
  }
};
```

## About .yo-rc.json

To write the actual configuration, [webpack CLI](/api/cli/) creates a `.yo-rc.json` file for it to parse the AST. In order for the CLI to understand how to parse the configuration, we need to write to the `.yo-rc.json`. This is done using the `writing` lifecycle method built-in by yeoman.


```js
const Generator = require('yeoman-generator');
const List = require('@webpack-cli/webpack-scaffold').List;
const Input = require('@webpack-cli/webpack-scaffold').Input;
const createDevConfig = require('./dev-config');

module.exports = class WebpackGenerator extends Generator {
  constructor(args, opts) {
    super(args, opts);
    opts.env.configuration = {
      dev: {
        webpackOptions: {}
      }
    };
  }

  prompting() {
    return this.prompt([
      List('confirm', 'Welcome to the demo scaffold! Are you ready?', ['Yes', 'No', 'Pengwings']),
      Input('entry', 'What is the entry point in your app?'),
      Input('plugin', 'What do you want to name your html file?')
    ]).then (answer => {
      if(answer['confirm'] === 'Pengwings') {
        this.options.env.configuration.dev.webpackOptions = createDevConfig(answer);
        this.options.env.configuration.dev.topScope = [
          'const path = require("path")',
          'const webpack = require("webpack")'
        ];
        this.options.env.configuration.dev.configName = 'pengwings';
      }
    });
  }
  writing() {
    this.config.set('configuration', this.options.env.configuration);
  }
};
```


Congratulations 🎉 on completing your first scaffold! If you need help, submit an [issue](https://github.com/evenstensberg/webpack-scaffold-demo/issues), or reach out on [Twitter](https://twitter.com/evenstensberg)!
