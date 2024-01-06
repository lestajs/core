import accordion from '../../../../UI/components/accordion/index.js';
import groupcheckbox from './groupcheckbox/index.js';

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
                            src: groupcheckbox,
                            param: {
                                text: '50 - 100',
                            },
                            methods: {
                                priceFilter:  this.method.priceFilter,
                            }
                        }
                    }
                }
            }
        }
    }
}