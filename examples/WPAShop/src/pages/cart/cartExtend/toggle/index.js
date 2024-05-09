import button from "../../../../../UI/components/button"

export default {
  template:
  `
    <div class="minus"></div>
    <div class="quantityNum"></div>
    <div class="plus"></div>
  `,
  props: {
    params: {
      id: {}
    },
    proxies: {
      quantity: {
          default: 1,
      }
    },
    methods: {
      changeQuantity: {
        store: 'products'
      }
    }
  },
  nodes() {
    return {
      plus: {
        component: {
          src: button,
          proxies: {
            value: '+'
          },
          methods: {
            action: () => this.method.setQuantity(this.proxy.quantity++)
          }
        }
      },
      quantityNum: {
        _text: () => this.proxy.quantity
      },
      minus: {
        component: {
          src: button,
          proxies: {
            value: '-'
          },
          methods: {
            action: () => this.proxy.quantity > 1 ? this.method.setQuantity(this.proxy.quantity--) : ''
          }
        }
      }
    }
  },
  methods: {
    setQuantity(v) {
      this.method.changeQuantity({ id: this.param.id, value: v })
    }
  }
}