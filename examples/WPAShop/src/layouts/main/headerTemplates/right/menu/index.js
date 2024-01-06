import button from '../../../../../../UI/components/button';

export default {
    template: `<div><a class="li" link></a></div>`,
    props: {
        params: {
            text: {},
            url: {}
        }
    },
    nodes() {
        return {
            li: {
                href: this.param.url,
                textContent: this.param.text
            }
        }
    }
}