import cartCard from "../../layouts/cart/cartCard"
import cartExtend from "./cartExtend"
import './index.pcss'
import summary from "./summary"

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
                        product: (product) => product,
                    }
                }
            }
        }
    },
    async created() {
        await this.app.sidebar.spot.content.mount({ src: summary })
    }
}