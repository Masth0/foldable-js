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
  themeConfig: {
    search: false,
    logo: '',
    nav: [
      { text: 'Home', link: '/' },
      // {
      //   text: 'Examples',
      //   ariaLabel: 'Examples menu',
      //   items: [
      //     { text: 'Simple', link: '/examples/simple' },
      //   ]
      // },
      { text: 'github', link: 'https://github.com/Masth0/foldable-js' },
    ],
  }
};
