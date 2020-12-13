module.exports = {
  theme: '',
  title: ' Foldable-js',
  plugins: ['@vuepress/active-header-links'],
  head: [],
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
          { text: 'Modal', link: '/examples/modal' },
        ]
      },
      { text: 'github', link: 'https://github.com/Masth0/foldable-js' },
    ],
  }
};
