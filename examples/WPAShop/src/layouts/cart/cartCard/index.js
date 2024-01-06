import button from '../../../../UI/components/button';
import card from '../../../../UI/components/card';

export default {
    template: `
    <div class="miniCard">
        <div class="card"></div>
        <div class="extra">
            <div class="price"></div>
            <div class="deleteBtn"></div>
        </div>
    </div>`,
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
                textContent: () => '$' + this.proxy._product.price,
            },
            deleteBtn: {
                component: {
                    src: button,
                    proxies: {
                        text: '🗑',
                    },
                    methods: {
                        change: (_, i) => this.method.deleteFromCart(this.proxy._product)
                    }
                }
            }
        }
    }
}