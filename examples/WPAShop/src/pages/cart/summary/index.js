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
				<div class="discounts"></div>
				<div class="total">
					<div>Total</div>
					<div class="totalPrice"></div>
				</div>
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
	nodes() {
		return {
			subtotalPrice: {
				_text: () => this.app.filters.currencyUSD(this.method.subSum())
			},
			promo: {
				component: {
					src: accordion,
					proxies: {
						header: 'Do you have a promo code?'
					},
					spots: {
						content: {
							component: {
								src: input,
								methods: {
									action: ({ value }) => this.proxy.promo = value === 'lesta' ? 0.9 : 1
								}
							}
						}
					}
				}
			},
			totalPrice: {
				_text: () => this.app.filters.currencyUSD(this.method.subSum())
			},
		}
	},
	methods: {
		subSum() {
			return this.proxy.cartProducts.reduce((acc, el) => acc + el.price, 0) * this.proxy.promo
		}
	}
}
