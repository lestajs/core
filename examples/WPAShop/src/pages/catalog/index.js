import { delay } from 'lesta';
import card from "../../../../UI/components/card";
import sidebar from "../../../../UI/components/sidebar";
import accordion from "../../../../UI/components/accordion";
import catalogApi from "../../../common/catalogApi.js";
import './index.pcss';
import filter from './filters/index.js';
import button from "../../../../UI/components/button";
import buttons from "../../../../UI/components/buttons";
import '../../../../UI/components/spinner/index.css';
import cartApi from '../../../common/cartApi';
import dropdown from '../../../../UI/components/dropdown';
import groupcheckbox from './filters/groupcheckbox';
import cart from '../../layouts/cart';

export default {
    template:
    `   
        <div class="categoryBar"></div>
        <div class="filterBar">
            <div class="switchFilters"></div>
            <div class="category"></div>
            <div class="filtersBtn"></div>
        </div>
        <div class="catalog ">
            <div class="preload LstSpinner"></div>
            <div class="cards LstCards container content"></div>
            <div class="sidebar"></div>
        </div>
    `,
    props: {
        params: {
            products: {
                store: 'products',
            },
        },
        methods: {
            getAll: {
                store: 'products',
            }
        }
    },
    params: {
        categories: [],
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
                        buttons: () => ['To cart'],
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
                            //src: cart,

                            // src: filter,
                            // params: {
                            //     header: 'New Filter'
                            // },
                            // methods: {
                            //     change: () => {},
                            //     priceFilter: (from, to) => {
                            //         this.proxy.products = this.param.products.filter((el) => el.price >= from && el.price <= to);
                            //     }
                            // }
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
                            this.proxy.products = await catalogApi.getProductsByCategory(value);
                            this.proxy.hidden = true;
                            this.proxy.activeCategory = value;
                        }
                    }
                }
            },
            filtersBtn: {
                component: {
                    src: dropdown,
                    proxies: {
                        hidden: () => {},
                    },
                    sections: {
                        content: {
                            src: groupcheckbox,
                            proxies: {
                                texts: ["10-50", "50-100", "all"]
                            }
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
        await this.method.getAll();
        console.log(this.proxy.products);
        this.param.categories = await catalogApi.getAllCategories();
        //await delay(1500);
        this.proxy.hidden = true;
    }
}