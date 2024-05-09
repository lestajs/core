import button from "../../../../../UI/components/buttonOld"

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
                        text: '+'
                    },
                    methods: {
                        change: () => this.method.changeQuantity({ id: this.param.id, value: this.proxy.quantity + 1 })
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
                        text: '-'
                    },
                    methods: {
                        change: () => this.method.changeQuantity({ id: this.param.id, value: this.proxy.quantity - 1 })
                    }
                }
            }
        }
    }
}