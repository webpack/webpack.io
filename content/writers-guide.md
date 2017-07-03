---
title: Writer's Guide
---

The following sections contain all you need to know about editing and formatting the content within this site. Make sure to do some research before starting your edits or additions. Sometimes the toughest part is finding where the content should live and determining whether or not it already exists.


## Process

1. Check related issue if an article links to one.
2. Hit `edit` and expand on the structure.
3. PR changes.


## YAML Frontmatter

Each article contains a small section at the top written in [YAML Frontmatter]():

``` yaml
---
title: My Article
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
- `sort`: The order of the article within its section.
- `contributors`: A list of GitHub usernames who have contributed to this article.
- `related`: Any related reading or useful examples.

Note that `related` will generate a __Further Reading__ section at the bottom of the page and `contributors` will yield a __Contributors__ section below it. If you edit an article and would like recognition, don't hesitate to add your GitHub username to the `contributors` list.


## Article Structure

1. Brief Introduction - a paragraph or two so you get the basic idea about the what and why.
2. Outline Remaining Content – how the content will be presented.
3. Main Content - tell what you promised to tell.
4. Conclusion - tell what you told and recap the main points.


## Running the Site

1. `npm install`
2. `npm start`
3. `open http://localhost:3000`

The site will update itself as you make changes.


## Typesetting

* webpack should always be written in lower-case letters. Even at the beginning of a sentence. ([source](https://github.com/webpack/media#name))
* loaders are enclosed in backticks and [kebab-cased](https://en.wikipedia.org/w/index.php?title=Kebab_case): `css-loader`, `ts-loader`, …
* plugins are enclosed in backticks and [camel-cased](https://en.wikipedia.org/wiki/Camel_case): `BannerPlugin`, `NpmInstallWebpackPlugin`, …
* Use "webpack 2" to refer to a specific webpack version (~~"webpack v2"~~)
* Use ES5; ES2015, ES2016, … to refer to the ECMAScript standards (~~ES6~~, ~~ES7~~)


## Formatting

### Code

**Syntax: \`\`\`javascript … \`\`\`**

```javascript
function foo () {
  return 'bar';
}

foo();
```

### Lists

* Boo
* Foo
* Zoo

Lists should be ordered alphabetically.

### Tables

| Parameter  | Explanation                                      | Input type | Default value |
|------------|--------------------------------------------------|------------|---------------|
| --debug    | Switch loaders to debug mode                     | boolean    | false         |
| --devtool  | Define source map type for the bundled resources | string     | -             |
| --progress | Print compilation progress in percentage         | boolean    | false         |

Same goes for tables.

### Configuration Properties

The [configuration](/configuration) properties should be ordered alphabetically as well:

* `devServer.contentBase`
* `devServer.compress`
* `devServer.hot`

### Quotes

#### Blockquote

**Syntax: \>**

> This is a blockquote.

#### Tip

**Syntax: T\>**

T> This is a tip.

**Syntax: W\>**

W> This is a warning.

**Syntax: ?\>**

?> This is a todo.
