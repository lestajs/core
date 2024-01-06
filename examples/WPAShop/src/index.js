import { createApp, createRouter, createStores } from 'lesta';
import { _attr, _classes } from '../UI/components/directives/index.js';
import catalogApi from '../common/catalogApi.js';
import catalog from './pages/catalog/index.js';
import '../UI/components/ui.css';
import axios from 'axios'
import filters from '../plugins/filters.js'
import cartApi from '../common/cartApi.js';
import product from './pages/product/index.js';
import about from './pages/about/index.js';

const app = createApp({
    root: document.querySelector('#root'),
    directives: {
        _attr, _classes,
    },
    plugins: {
        axios, filters,
    }
});

const router = createRouter({
    layouts: {
        main: () => import('./layouts/main'),
        empty: () => import('./layouts/empty'),
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
});

const stores = createStores({
    products: {
        params: {
            products: [],
        },
        proxies: {
            cartProducts: [],
        },
        async created() {
            this.param.products = await catalogApi.getProducts();

            const cart = await cartApi.getCart();
            this.proxy.cartProducts = cart.products.map((el) => {
                return {
                    ...this.param.products.find((product) => product.id === el.productId),
                    quantity: el.quantity
                }
            });
            console.log(this.proxy.cartProducts)
        },
        methods: {
            async getProduct({id}) {
                const response = await catalogApi.getProduct(id)

                if (response) {
                    return response
                }
            },
            async addToCart(product) {
                const response = await cartApi.addToCart(product)
                console.log(product, response)
                
                if (response) {
                    const p = this.proxy.cartProducts.find((el) => el.id === product.id)
                    console.log(p)
                    if (p) {
                        p.quantity++
                    } else {
                        product.quantity = 1
                        this.proxy.cartProducts.push(product)
                    }
                }
            },
            async deleteFromCart(product) {
                const response = await cartApi.deleteFromCart(product)

                if (response) {
                    const pIndex = this.proxy.cartProducts.findIndex((el) => el.id === product.id)
                    console.log(pIndex)
                    if (pIndex !== -1) {
                        this.proxy.cartProducts.splice(pIndex, 1)
                    }
                }
            }
        }
    },
});

stores.init(app);
router.init(app);

//app.mount(catalog);
