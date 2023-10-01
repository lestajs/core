export default {
    async getCarts() {
        
    },
    async getCart(id) {
        const response = await fetch('https://fakestoreapi.com/carts/' + id)
        return await response.json()
    },
}