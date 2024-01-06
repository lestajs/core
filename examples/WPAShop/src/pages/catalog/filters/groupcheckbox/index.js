import checkbox from '../../../../../UI/components/checkbox';

export default {
    template: '<div class="groupcheckbox"></div>',
    props: {
        params: {
            texts: {},
        },
        methods: {
            priceFilter: {}
        }
    },
    nodes() {
        return {
            groupcheckbox: {
                component: {
                    src: checkbox,
                    iterate: () => this.proxy.texts,
                    proxies: {
                        text: (el) => el,
                    },
                    methods: {
                        change: () => this.method.priceFilter(),
                    }      
                }
            }
        }
    }
}