import catalogApi from '../../common/catalogApi'
import cartApi from '../../common/cartApi'

const products = {
  params: {
    products: []
  },
  proxies: {
    cartProducts: []
  },
  async created() {
    this.param.products = await catalogApi.getProducts()

    const cart = await cartApi.getCart()
    this.proxy.cartProducts = cart.products.map((el) => {
      return {
        ...this.param.products.find((product) => product.id === el.productId),
        quantity: el.quantity
      }
    })
    console.log(this.proxy.cartProducts)
  },
  methods: {
    async getProduct({ id }) {
      const response = await catalogApi.getProduct(id)

      if (response) {
        return response
      }
    },
    async addToCart(product) {
      const response = await cartApi.addToCart(product)
      console.log(product, response)

      if (response) {
        const p = this.proxy.cartProducts.find((el) => el.id === product.id)
        console.log(p)
        if (p) {
          p.quantity++
        } else {
          product.quantity = 1
          this.proxy.cartProducts.push(product)
        }
      }
    },
    async deleteFromCart(product) {
      const response = await cartApi.deleteFromCart(product)

      if (response) {
        const pIndex = this.proxy.cartProducts.findIndex((el) => el.id === product.id)
        console.log(pIndex)
        if (pIndex !== -1) {
          this.proxy.cartProducts.splice(pIndex, 1)
        }
      }
    },
    changeQuantity(id, v) {
      const product = this.proxy.cartProducts.find((el) => el.id === id)
      product.quantity += v
    }
  }
}
export { products }
