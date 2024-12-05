import Router from './init'

function createRouter (app, options, propsData = {}) {
    return new Router(app, options, propsData)
}

export { createRouter }