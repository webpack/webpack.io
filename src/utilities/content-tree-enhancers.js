const fs = require('fs');
const frontMatter = require('front-matter');
const remark = require('remark');
const slug = require('remark-slug');
const extractAnchors = require('remark-extract-anchors');

const enhance = (tree, options) => {
  // delete `./` root directory on node
  const dir = options.dir.replace(/^(\.\/)/gm, '');

  tree.url = tree.path
    // delete `.md` extensions
    .replace(tree.extension, '')
    // delete source content directory
    .replace(dir, '')
    // remove `index` for root urls
    .replace(/\/index$/, '')
    // replace empty strings with `/`
    .replace(/^$/, '/')
    // delete trailing dots for node
    .replace(/^(\.)/g, '');

  if (tree.type === 'file') {
    let anchors = [];
    let content = fs.readFileSync(tree.path, 'utf8');
    let { attributes } = frontMatter(content);

    // remove underscore from fetched files
    if (tree.name[0] === '_') {
      tree.name = tree.name.replace('_', '');
      tree.url = tree.url.replace('_', '');
    }

    remark()
      .use(slug)
      .use(extractAnchors, { anchors })
      .process(content, err => {
        if (err) {
          throw err;
        }
      });

    tree.anchors = anchors;

    Object.assign(tree, attributes);
  }
};

const filter = item => true;

const sort = (a, b) => a.name == 'index.md' ? -1 : 1

function restructure(item, options) {
  enhance(item, options);

  if (item.children) {
    item.children.forEach(child => restructure(child, options));

    item.children.filter(filter);
    item.children.sort(sort);
  }

  return item;
}

module.exports = {
  enhance,
  filter,
  restructure,
  sort
};
