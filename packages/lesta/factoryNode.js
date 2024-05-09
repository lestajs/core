import directives from './directiveProperties'
import native from './DOMProperties'
import Node from './node'

export default function (...args) {
    Object.assign(Node.prototype, native, directives)
    return new Node(...args)
}