---
title: Loaders
sort: -1
contributors:
  - simon04
  - bajras
  - rhys-vdw
  - EugeneHlushko
  - hemal7735
  - fokusferit
---

webpack enables use of [loaders](/concepts/loaders) to preprocess files. This allows you to bundle any static resource way beyond JavaScript. You can write your own loaders using Node.js.

Loaders are activated by using `loadername!` prefixes in `require()` statements, or are automatically applied via regex from your webpack configuration – see [configuration](/concepts/loaders/#configuration).


## Files

- [`raw-loader`](/loaders/raw-loader) Loads raw content of a file (utf-8)
- [`val-loader`](/loaders/val-loader) Executes code as module and consider exports as JS code
- [`url-loader`](/loaders/url-loader) Works like the file loader, but can return a [data URL](https://tools.ietf.org/html/rfc2397) if the file is smaller than a limit
- [`file-loader`](/loaders/file-loader) Emits the file into the output folder and returns the (relative) URL
- [`ref-loader`](https://www.npmjs.com/package/ref-loader) Create dependencies between any files manually


## JSON

- [`json-loader`](/loaders/json-loader) Loads a [JSON](http://json.org/) file (included by default)
- [`json5-loader`](/loaders/json5-loader) Loads and transpiles a [JSON 5](https://json5.org/) file
- [`cson-loader`](https://github.com/awnist/cson-loader) Loads and transpiles a [CSON](https://github.com/bevry/cson#what-is-cson) file


## Transpiling

- [`script-loader`](/loaders/script-loader) Executes a JavaScript file once in global context (like in script tag), requires are not parsed
- [`babel-loader`](/loaders/babel-loader) Loads ES2015+ code and transpiles to ES5 using [Babel](https://babeljs.io/)
- [`buble-loader`](https://github.com/sairion/buble-loader) Loads ES2015+ code and transpiles to ES5 using [Bublé](https://buble.surge.sh/guide/)
- [`traceur-loader`](https://github.com/jupl/traceur-loader) Loads ES2015+ code and transpiles to ES5 using [Traceur](https://github.com/google/traceur-compiler#readme)
- [`ts-loader`](https://github.com/TypeStrong/ts-loader) or [`awesome-typescript-loader`](https://github.com/s-panferov/awesome-typescript-loader) Loads [TypeScript](https://www.typescriptlang.org/) 2.0+ like JavaScript
- [`coffee-loader`](/loaders/coffee-loader) Loads [CoffeeScript](http://coffeescript.org/) like JavaScript
- [`fengari-loader`](https://github.com/fengari-lua/fengari-loader/) Loads Lua code using [fengari](https://fengari.io/)
- [`elm-webpack-loader`](https://github.com/elm-community/elm-webpack-loader) Loads [Elm](https://elm-lang.org/) like JavaScript


## Templating

- [`html-loader`](/loaders/html-loader) Exports HTML as string, require references to static resources
- [`pug-loader`](https://github.com/pugjs/pug-loader) Loads Pug and Jade templates and returns a function
- [`markdown-loader`](https://github.com/peerigon/markdown-loader) Compiles Markdown to HTML
- [`react-markdown-loader`](https://github.com/javiercf/react-markdown-loader) Compiles Markdown to a React Component using the markdown-parse parser
- [`posthtml-loader`](https://github.com/posthtml/posthtml-loader) Loads and transforms a HTML file using [PostHTML](https://github.com/posthtml/posthtml)
- [`handlebars-loader`](https://github.com/pcardune/handlebars-loader) Compiles Handlebars to HTML
- [`markup-inline-loader`](https://github.com/asnowwolf/markup-inline-loader) Inline SVG/MathML files to HTML. It’s useful when applying icon font or applying CSS animation to SVG.
- [`twig-loader`](https://github.com/zimmo-be/twig-loader) Compiles Twig templates and returns a function

## Styling

- [`style-loader`](/loaders/style-loader) Add exports of a module as style to DOM
- [`css-loader`](/loaders/css-loader) Loads CSS file with resolved imports and returns CSS code
- [`less-loader`](/loaders/less-loader) Loads and compiles a LESS file
- [`sass-loader`](/loaders/sass-loader) Loads and compiles a SASS/SCSS file
- [`postcss-loader`](/loaders/postcss-loader) Loads and transforms a CSS/SSS file using [PostCSS](http://postcss.org)
- [`stylus-loader`](https://github.com/shama/stylus-loader) Loads and compiles a Stylus file


## Linting && Testing

- [`mocha-loader`](/loaders/mocha-loader) Tests with [mocha](https://mochajs.org/) (Browser/NodeJS)
- [`eslint-loader`](https://github.com/webpack-contrib/eslint-loader) PreLoader for linting code using [ESLint](https://eslint.org/)
- [`jshint-loader`](/loaders/jshint-loader) PreLoader for linting code using [JSHint](http://jshint.com/about/)
- [`jscs-loader`](https://github.com/unindented/jscs-loader) PreLoader for code style checking using [JSCS](http://jscs.info/)
- [`coverjs-loader`](/loaders/coverjs-loader) PreLoader to determine the testing coverage using [CoverJS](https://github.com/arian/CoverJS)


## Frameworks

- [`vue-loader`](https://github.com/vuejs/vue-loader) Loads and compiles [Vue Components](https://vuejs.org/v2/guide/components.html)
- [`polymer-loader`](https://github.com/webpack-contrib/polymer-webpack-loader) Process HTML & CSS with preprocessor of choice and `require()` Web Components like first-class modules
- [`angular2-template-loader`](https://github.com/TheLarkInn/angular2-template-loader) Loads and compiles [Angular](https://angular.io/) Components

## Awesome

For more third-party loaders, see the list from [awesome-webpack](https://github.com/webpack-contrib/awesome-webpack#loaders).
