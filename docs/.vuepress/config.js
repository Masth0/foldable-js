module.exports = {
  theme: '',
  title: ' Foldable-js',
  plugins: ['@vuepress/active-header-links'],
  head: [
    { text: 'Home', link: '/' },
  ],
  port: 8080,
  base: '/foldable-js/',
  configureWebpack: {},
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    search: false,
    // logo: '',
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Examples',
        ariaLabel: 'Examples menu',
        items: [
          { text: 'Basic Foldable', link: '/examples/simple' },
/*          { text: 'Modal', link: '/examples/open-close' },
          { text: 'Enable or Disable', link: '/examples/open-close' },
          { text: 'Use of Reset()', link: '/examples/open-close' },
          { text: 'Accordion', link: '/examples/open-close' },
          { text: 'Fetch api', link: '/examples/open-close' },*/
        ]
      },
      { text: 'github', link: 'https://github.com/Masth0/foldable-js' },
    ],
  }
};
