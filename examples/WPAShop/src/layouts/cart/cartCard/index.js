import card from '../../../../../UI/components/card';

export default {
    template: `
    <div class="fx">
        <div class="cartCards"></div>
        <div>
            <div class="price"></div>
            <div class="deleteBtn">Удалить</div>
        </div>
    </div>`,
    props: {
        proxies: {
            _product: {}
        },        
    },
    nodes() {
        return {
            cartCards: {
                component: {
                    src: card,
                    proxies: {
                        header: () => this.proxy._product.header,
                        content: () => this.proxy._product.content,
                    }
                }
            }
        }
    }
}