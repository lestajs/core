import accordion from '../../../../../UI/components/accordion';
import checkbox from '../../../../../UI/components/checkbox';

export default {
    template: `<div class="accordion"></div>`,
    props: {
        params: {
            header: {}
        },
        methods: {
            priceFilter: {}
        }
    },
    nodes() {
        return {
            accordion: {
                component: {
                    src: accordion,
                    params: {
                        header: this.param.header,
                    },
                    methods: {
                        change: () => {},
                    },
                    sections: {
                        content: {
                            src: checkbox,
                            proxies: {
                                text: '50 - 100',
                            },
                            methods: {
                                change: () => this.method.priceFilter(50, 100),
                            }
                        }
                    }
                }
            }
        }
    }
}