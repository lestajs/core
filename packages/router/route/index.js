import { errorRouter } from '../../utils/errors/router'

export default {
  init(collection, url) {
    this.url = url
    this.result = {
      path: null,
      map: null,
      to: null
    }
    return this.routeEach(collection)
  },
  picker(target) {
    if (target) {
      const params = {}
      const slugs = this.result.path.match(/:\w+/g)
      slugs && slugs.forEach((slug, index) => {
        params[slug.substring(1)] = this.result.map[index + 1]
      })
      const to = {
        path: this.result.map.at(0) || '/',
        params: Object.keys(params).length ? params : undefined,
        fullPath: this.url.href,
        hash: this.url.hash,
        query: this.url.search ? Object.fromEntries(new URLSearchParams(this.url.search)) : undefined,
        name: target.name,
        extra: target.extra,
        route: {}
      }
      if (target.path.slice(-1) === '*') to.pathMatch = this.result.map.at(-1)
      for (const key in target) {
        if (target[key]) {
          to.route[key] = target[key]
        }
      }
      to.route.path = this.result.path
      return to
    }
  },
  mapping(path) {
    const value = path.replace(/:\w+/g, '(\\w+)').replace(/\*$/, '(.*)')
    const regex = new RegExp(`^${value}$`)
    const url = decodeURI(this.url.pathname).toString().replace(/\/$/, '') || '/'
    return url.match(regex)
  },
  find(target, path) {
    this.result.path = path
    this.result.map = this.mapping(this.result.path)
    let index = 1
    for (const key in target.route.params) {
      let fl = false
      let param = target.route.params[key]
      if (!this.result.map && param.optional) {
        const p = this.result.path.replace('/:' + key, '').replace(/\/$/, '')
        this.result.map = this.mapping(p)
        fl = true
      }
      if (this.result.map && param.regex) {
        const value = this.result.map[index]
        if (!param.regex.test(value)) {
          if (!fl) this.result.map = null
        }
      }
      if (this.result.map && param.enum) {
        const value = this.result.map[index]
        if (!param.enum.includes(value)) {
          if (!fl) this.result.map = null
        }
      }
      if (!fl) index++
    }
  },
  routeEach(collection) {
    let buf = {}
    for (const target of collection) {
      if (!target.path) errorRouter(target.name, 501)
      this.find(target, target.path)
      if (this.result.map) {
        this.result.to = this.picker(target.route)
        buf = { ...this.result }
      }
    }
    if (!this.result.map && buf) this.result = buf
    return this.result.to
  }
}