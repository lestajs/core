import Router from './init'

function createRouter (app, options) {
    return new Router(app, options)
}

export { createRouter }