import cartCard from './cartCard/index.js'

export default {
  template:
    `
      <h3>Cart</h3>
      <div class="cart"></div>
    `,
  props: {
    proxies: {
      cartProducts: {
        store: 'products'
      }
    }
  },
  nodes() {
    return {
      cart: {
        _text: () => !this.proxy.cartProducts.length ? 'There is nothing in your cart yet...' : '',
        component: {
          src: cartCard,
          iterate: () => this.proxy.cartProducts,
          proxies: {
            _product: (product) => product
          }
        }
      }
    }
  }
}
