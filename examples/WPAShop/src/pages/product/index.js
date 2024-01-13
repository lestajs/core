import image from "../../../UI/components/image"


export default {
    template: `
    <div class="product">
        <div class="left">
            <img class="picture">
        </div>
        <div class="right">
            <div class="title"></div>
            <div class="price">100$</div>
            <div class="ratingBar">
                <div class="rating"></div>
                <div class="reviews"></div>
            </div>
            <div class="btns">
                <div class="addToCartBtn">Add to Cart 🛒</div>
                <div class="addToFavBtn">Add to Favourites ❤️</div>
            </div>
            <div class="description"></div>
        </div>
    </div>`,
    props: {
        methods: {
            getProduct: {
                store: 'products'
            }
        }
    },
    params: {
        product: {}
    },
    nodes() {
        return {
            picture: {
                src: this.param.product.image,
            },
            title: {
                textContent: this.param.product.title,
            },
            rating: {
                textContent: this.param.product.rating.rate + '/5',
            },
            reviews: {
                textContent: this.param.product.rating.count + ' reviews',
            },
            description: {
                textContent: this.param.product.description
            }
        }
    },
    async created(){
        console.log(this.router.to.params.id)

        this.param.product = await this.method.getProduct({id: this.router.to.params.id})
    }
}