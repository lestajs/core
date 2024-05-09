//import input from '../../../../../UI/components/input'
import pickUpCard from './pickUpCard'

export default {
    template:
    `
        <div class="pickUp">
            
        </div>
    `,
    proxies: {
        shops: [
            {name: `Moscow City, 'Astra' mall`, availible: true, distance: 0.5},
            {name: `Street 105. 54, 'Bulanti' shop`, availible: true, distance: 0.7},
            {name: `Street 104. 97, 'Mercury' mall`, availible: false, distance: 1.2},
            {name: `Saint Andrew Street. 32, 'Leaf' mall`, availible: true, distance: 0.4},
        ]
    },
    nodes() {
        return {
            pickUp: {
                component: {
                    src: pickUpCard,
                    iterate: () => this.proxy.shops,
                    proxies: {
                        shop: (v) => v,
                        index: (v, i) => i,
                    }
                }
            }
        }
    }
}