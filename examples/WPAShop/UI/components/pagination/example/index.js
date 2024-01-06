import pagination from '../index.js'

export default {
    template: `<div class="form"></div>`,
    nodes() {
        return {
            form: {
                component: {
                    src: pagination,
                    params: {
                        total: 113,
                    }
                }
            }
        }
    }
}
