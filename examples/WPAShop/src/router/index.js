import catalog from '../pages/catalog'
import product from '../pages/product'
import about from '../pages/about'

export default {
  layouts: {
    main: () => import('../layouts/main'),
    empty: () => import('../layouts/empty'),
  },
  routes: [
    {
      path: '/catalog',
      layout: 'main',
      component: catalog,
      name: 'catalog',
      extra: { sidebar: {} },
    },
    {
      path: '/product/:id',
      layout: 'main',
      component: product,
      name: 'product',
    },
    {
      path: '/about',
      layout: 'empty',
      component: about,
      name: 'about'
    },
    {
      path: '/cart',
      layout: 'main',
      //component: cart,
      component: { template: 'Cart' },
      name: 'cart',
      beforeEnter(to, from) {
        console.log(to, from)
        
        if (from.name === 'catalog') {
          from.extras.sidebar.method.toggle()
          return true
        } else {
          return false
        }
      }
    },
    {
      path: '/account',
      layout: '/empty',
      component: { template: 'Account' },
      name: 'account',
    }
  ],
}