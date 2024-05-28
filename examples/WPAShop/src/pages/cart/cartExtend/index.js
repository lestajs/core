import card from '../../../../UI/components/card'
import cartCard from '../../../layouts/cart/cartCard'
import toggle from './toggle'

export default {
  mixins: [cartCard],
  nodes() {
    return {
      card: {
        component: {
          src: card,
          proxies: {
            header: () => this.proxy.product.title,
            content: () => this.app.filters.currencyUSD(this.proxy.product.price)
          }
        }
      },
      toggle: {
        component: {
          src: toggle,
          params: {
            id: () => this.proxy.product.id
          },
          proxies: {
            quantity: () => this.proxy.product.quantity
          }
        }
      },
      price: {
        textContent: () => this.app.filters.currencyUSD(this.proxy.product.price * this.proxy.product.quantity)
      }
    }
  }
}