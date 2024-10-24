import { deleteReactive } from '../utils'
import { errorComponent } from '../utils/errors/component'

export default {
    async iterative(options) {
        if (typeof options.iterate !== 'function') return errorComponent(this.nodeElement.nodepath, 205)
        if (this.nodeElement.replaced) return errorComponent(this.nodeElement.nodepath, 204)
        this.name = null
        this.repeat = 0
        this.nodeElement.children = []
        this.nodeOptions.component = options
        this.nodeElement.clear = () => this.length.bind(this)(0)
        this.createIterate = async (index) => {
            this.nodeElement.children[index] = this.nodeElement._current = { parent: this.nodeElement, target: true, nodepath: this.nodeElement.nodepath + '.' + index, index, iterated: true }
            await this.create(this.proxiesIterate.bind(this), this.nodeElement._current, options)
        }
        this.impress.collect = true
        this.data = options.iterate()
        if (this.data) {
            if (!Array.isArray(this.data)) return errorComponent(this.nodeElement.nodepath, 205)
            this.name = this.impress.refs.at(-1)
            this.impress.clear()
            if (Object.getPrototypeOf(this.data).instance === 'Proxy') {
                this.reactiveComponent([this.name], (v) => this.length(v.length))
                this.reactiveComponent([this.name + '.length'], (v) => this.length(v))
            }
            const mount = async () => {
                this.data = options.iterate()
                await this.length(this.data.length)
            }

            const induced = this.induced(async (permit) => permit ? await mount() : this.nodeElement.clear())
            if (induced) await mount()
        }
    },
    proxiesIterate(proxies) {
        const nodeElement = this.nodeElement._current
        const reactive = (pr, fn) => {
            
            if (this.impress.refs.some(ref => ref.includes(this.name))) {
                this.reactiveComponent(this.impress.define(pr), (v, p) => {
                    const setValue = (...arg) => nodeElement.proxy?.[pr]?.setValue(...arg)
                    p ? setValue(v, p) : setValue(fn(nodeElement))
                })
            } else {
                if (!this.nodeElement.created) {
                    this.reactiveComponent(this.impress.define(pr), (v, p) => {
                        const children = this.nodeElement.children
                        const f = (i) => {
                            const nodeChildren = children[i]
                            const setValue = (...arg) => nodeChildren.proxy?.[pr]?.setValue(...arg)
                            p ? setValue(v, p) : setValue(fn(nodeChildren))
                        }
                        this.portions(children.length, 0, f)
                        this.repeat++
                    })
                } else this.impress.clear()
            }
        }
        return this.reactivate(proxies, reactive, nodeElement)
    },
    async portions(length, index, fn) {
        if (!length) return
        let { portion } = this.nodeOptions.component
        let r = null
        let f = false
        if (index < length - portion) {
            const next = () => {
                if (this.repeat > 1) return this.repeat--
                this.portions(length, index, fn)
            }
            setTimeout(() => f ? next() : new Promise(resolve => r = resolve).then(_ => next()))
        }
        do {
            await fn(index)
            index++
            if (r) portion = 1
            if (index >= length) {
                this.repeat = 0
                break
            }
        } while (index % portion !== 0)
        f = true
        r?.()
    },
    async length(length) {
        this.repeat++
        let qty = this.nodeElement.children.length // ? target
        if (length > qty) await this.portions(length, qty, async (index) => await this.createIterate(index))
        if (length < qty) {
            while (length < qty) {
                qty--
                const children = this.nodeElement.children
                deleteReactive(this.nodeElement.reactivity.component, this.name + '.' + qty)
                children[qty].unmount?.()
                children[qty].target.remove?.()
                children.splice(qty, 1)
            }
        }
    }
}