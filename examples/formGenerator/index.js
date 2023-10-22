import './components/UI/general.css'
import './styles.css'
import { createApp, deliver, replicate } from 'lesta'
import main from './components/main'
import entry from './spec'

const fabula = {
    create: async (root, entry) => {
        const app = createApp({
            root: document.querySelector(root),
            stores: {
                form: {
                    params: {
                        entry,
                        errors: {}
                    },
                    proxies: {
                        _values: {},
                        error: true
                    },
                    methods: {
                        get({ path }) {
                            deliver(this.proxy._values, path)
                        },
                        set({ path, value }) {
                            deliver(this.proxy._values, path, value)
                        },
                        add({ path, value }) {
                            const length = deliver(this.proxy._values, path)?.length || 0
                            deliver(this.proxy._values, [...path, length], value)
                            deliver(this.proxy._values, [...path, 'length'], length + 1)
                        },
                        remove({ path }) {
                            const length = deliver(this.proxy._values, path)?.length || 0
                            deliver(this.proxy._values, [...path, 'length'], length - 1)
                        },
                        error({ key, value }) {
                            this.param.errors[key] = value
                            this.proxy.error = Object.values(this.param.errors).includes(true)
                        },
                        submit() {
                            entry.send(replicate(this.proxy._values))
                        }
                    },
                    created() {
                        Object.assign(fabula, this.method)
                    }
                }
            },
            plugins: {
                elements: {
                    input: () => import('./components/UI/input'),
                    button: () => import('./components/UI/button'),
                    buttons: () => import('./components/UI/buttons'),
                    nest: () => import('./components/UI/nest')
                },
                localTokens: entry.localTokens,
                bus: { popup: {} },
                execute({_values, path, value, direction}) {
                    const command = 'return ' + direction
                    const pathClone = [...path]
                    let index = undefined
                    let length = undefined
                    if (typeof pathClone.at(-1) === 'number') {
                        index = pathClone.pop()
                        pathClone.push('length')
                        length = deliver(_values, pathClone)
                    }
                    const currentIndex = {}
                    path.forEach((p, index) => typeof p === 'number' ? currentIndex[path[index - 1]] = p : false)
                    const fn = new Function('_values', 'value', 'index', 'length', 'currentIndex', command)
                    return fn(_values, value, index, length, currentIndex)
                }
            }
        })
        await app.mount(main)
    }
}

fabula.create('#root', entry)
console.log(fabula)