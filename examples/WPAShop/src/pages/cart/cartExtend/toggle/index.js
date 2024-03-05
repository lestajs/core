import button from "../../../../../UI/components/button"

export default {
    template: 
    `
            <div class="minus"></div>
            <div class="quantityNum"></div>
            <div class="plus"></div>
    `,
    props: {
        proxies: {
            quantity: {
                default: 1,
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
                        change: () => this.proxy.quantity++
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
                        change: () => this.proxy.quantity > 1 ? this.proxy.quantity-- : this.proxy.quantity
                    }
                }
            }
        }
    }
}