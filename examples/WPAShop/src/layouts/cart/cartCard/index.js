import button from '../../../../UI/components/button'
import card from '../../../../UI/components/card'
import './index.pcss'

export default {
  template:
    `
      <div class="miniCard">
        <div class="l-fx l-jc-sb l-gap">
          <div class="card"></div>
          <div class="price"></div>
        </div>
        <div class="extra">
          <div class="buttons l-fx l-gap">
            <div class="toggle"></div>
            <div class="deleteBtn"></div>
          </div>
        </div>
      </div>
    `,
  props: {
    proxies: {
      product: {}
    },
    methods: {
      deleteFromCart: {
        store: 'products'
      }
    }
  },
  nodes() {
    return {
      card: {
        component: {
          src: card,
          proxies: {
            header: () => this.proxy.product.title,
            content: () => 'Quantity: ' + this.proxy.product.quantity
          }
        }
      },
      price: {
        _text: () => '$' + this.proxy.product.price
      },
      // deleteBtn: {
      //   component: {
      //     src: button,
      //     proxies: {
      //       text: '🗑'
      //     },
      //     methods: {
      //       change: (_, i) => this.method.deleteFromCart({ product: this.proxy.product })
      //     }
      //   }
      // }
    }
  }
}
