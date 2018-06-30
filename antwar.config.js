const path = require('path');
const combineContexts = require('./src/utilities/combine-contexts');

module.exports = () => ({
  maximumWorkers: process.env.TRAVIS && 1,
  template: {
    file: path.join(__dirname, 'template.ejs')
  },
  output: 'build',
  title: 'webpack',
  keywords: ['webpack', 'javascript', 'web development', 'programming'],
  layout: () => require('./src/components/Site/Site.jsx').default,
  paths: {
    '/': {
      title: 'Home',
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => require.context('./loaders/page-loader!./src/content', false, /^\.\/.*\.md$/),
      index: () => require('./src/components/Splash/Splash.jsx').default
    },
    concepts: {
      title: 'Concepts',
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => require.context('./loaders/page-loader!./src/content/concepts', false, /^\.\/.*\.md$/)
    },
    configuration: {
      title: 'Configuration',
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => require.context('./loaders/page-loader!./src/content/configuration', false, /^\.\/.*\.md$/)
    },
    api: {
      title: 'API',
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => require.context('./loaders/page-loader!./src/content/api', false, /^\.\/.*\.md$/)
    },
    guides: {
      title: 'Guides',
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => require.context('./loaders/page-loader!./src/content/guides', false, /^\.\/.*\.md$/)
    },
    plugins: {
      title: 'Plugins',
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => {
        return combineContexts(
          require.context('./loaders/page-loader!./src/content/plugins', false, /^\.\/.*\.md$/),
          require.context('./loaders/page-loader!./generated/plugins', false, /^\.\/.*\.md$/)
        );
      }
    },
    loaders: {
      title: 'Loaders',
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => {
        return combineContexts(
          require.context('./loaders/page-loader!./src/content/loaders', false, /^\.\/.*\.md$/),
          require.context('./loaders/page-loader!./generated/loaders', false, /^\.\/.*\.md$/)
        );
      }
    },
    contribute: {
      title: 'Contribute',
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => require.context('./loaders/page-loader!./src/content/contribute', false, /^\.\/.*\.md$/)
    },
    migrate: {
      title: 'Migrate',
      url: ({ sectionName, fileName }) => `/${sectionName}/${fileName}/`,
      layout: () => require('./src/components/Page/Page.jsx').default,
      content: () => require.context('./loaders/page-loader!./src/content/migrate', false, /^\.\/.*\.md$/)
    },
    vote: () => require('./src/components/Vote/Vote.jsx').default,
    organization: () => require('./src/components/Organization/Organization.jsx').default,
    'starter-kits': () => require('./src/components/StarterKits/StarterKits.jsx').default
  }
});
