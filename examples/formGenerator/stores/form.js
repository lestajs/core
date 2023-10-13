import spec from '../spec'
import { deliver } from 'lesta'

export default {
  params: {
    spec: spec
  },
  proxies: {
    _values: {},
  },
  methods: {
    set({ path, value }) {
      deliver(this.proxy._values, path, value)
    },
    add({ path, value }) {
      const length = deliver(this.proxy._values, path)?.length || 0
      deliver(this.proxy._values, [...path, length], value)
      deliver(this.proxy._values, [...path, 'length'], length + 1)
    },
    create({ path, value }) {
      deliver(this.proxy._values, path, value)
    },
    execute({ path, value, direction }) {
      const command = 'return ' + direction
      const pathClone = [...path]
      let index = undefined
      let length = undefined
      if (typeof pathClone.at(-1) === 'number') {
        index = pathClone.pop()
        pathClone.push('length')
        length = deliver(this.proxy._values, pathClone)
      }
      const fn = new Function('_values', 'value', 'index', 'length', command)
      console.log(value, index, length)
      return fn(this.proxy._values, value, index, length)
    },
    test() {
      // console.log(this.proxy._values)
    }
  }
}