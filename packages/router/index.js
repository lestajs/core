import Router from './init'

export default {
    setup(app, options) {
        new Router(app, options)
    }
}