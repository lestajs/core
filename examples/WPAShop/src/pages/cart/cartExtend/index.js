import cartCard from "../../../layouts/cart/cartCard"

export default {
    template: 
    `
        <div>
            <div class="cartExtend"></div>
        </div>
    `,
    props: {
        proxies: {
            _product: {}
        }
    },
    nodes() {
        return {
            cartExtend: {
                component: {
                    src: cartCard,
                    proxies: {
                        _product: () => this.proxy._product,
                    },
                    sections: {
                        content: {
                            src: { template: 'Toggle' }
                        }
                    }
                }
            }
        }
    }
}