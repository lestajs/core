import button from "../../../../UI/components/button"
import accordion from "../../../../UI/components/accordion"
import input from '../../../../UI/components/input'

export default {
    template: 
    `
        <div class="summary-wr">
            <div class="title">Summary</div>
            <div class="promo">
                <!-- input/accordion... -->
            </div>
            <div class="subtotal">
                <div>Subtotal</div>
                <div class="subtotalPrice"></div>
            </div>
            <div class="discounts">

            </div>
            <div class="total">
                <div>Total</div>
                <div class="totalPrice"></div>
            </div>
            <div class="checkoutBtn"></div>
        </div>
    `,
    props: {
        proxies: {
            cartProducts: {
                store: 'products'
            }
        }
    },
    proxies: {
        promo: 1
    },
    methods: {
        subSum() {
            return this.proxy.cartProducts.reduce((acc, el) => acc + el.price, 0) * this.proxy.promo
        }
    },
    nodes() {
        return {
            subtotalPrice: {
                _text: () => '$' + this.method.subSum()
            },
            promo: {
                component: {
                    src: accordion,
                    proxies: {
                        header: 'Do you have a promo code?'
                    },
                    sections: {
                        content: {
                            src: input,
                            methods: {
                                change: (v) => {
                                    // console.log(v)
                                    if (v === 'lesta') {
                                        this.proxy.promo = 0.9
                                    }
                                }
                            }
                        }
                    }
                }
            },
            totalPrice: {
                _text: () => '$' + (this.method.subSum() - 10 + 7)
            },
            checkoutBtn: {
                component: {
                    src: button,
                    proxies: {
                        text: 'Checkout'
                    }
                }
            },
        }
    }
}
