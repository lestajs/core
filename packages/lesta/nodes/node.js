export default class Node {
    constructor(node, context, nodeElement, impress, app, keyNode) {
        this.app = app
        this.node = node
        this.context = context
        this.impress = impress
        this.nodeElement = nodeElement
        this.keyNode = keyNode
        this.nodeElement.reactivity = { node: new Map() }
    }
    reactive(refs, active, reactivity) {
        if (refs.length) reactivity.set(active, refs)
        this.impress.clear()
    }
    reactiveNode(refs, active) {
        this.reactive(refs, active, this.nodeElement.reactivity.node)
    }
}