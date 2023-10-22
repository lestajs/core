import { Router } from './init'

function createRouter(options) {
    const router = new Router(options)
    return { init } = router
}

export { createRouter }