import cartCard from "../../layouts/cart/cartCard"
import cartExtend from "./cartExtend"
import './index.pcss'
import summary from "./summary"
import button from '../../../UI/components/button'

export default {
  template:
    `
      <div>
          <div class="title">Your products</div>
          <div class="cartContainer"></div>
      </div>
    `,
  props: {
    proxies: {
      cartProducts: {
        store: 'products',
      }
    }
  },
  nodes() {
    return {
      cartContainer: {
        component: {
          src: cartExtend,
          iterate: () => this.proxy.cartProducts,
          proxies: {
            product: ({ index }) => this.proxy.cartProducts[index],
          }
        }
      }
    }
  },
  async created() {
    await this.app.sidebar.spot.content.mount({ src: summary })
    await this.app.sidebar.spot.bottom.mount({ 
      src: button,
      proxies: {
        value: 'Checkout'
      },
      methods: {
        action: () => this.app.router.push('/checkout')
      }
    })
  }
}