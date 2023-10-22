import { replicate } from '../../utils/index.js'

export default function diveProxy(target, handler, path = '') {
  if (typeof target !== 'object' || target === null) {
    return target
  }
  const proxyHandler = {
    getPrototypeOf(target) {
      return {target, instance: 'Proxy'}
    },
    get(target, prop, receiver) {
      handler.get?.(target, `${path}${prop}`)
      return Reflect.get(target, prop, receiver)
    },
    set(target, prop, value, receiver) {
      const reject = handler.beforeSet(value, `${path}${prop}`, (v) => value = v)
      if (reject) return true
      if (Reflect.get(target, prop, receiver) !== value || prop === 'length' || prop.startsWith('__')) {
        value = replicate(value)
        value = diveProxy(value, handler, `${path}${prop}.`)
        Reflect.set(target, prop, value, receiver);
        handler.set(target, value, `${path}${prop}`)
      }
      return true
    },
    deleteProperty(target, prop) {
      return Reflect.deleteProperty(target, prop)
    },
    defineProperty(target, prop, descriptor) {
      return Reflect.defineProperty(target, prop, descriptor)
    }
  }
  for (let key in target) {
    target[key] = diveProxy(target[key], handler, `${path}${key}.`)
  }
  return new Proxy(target, proxyHandler)
}