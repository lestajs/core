import { deleteReactive } from '../utils'
import { errorComponent } from '../utils/errors/component'

export default {
    async iterative(options) {
        if (typeof options.iterate !== 'function') return errorComponent(this.nodeElement.nodepath, 205)
        this.name = null
        this.nodeElement.children = []
        this.nodeElement.target.innerHTML = ''
        this.nodeOptions.component = options
        this.nodeElement.clear = () => this.length.bind(this)(0)
        this.createIterate = async (index) => {
            this.nodeElement.children[index] = this.nodeElement._current = { parent: this.nodeElement, target: true, nodepath: this.nodeElement.nodepath + '.' + index, index, isIterable: true }
            await this.create(this.proxiesIterate.bind(this), this.nodeElement.children[index], options, this.data[index], index)
        }
        this.impress.collect = true
        this.data = options.iterate()
        if (this.data) {
            if (!Array.isArray(this.data)) return errorComponent(this.nodeElement.nodepath, 206)
            this.name = this.impress.refs.at(-1)
            this.impress.clear()
            this.nodeElement.isIterative = true // !
            if (Object.getPrototypeOf(this.data).instance === 'Proxy') {
                this.reactiveComponent([this.name], (v) => {
                    this.data = options.iterate()
                        if (options.proxies) {
                            for (const [pr, fn] of Object.entries(options.proxies)) {
                                if (typeof fn === 'function' && fn.name) {
                                    for (let i = 0; i < Math.min(this.nodeElement.target.children.length, v.length); i++) {
                                        this.nodeElement.children[i]?.proxy?.[pr]?.setValue(fn(this.nodeElement.children[i])) // - this.data[i], i
                                    }
                                }
                            }
                        }
                    this.length(v.length)
                })
                this.reactiveComponent([this.name + '.length'], (v) => this.length(v))
            }
            const mount = async () => {
                this.data = options.iterate()
                this.length(this.data.length)
            }
    
            const induced = this.induced(async (permit) => permit ? await mount(): this.nodeElement._clear())
            if (induced) await mount()
        }
    },
    proxiesIterate(proxies, index) {
        const nodeElement = this.nodeElement.children[index]
        const reactive = (pr, fn) => {
            if (this.impress.refs.some(ref => ref.includes(this.name))) {
                this.reactiveComponent(this.impress.define(pr), (v, p) => {
                    if (!nodeElement.proxy) return
                    if (p) {
                        nodeElement.proxy[pr]?.setValue(v, p)
                    } else {
                        this.data = this.nodeOptions.component.iterate() // ??
                        nodeElement.proxy[pr]?.setValue(fn(nodeElement))
                    }
                })
            } else {
                if (!this.nodeElement.created) {
                    this.reactiveComponent(this.impress.define(pr), (v, p) => {
                        for (let i = 0; i < this.nodeElement.children.length; i++) {
                            const nodeChildren = this.nodeElement.children[i]
                            p ? nodeChildren.proxy?.[pr]?.setValue(v, p) : nodeChildren.proxy?.[pr]?.setValue(fn(nodeChildren))
                        }
                    })
                } else this.impress.clear()
            }
        }
        return this.reactivate(proxies, reactive, nodeElement)
    },
    length(length) {
        const qty = this.nodeElement.target.children.length
        if (length > qty) this.add(length, qty)
        if (length < qty) this.remove(length, qty)
    },
    add(length, qty) { // ! - length
        while (length > qty) {
            this.createIterate(qty)
            qty++
        }
    },
    remove(length, qty) {
        while (length < qty) {
            qty--
            deleteReactive(this.nodeElement.reactivity.component, this.name + "." + qty)
            this.nodeElement.children[qty].unmount?.() // !
            this.nodeElement.children[qty].target.remove() // !
            this.nodeElement.children.splice(qty, 1)
        }
    }
}