---
title: Writer's Guide
sort: 1
contributors:
  - pranshuchittora
  - EugeneHlushko
  - fokusferit
---

The following sections contain all you need to know about editing and formatting the content within this site. Make sure to do some research before starting your edits or additions. Sometimes the toughest part is finding where the content should live and determining whether or not it already exists.


## Process

1. Check related issue if an article links to one.
2. Hit `edit` and expand on the structure.
3. PR changes.


## YAML Frontmatter

Each article contains a small section at the top written in [YAML Frontmatter](https://jekyllrb.com/docs/frontmatter/):

``` yaml
---
title: My Article
group: My Sub-Section
sort: 3
contributors:
  - [github username]
related:
  - title: Title of Related Article
    url: [url of related article]
---
```

Let's break these down:

- `title`: The name of the article.
- `group`: The name of the sub-section
- `sort`: The order of the article within its section (or) sub-section if it is present.
- `contributors`: A list of GitHub usernames who have contributed to this article.
- `related`: Any related reading or useful examples.

Note that `related` will generate a __Further Reading__ section at the bottom of the page and `contributors` will yield a __Contributors__ section below it. If you edit an article and would like recognition, don't hesitate to add your GitHub username to the `contributors` list.


## Article Structure

1. Brief Introduction - a paragraph or two so you get the basic idea about the what and why.
2. Outline Remaining Content – how the content will be presented.
3. Main Content - tell what you promised to tell.
4. Conclusion - tell what you told and recap the main points.


## Typesetting

- webpack should always be written in lower-case letters. Even at the beginning of a sentence. ([source](https://github.com/webpack/media#name))
- loaders are enclosed in backticks and [kebab-cased](https://en.wikipedia.org/w/index.php?title=Kebab_case): `css-loader`, `ts-loader`, …
- plugins are enclosed in backticks and [camel-cased](https://en.wikipedia.org/wiki/Camel_case): `BannerPlugin`, `NpmInstallWebpackPlugin`, …
- Use "webpack 2" to refer to a specific webpack version (~~"webpack v2"~~)
- Use ES5; ES2015, ES2016, … to refer to the ECMAScript standards (~~ES6~~, ~~ES7~~)


## Formatting

### Code

__Syntax: \`\`\`javascript … \`\`\`__

```javascript
function foo () {
  return 'bar';
}

foo();
```

#### Quotation

Use single quotes in code snippets and project files (`.jsx`, `.scss` etc):


```diff
- import webpack from "webpack";
+ import webpack from 'webpack';
```


And in inline backticks:

__correct__

Set value to `'index.md'`...

__incorrect__

Set value to `"index.md"`...


### Lists

- Boo
- Foo
- Zoo

Lists should be ordered alphabetically.

### Tables

Parameter   | Explanation                                      | Input Type | Default Value
----------- | ------------------------------------------------ | ---------- |--------------
--debug     | Switch loaders to debug mode                     | boolean    | false
--devtool   | Define source map type for the bundled resources | string     | -
--progress  | Print compilation progress in percentage         | boolean    | false

Tables should also be ordered alphabetically.

### Configuration Properties

The [configuration](/configuration) properties should be ordered alphabetically as well:

- `devServer.compress`
- `devServer.contentBase`
- `devServer.hot`

### Quotes

#### Blockquote

__Syntax: \>__

> This is a blockquote.

#### Tip

__Syntax: T\>__

T> This is a tip.

__Syntax: W\>__

W> This is a warning.

__Syntax: ?\>__

?> This is a todo.

### Assumptions and simplicity

Do not make assumptions when writing the documentation.

```diff
- You might already know how to optimize bundle for production...
+ As we've learned in [production guide](/guides/production/)...
```

Please do not assume things are "simple", "easy" or "special". Avoid words like 'just', 'simply' or "basically".

```diff
- Simply run command...
+ Run the `command-name` command...
```

Also avoid words with can be considered insensitive like "disabled" or "special". Instead use for example "turned off" or "specific".

### Configuration defaults and types

Always provide types and defaults to all of the documentation options in order to keep the documentation accessible and well-written. We are adding types and defaults after entitling the documented option:

__configuration.example.option__

`string = 'none'`

Where `= 'none'` means that the default value is `'none'` for the given option.

`string = 'none': 'none' | 'development' | 'production'`

Where `: 'none' | 'development' | 'production'` enumerates the possible type values, in this case, three strings are acceptable: `'none'`, `'development'`, and `'production'`.

Use space between types to list all available types for the given option:

`string = 'none': 'none' | 'development' | 'production'` `boolean`

To mark an array, use square brackets:

`string` `[string]`

If multiple types are allowed in `array`, use comma:

`string` `[string, RegExp, function(arg) => string]`

To mark a function, also list arguments when they are available:

`function (compilation, module, path) => boolean`

Where `(compilation, module, path)` lists the arguments that the provided function will receive and `=> boolean` means that the return value of the function must be a `boolean`.

To mark a Plugin as an available option value type, use the camel case title of the `Plugin`:

`TerserPlugin` `[TerserPlugin]`

Which means that the option expects one or few `TerserPlugin` instances.

To mark a number, use `number`:

`number = 15: 5, 15, 30`

To mark an object, use `object`:

`object = { prop1 string = 'none': 'none' | 'development' | 'production', prop2 boolean = false, prop3 function (module) => string }`

When object's key can have multiple types, use `|` to list them. Here is an example, where `prop1` can be both a string and an array of strings:

`object = { prop1 string = 'none': 'none' | 'development' | 'production' | [string]}`

This allows us to display the defaults, enumeration and other information.

If the object's key is dynamic, user-defined, use `<key>` to describe it:

`object = { <key> string }`
