import Node from '../../node.js'
import { errorNode } from '../../../../utils/errors/node'

export default class Directives extends Node {
    constructor(...args) {
        super(...args)
    }
    init(key) {
        if (key[0] !== '_') return errorNode(this.nodeElement.nodepath, 102, key)
        const directive = this.context.directives[key]
        const options = this.node[key]
        const { create, update, destroy } = directive
        if (!('directives' in this.nodeElement)) Object.assign(this.nodeElement, { directives: {} })
        Object.assign(this.nodeElement.directives, { [key]: {
            create: () => create ? create(this.nodeElement, options, directive) : {},
            destroy: () => destroy ? destroy(this.nodeElement, options, directive) : {}
        }})
        create && this.nodeElement.directives[key].create()
        const active = (v, o, k) => {
            if (typeof v === 'function') {
                this.impress.collect = true
                update.bind(directive)(this.nodeElement, o, k)
                this.reactiveNode(this.impress.define(), () => update(this.nodeElement, o, k))
            } else update.bind(directive)(this.nodeElement, o, k)
        }
        if (update != null) {
            if (typeof options === 'object') {
                for (const k in options) active(options[k], options, k)
            } else active(options, options)
        }
    }
}