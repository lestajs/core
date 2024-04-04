// import catalog from '../pages/catalog'
//import product from '../pages/product'
// import about from '../pages/about'

export default {
  layouts: {
    main: () => import('../layouts/main'),
    empty: () => import('../layouts/empty'),
  },
  routes: [
    {
      path: '/catalog',
      layout: 'main',
      component: () => import('../pages/catalog'),
      name: 'catalog',
      extra: { sidebar: {} },
    },
    {
      path: '/product/:id',
      layout: 'empty',
      component: () => import('../pages/product'),
      name: 'product',
    },
    {
      path: '/about',
      layout: 'empty',
      // component: about,
      component: () => import('../pages/about'),
      name: 'about'
    },
    {
      path: '/cart',
      layout: 'main',
      //component: cart,
      component: () => import('../pages/cart'),
      name: 'cart',
      // beforeEnter(to, from) {
      //   console.log(to, from)
        
      //   if (from?.name === 'catalog') {
      //     from.extras.sidebar.method.toggle()
      //     return true
      //   } else {
      //     return false
      //   }
      // }
    },
    {
      path: '/account',
      layout: 'empty',
      component: { template: 'Account' },
      name: 'account',
    },
    {
      path: '/checkout',
      layout: 'main',
      component: () => import('../pages/checkout'),
      name: 'checkout'
    }
  ],
}