import Components from '../index'
import { deleteReactive, queue } from '../../../../utils'
import { errorComponent } from '../../../../utils/errors/component'

export default class Iterate extends Components {
    constructor(...args) {
        super(...args)
        this.queue = queue()
        this.name = null
        this.created = false
        this.nodeElement.toEmpty = () => this.remove.bind(this)(0)
    }
    async init() {
        if (typeof this.node.component.iterate !== 'function') return errorComponent(this.nodeElement.nodepath, 205)
        this.createIterate = async (index) => {
            if (!this.created) this.nodeElement.style.visibility = 'hidden'
            const proxies = () => this.proxies(this.node.component.proxies, this.nodeElement.children[index], index)
            await this.create(this.proxies.bind(this), this.nodeElement, this.node.component, proxies, this.data[index], index)
            if (!this.created) {
                if (this.nodeElement.children.length > 1) return errorComponent(this.nodeElement.nodepath, 210)
                this.nodeElement.style.removeProperty('visibility')
            }
            this.created = true
        }
        this.impress.collect = true
        this.data = this.node.component.iterate()
        if (this.data) {
            if (!Array.isArray(this.data)) return errorComponent(this.nodeElement.nodepath, 206)
            this.name = this.impress.refs.at(-1)
            this.impress.clear()
            this.nodeElement.setAttribute('iterate', '')
            if (Object.getPrototypeOf(this.data).instance === 'Proxy') {
                this.reactiveComponent([this.name], (v) => {
                    this.data = this.node.component.iterate()
                    if (v.length) this.queue.add(() => {
                        if (this.node.component.proxies) {
                            for (const [pr, fn] of Object.entries(this.node.component.proxies)) {
                                if (typeof fn === 'function' && fn.name) {
                                    if (fn.length) {
                                        for (let i = 0; i < Math.min(this.nodeElement.children.length, v.length); i++) {
                                            const v = fn(this.data[i], i)
                                            this.nodeElement.children[i].proxy[pr]?.setValue(v)
                                            this.sections(this.node.component.sections, this.nodeElement.children[i], i)
                                        }
                                    }
                                }
                            }
                        }
                    })
                    this.queue.add(async () => await this.length(v.length))
                })
                this.reactiveComponent([this.name + '.length'], (v) => {
                    this.queue.add(async () => await this.length(v))
                })
            }
            const mount = async () => await this.add(this.data.length)
            this.nodeElement.induce = async (permit) => !permit ? this.nodeElement.toEmpty() : await mount()
            if (this.node.component.induce) {
                if (typeof this.node.component.induce !== 'function') return errorComponent(this.nodeElement.nodepath, 212)
                this.impress.collect = true
                const permit = this.node.component.induce()
                this.reactiveNode(this.impress.define(), async () => await this.nodeElement.induce(this.node.component.induce()))
                if (permit) await mount()
            } else {
                await mount()
            }
        }
    }
    sections(sections, target, index) {
        if (sections) {
            for (const [section, options] of Object.entries(sections)) {
                for (const [p, f] of Object.entries(options.proxies)) {
                    if (typeof f === 'function' && f.name) {
                        if (f.length) {
                            target.section[section]?.proxy[p]?.setValue(f(this.data[index], index))
                            this.sections(options.sections, target.section[section], index)
                        }
                    }
                }
            }
        }
    }
    proxies(proxies, target, index) {
        const reactive = (pr, fn) => {
            if (this.impress.refs.some(ref => ref.includes(this.name))) {
                this.reactiveComponent(this.impress.define(pr), (v, p) => {
                    this.queue.add(async () => {
                        if (p) {
                            this.nodeElement.children[index]?.proxy[pr]?.setValue(v, p)
                            // this.sections(this.node.component.sections, this.nodeElement.children[index], index)
                        } else {
                            this.data = this.node.component.iterate()
                            if (index < this.data.length) {
                                const val = fn(this.data[index], index)
                                this.nodeElement.children[index]?.proxy[pr]?.setValue(val)
                                // this.sections(this.node.component.sections, this.nodeElement.children[index], index)
                            }
                        }
                    })
                }, target)
            } else {
                if (!this.created) {
                    this.reactiveComponent(this.impress.define(pr), (v, p) => {
                        !this.nodeElement.process && this.queue.add(() => {
                            for (let i = 0; i < this.nodeElement.children.length; i++) {
                                p ? this.nodeElement.children[i].proxy[pr]?.setValue(v, p) : this.nodeElement.children[i].proxy[pr]?.setValue(fn(this.data[i], i))
                                // this.sections(this.node.component.sections, this.nodeElement.children[i], i)
                            }
                        })
                    }, target)
                } else this.impress.clear()
            }
        }
        return this.reactivate(proxies, reactive, this.data, index)
    }
    async length(length) {
        this.data = this.node.component.iterate()
        if (this.data.length === length) {
            const qty = this.nodeElement.children.length
            length > qty && await this.add(length)
            length < qty && await this.remove(length)
        }
    }
    async add(length) {
        let qty = this.nodeElement.children.length
        while (length > qty) {
            await this.createIterate(qty)
            qty++
        }
    }
    remove(length) {
        let qty = this.nodeElement.children.length
        while (length < qty) {
            qty--
            deleteReactive(this.nodeElement.reactivity.component, this.name + '.' + qty)
            this.nodeElement.children[qty].unmount()
        }
    }
}