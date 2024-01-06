import { _attr } from '../../directives'

export default {
    template: `
        <button class="firstNum"></button>
        <button class="firstDots">...</button>
        `,
    directives: { _attr },
    props: {
        params: {
            firstNum: {},
            size: {}
        },
        proxies: {
            disabled: {},
            active: {}
        },
        methods: {
            prev: {},
            showFirst: {}
        }
    },   
    nodes() {
        return {
            firstNum: {
                _attr: {
                    size: this.param.size
                },
                _class: {
                    active: () => this.proxy.active
                },
                textContent: () => this.param.firstNum,
                onclick: () => this.method.showFirst()
            },
            firstDots: {
                _attr: {
                    size: this.param.size
                },
                onclick: () => this.method.prev(),
                disabled: () => this.proxy.disabled
            }
        }
    }
}
