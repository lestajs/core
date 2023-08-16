export default [
  {
    path: '/*',
    name: '404',
    component: () => import('../pages/404/index.js')
  },
  {
  path: '/:locale',
  params: {
    locale: {
      regex: /^[a-z]{2}$/,
      optional: true,
      enum: ['en', 'ru'],
    }
  },
  children: [
    {
      path: '',
      alias: 'home', // []
      name: 'home',
      layout: 'main',
      component: () => import('../pages/home/index.js')
    },
    {
      path: 'about.html',
      name: 'about',
      layout: 'main',
      component: () => import('../pages/about/index.js'),
      type: 'static',
      meta: async (to) => [
      {
        name: 'keywords',
        content: 'About, about'
      },
      {
        name: 'description',
        content: 'About'
      }],
      title: 'about',
      view: async (to) => {
        return { lang: to.params.locale || 'en' }
      }
    },
    {
      path: 'preview',
      redirect: '/about.html?q=preview',
    },
    {
      path: 'profile',
      name: 'profile',
      extra: { requiresAuth: true },
      layout: 'default',
      component: () => import('../pages/profile/index.js'),
      type: 'dynamic',
    }
  ]
}]