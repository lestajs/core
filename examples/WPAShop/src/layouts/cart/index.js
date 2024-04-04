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
        textContent: () => {
          if(!this.proxy.cartProducts.length) {return 'There is nothing in your cart yet...'}
          //else { return 'Hello' }
        },
        onclick: () => {
          this.node.cart.textContent = 'Hello'
        },
        component: {
          src: cartCard,
          iterate: () => this.proxy.cartProducts,
          proxies: {
            _product: (product) => product
          }
        }
      }
    }
  },
  mounted() {
    console.log(this.node.cart.reactivity)
  }
}
