import { errorNode } from '../utils/errors/node'

export default  {
    directives(key) {
        const n = this.nodeElement
        if (!key.startsWith('_')) return errorNode(n.nodepath, 102, key)
        const directive = this.context.directives[key]
        const options = this.nodeOptions[key]
        const { create, update, destroy } = directive
        Object.assign(n.directives, { [key]: {
            create: () => create ? create.bind(directive)(n, options) : {},
            destroy: () => destroy ? destroy.bind(directive)(n, options) : {}
        }})
        create && n.directives[key].create()
        
        const handle = (v, k, o) => {
            const active = (value) =>  update.bind(directive)(n, value, k, o)
            if (typeof v === 'function') {
                this.impress.collect = true
                active(v(n, o))
                this.reactiveNode(this.impress.define(), () => active(v(n, o)))
            } else active(v)
        }
        if (update) {
            if (typeof options === 'object') {
                for (const k in options) handle(options[k], k, options)
            } else handle(options)
        }
    }
}