import button from '../../../../../../UI/components/button';

export default {
    template: `<a class="li" link></a>`,
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
                _html: this.param.text,
            }
        }
    }
}