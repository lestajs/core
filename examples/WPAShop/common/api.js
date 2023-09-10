export default {
    async getProduct(id) {
        const response = await fetch('https://fakestoreapi.com/products/' + id);
        return await response.json();
    },
    async getProducts() {
        const response = await fetch('https://fakestoreapi.com/products');
        return await response.json();
    },
    async getAllCategories() {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        return await response.json();
    },
    async getProductsByCategory(name) {
        const response = await fetch('https://fakestoreapi.com/products/category/' + name);
        return await response.json();
    },
    // async getProductsByPrice(from, to) {
    //     this.products.forEach((el, index) => {
    //         if (el.price > to || el.price < from) {
    //             correctProducts.splice(index, 1);
    //         }
    //     });
        
    //     return this.products;
    // }
}
