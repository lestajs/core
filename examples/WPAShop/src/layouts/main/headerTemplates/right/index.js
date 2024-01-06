import menu from './menu'

export default {
    template: `
        <div class="menu fx gap"></div>
    `,
    params: {
        lis: [{text: 'Catalog', url: '/catalog'}, {text: 'About us', url: '/about'}, {text: 'Cart', url: '/cart'}, {text: 'Account', url: '/account'},]
    },
    nodes() {
        return {
            menu: {
                component: {
                    src: menu,
                    iterate: () => this.param.lis,
                    params: {
                        text: (li) => li.text,
                        url: (li) => li.url,
                    }
                }
            }
        }
    }
}