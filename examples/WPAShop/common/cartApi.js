const userId = 2
const cartId = 3

export default {
    async getCarts() {
        
    },
    async getCart() {
        const response = await fetch('https://fakestoreapi.com/carts/' + userId)
        return await response.json()
    },
    async addToCart(product) {
        const response = await fetch('https://fakestoreapi.com/carts', {
            method: 'POST',
            body: JSON.stringify(
                {
                    userId,
                    date: new Date(),
                    products: [{productId: product.id, quantity: 1}]
                }
            )
        })

        return await response.json()
    },
    async deleteFromCart(product) {
        const response = await fetch('https://fakestoreapi.com/carts/' + cartId, {
            method: 'PUT',
            body: JSON.stringify(
                {
                    userId,
                    date: new Date(),
                    products:[{productId: product.id, quantity: 1}]
                }
            )
        })

        return await response.json()
    },
    async updateProduct(product, quantity) {
        const response = await fetch('https://fakestoreapi.com/carts/' + cartId, {
            method: "PATCH",
            body: JSON.stringify(
                {
                    userId,
                    date: new Date(),
                    products:[{productId: product.id, quantity}]
                }
            )
        })
            
        return await response.json()
    }
}