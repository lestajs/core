import cartCard from './cartCard/index.js';

export default {
    template: `
    <h3>Cart</h3>
    <div class="cart"></div>`,
    props: {
        params: {
            products: {
                store: 'products',
            },
        },
        proxies: {
            cartProducts: {
                store: 'products',
            }
        }
    },
    nodes() {
        return {
            cart: {
                component: {
                    src: cartCard,
                    iterate: () => this.proxy.cartProducts,
                    proxies: {
                        _product: (product) => product,
                    }
                }
            }
        }
    }
}
