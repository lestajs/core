import cartCard from './cartCard/index.js';
import cartApi from '../../../common/cartApi.js';

export default {
    template: `<div class="cart"></div>`,
    props: {
        params: {
            products: {
                store: 'products',
            },
        },
    },
    proxies: {
        products: [],
    },
    nodes() {
        return {
            cart: {
                component: {
                    src: cartCard,
                    iterate: () => this.proxy.products,
                    proxies: {
                        _product: (product) => product,
                    }
                }
            }
        }
    },
    created() {
        console.log(this.param.products)
    },
    async loaded() {
        // console.log(this.options);
        this.options.proxies.products = await cartApi.getCart(2);
    },
}
