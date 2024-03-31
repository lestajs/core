import Node from '../../node.js'
import { errorNode } from '../../../../utils/errors/node'

export default class Directives extends Node {
    constructor(...args) {
        super(...args)
    }
    init(key) {
        const node = this.nodeElement
        if (!key.startsWith('_')) return errorNode(node.nodepath, 102, key)
        const directive = this.context.directives[key]
        const options = this.node[key]
        const { create, update, destroy } = directive
        if (!node.hasOwnProperty('directives')) Object.assign(node, { directives: {} })
        Object.assign(node.directives, { [key]: {
            create: () => create ? create.bind(directive)(node, options) : {},
            destroy: () => destroy ? destroy.bind(directive)(node, options) : {}
        }})
        create && node.directives[key].create()
        
        const active = (v, k, o) => {
            const upd = () =>  update.bind(directive)(node, typeof v === 'function' ? v(node) : v, k, o)
            this.impress.collect = true
            upd()
            this.reactiveNode(this.impress.define(), upd)
        }
        if (update) {
            if (typeof options === 'object') {
                for (const k in options) active(options[k], k, options)
            } else active(options)
        }
    }
}