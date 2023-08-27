import { _attr } from '../../directives'

export default {
    template: `
        <button class="lastDots">...</button>
        <button class="lastNum"></button>
        `,
    directives: { _attr },
    props: {
        params: {
            lastNum: {},
            size: {}
        },
        proxies: {
            disabled: {},
            active: {}
        },
        methods: {
            next: {},
            showLast: {},
        }
    },
    nodes() {
        return {
            lastNum: {
                _attr: {
                    size: this.param.size
                },
                _class: {
                    active: () => this.proxy.active
                },
                textContent: () => this.param.lastNum,
                onclick: () => this.method.showLast(),
            },
            lastDots: {
                _attr: {
                    size: this.param.size
                },
                onclick: () => this.method.next(),
                disabled: () => this.proxy.disabled,
            }  
        }
    }
}
