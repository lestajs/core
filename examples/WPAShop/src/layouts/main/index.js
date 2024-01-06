import header from '../../../UI/components/header';
import sidebar from '../../../UI/components/sidebar';
import left from './headerTemplates/left';
import right from './headerTemplates/right';

export default {
    template: 
    `
    <div class="header"></div>
    <div class="wrapper fx">
        <div class="content main" router></div>
        <div class="sidebar"></div>
    </div>
    `,
    nodes() {
        return {
            header: {
                component: {
                    src: header,
                    sections: {
                        left: {
                            src:  left,
                        },
                        right: {
                            src: right,
                        }
                    }
                }
            },
            sidebar: {
                component: {
                    src: sidebar,
                    params: {
                        width: '400px',
                    },
                    proxies: {
                        show: false,
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
        }
    },
    mounted() {
        this.router.to.extras.sidebar = this.node.sidebar;
    }
}