import directives from './directiveProperties'
import native from './DOMProperties'
import iterate from './iterativeComponent'
import basic from './basicComponent'
import component from './component'
import Node from './node'

export default function (...args) {
    Object.assign(Node.prototype, native, directives, iterate, basic, component)
    return new Node(...args)
}