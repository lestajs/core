import { delay } from 'lesta';
import card from "../../../../UI/components/card";
import sidebar from "../../../../UI/components/sidebar";
import accordion from "../../../../UI/components/accordion";
import api from "../../../common/api.js";
import './index.pcss';
import filter from './filters/index.js';
import button from "../../../../UI/components/button";
import buttons from "../../../../UI/components/buttons";
import '../../../../UI/components/spinner/index.css';

export default {
    template:
    `   
        <div class="categoryBar"></div>
        <div class="filterBar">
            <div class="switchFilters"></div>
            <div class="category"></div>
        </div>
        <div class="catalog ">
            <div class="sidebar"></div>
            <div class="preload" style="width: 100px; height: 100px;">
                <div class="LstSpinner"></div>
            </div>
            <div class="cards LstCards container content"></div>
        </div>
    `,
    params: {
        categories: [],
        products: [],
    },
    proxies: {
        products: [],
        show: true,
        hidden: false,
        activeCategory: 'All',
    },
    nodes() {
        return {
            cards: {
                component: {
                    src: card,
                    iterate: () => this.proxy.products,
                    proxies: {
                        title: (product) => product.title,
                        buttons: () => ['1', '2', '3'],
                        image: (product) => product.image,
                        description: (product) => product.description,
                    }
                },
            },
            sidebar: {
                component: {
                    src: sidebar,
                    proxies: {
                        show: () => this.proxy.show,
                    },
                    sections: {
                        content: {
                            src: filter,
                            params: {
                                header: 'New Filter'
                            },
                            methods: {
                                change: () => {},
                                priceFilter: (from, to) => {
                                    this.proxy.products = this.param.products.filter((el) => el.price >= from && el.price <= to);
                                }
                            }
                        }
                    }
                }
            },
            switchFilters: {
                component: {
                    src: button,
                    proxies: {
                        text: () => this.proxy.show ? 'Hide filters' : 'Show filters',
                    },
                    methods: {
                        change: () => this.proxy.show = !this.proxy.show,
                    },
                }
            },
            category: {
                textContent: () => this.proxy.activeCategory,
            },
            categoryBar: {
                component: {
                    src: buttons,
                    proxies: {
                        active: () => false,
                        buttons: this.param.categories,
                    },
                    methods: {
                        change: async (value) => {
                            this.proxy.hidden = false;
                            this.proxy.products = await api.getProductsByCategory(value);
                            this.proxy.hidden = true;
                            this.proxy.activeCategory = value;
                        }
                    }
                }
            },
            preload: {
                hidden: () => this.proxy.hidden,
            }
        }
    },
    async created() {
        this.param.products = await api.getProducts();
        this.proxy.products = this.param.products;
        console.log(this.proxy.products);
        this.param.categories = await api.getAllCategories();
//        await delay(3000);
        this.proxy.hidden = true;
    }
}