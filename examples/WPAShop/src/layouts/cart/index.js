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
        component: {
          src: cartCard,
          iterate: () => this.proxy.cartProducts,
          proxies: {
            product: ({ index }) => this.proxy.cartProducts[index]
          }
        }
      }
    }
  }
}
