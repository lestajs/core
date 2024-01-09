import { Router } from './init'

function createRouter(options) {
    const router = new Router(options)
    return {
        init: router.init.bind(router),
        link: router.link.bind(router),
        push: router.push.bind(router)
    }
}

export { createRouter }