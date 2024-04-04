import button from '../../../../UI/components/buttonOld'
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
      _product: {}
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
            header: () => this.proxy._product.title,
            content: () => 'Quantity: ' + this.proxy._product.quantity
          }
        }
      },
      price: {
        textContent: () => '$' + this.proxy._product.price
      },
      deleteBtn: {
        component: {
          src: button,
          proxies: {
            text: '🗑'
          },
          methods: {
            change: (_, i) => this.method.deleteFromCart(this.proxy._product)
          }
        }
      }
    }
  }
}
