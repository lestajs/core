import { createWidget } from '../lesta/scripts/lesta'
const root = document.querySelector('#root')
const widget = createWidget({
    template: `
    <button class="prev">-</button>
    <span class="result"></span>
    <button class="next">+</button>`,
    proxies: {
        count: 0
    },
    nodes() {
        return {
            result: {
                textContent: () => this.proxy.count
            },
            prev: {
                onclick: () => this.proxy.count--,
                disabled: () => this.proxy.count === 0
            },
            next: {
                onclick: () => this.proxy.count++,
                disabled: () => this.proxy.count === 5
            }
        }
    }
}, root)

// widget.unmount()
