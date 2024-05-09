import './index.pcss'

export default {
    template:
    `
        <div class="pickUpCard l-fx">
            <div>
                <div class="name"></div>
                <div class="status"></div>
            </div>
            <div class="distance"></div>
        </div>
    `,
    props: {
        proxies: {
            shop: {},
            index: {},
            active: {}
        }
    },
    nodes() {
        return {
            name: {
                _text: () => this.proxy.shop.name,
            },
            status: {
                _class: {
                    green: () => this.proxy.shop.availible,
                    red: () => !this.proxy.shop.availible,
                    active: () => this.proxy.shop.active
                },
                _text: () => this.proxy.shop.availible ? 'Availible' : 'Currently unavailible',
            },
            distance: {
                _text: () => this.proxy.shop.distance + ' km',
            }
        }
    }
}