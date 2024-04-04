// import { delay } from 'lesta'
import card from '../../../UI/components/card/'
// import accordion from '../../../UI/components/accordion'
import catalogApi from '../../../common/catalogApi.js'
import './index.pcss'
// import filter from './filters/index.js'
import button from '../../../UI/components/buttonOld/index.js'
import buttons from '../../../UI/components/buttons'
import '../../../UI/components/spinner/index.css'
import dropdown from '../../../UI/components/dropdown'
// import groupcheckbox from './filters/groupcheckbox'
import cart from '../../layouts/cart/index.js'

export default {
  template:
    `   
        <div class="categoryBar"></div>
        <div class="filterBar">
            <div class="switchFilters"></div>
            <div class="category"></div>
            <div class="filtersBtn"></div>
        </div>
        <div class="catalog">
            <div class="preload LstSpinner"></div>
            <div class="cards LstCards container content"></div>
        </div>
    `,
  props: {
    params: {
      products: {
        store: 'products'
      }
    },
    methods: {
      addToCart: {
        store: 'products'
      }
    }
  },
  params: {
    categories: []
  },
  proxies: {
    products: [],
    show: true,
    hidden: false,
    activeCategory: 'All'
  },
  nodes() {
    return {
      categoryBar: {
        component: {
          src: buttons,
          proxies: {
            active: () => false,
            buttons: this.param.categories
          },
          methods: {
            change: async (value) => {
              this.proxy.hidden = false
              this.proxy.products = await catalogApi.getProductsByCategory(value)
              this.proxy.hidden = true
              this.proxy.activeCategory = value
            }
          }
        }
      },
      switchFilters: {
        component: {
          src: button,
          proxies: {
            text: () => this.proxy.show ? 'Hide filters' : 'Show filters'
          },
          methods: {
            change: () => this.proxy.show = !this.proxy.show
          }
        }
      },
      category: {
        textContent: () => this.proxy.activeCategory
      },
      filtersBtn: {
        component: {
          src: dropdown,
          proxies: {
            hidden: () => {}
          }
          // sections: {
          //     content: {
          //         src: groupcheckbox,
          //         proxies: {
          //             texts: ["10-50", "50-100", "all"]
          //         }
          //     }
          // }
        }
      },
      preload: {
        hidden: () => this.proxy.hidden
      },
      cards: {
        component: {
          src: card,
          iterate: () => this.proxy.products,
          params: {
            index: (_, i) => i
          },
          proxies: {
            header: (product) => product.title,
            buttons: () => [{
              name: 'cart',
              text: 'Add to cart'
            }],
            image: (product) => product.image,
            // content: (product) => product.description,
            title: (product) => '$' + product.price,
            url: (product) => '/product/' + product.id
          },
          methods: {
            change: (btnName, i) => {
              this.method.addToCart(this.proxy.products[i])
            }
          }
        }
      }
    }
  },
  async created() {
    // await this.method.getAll();
    this.proxy.products = this.param.products
    console.log(this.proxy.products)
    this.param.categories = await catalogApi.getAllCategories()
    // await delay(1500);
    this.proxy.hidden = true
    console.dir(this.router.to.extra.sidebar)
    const sidebarSections = this.router.to.extra.sidebar.section

    await sidebarSections.content.mount({ src: cart })
    await sidebarSections.bottom.mount({
      src: button,
      proxies: {
        text: 'Go to Cart'
      },
      methods: {
        change: () => this.router.push('/cart')
      }
    })
  }
}
