import { replicate } from '../../utils/index.js'

export default function diveProxy(_value, handler, path = '') {
  if (!(_value && (_value.constructor.name === 'Object' || _value.constructor.name === 'Array'))) {
    return _value
  }
  const proxyHandler = {
    getPrototypeOf(target) {
      return {target, instance: 'Proxy'}
    },
    get(target, prop, receiver) {
      if (typeof prop === 'symbol') return Reflect.get(target, prop, receiver)
      handler.get?.(target, prop, `${path}${prop}`)
      return Reflect.get(target, prop, receiver)
    },
    set(target, prop, value, receiver) {
      if (typeof prop === 'symbol') return Reflect.set(target, prop, value, receiver)
      let upd = false
      const reject = handler.beforeSet(value, `${path}${prop}`, (v) => {
        value = v
        upd = true
      })
      if (reject || !(Reflect.get(target, prop, receiver) !== value || prop === 'length' || upd)) return true
      value = diveProxy(value, handler, `${path}${prop}.`)
      Reflect.set(target, prop, value, receiver)
      handler.set(target, value, `${path}${prop}`)
      return true
    },
    deleteProperty(target, prop) {
      return Reflect.deleteProperty(target, prop)
    },
    defineProperty(target, prop, descriptor) {
      return Reflect.defineProperty(target, prop, descriptor)
    }
  }
  _value = replicate(_value)
  for (let key in _value) {
    _value[key] = diveProxy(_value[key], handler, `${path}${key}.`)
  }
  return new Proxy(_value, proxyHandler)
}