module.exports = {
  base: '/foldable-js/',
  lang: 'en-US',
  title: 'Foldable js',
  description: 'Open|Close things in webpage',
  plugins: [['@vuepress/register-components', true]],
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    logo: '',
    activeHeaderLinks: true,
    sidebar: false,
    navbar: [
      {
        text: 'Home',
        link: '/',
      },
      {
        text: 'Demos',
        children: [
          {
            text: 'basic',
            link: '/demos/basic.md'
          },
          {
            text: 'Modal',
            link: '/demos/modal.md'
          },
          {
            text: 'Menu',
            link: '/demos/menu.md'
          },
        ],
      },
    ],
  },
}