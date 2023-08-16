import { warnRouter } from '../utils/errors/router.js'

function replacement(params, param, key) {
  if (params && params[key]) {
    if (param.regex && !param.regex.test(params[key])) {
      warnRouter(555, key)
      return params[key]
    } else return params[key]
  } else if (param.optional) {
    return ''
  } else {
    warnRouter(554, key)
    return ''
  }
}

function encode(v) {
  return /[<>\/&"'=]/.test(v) ? encodeURIComponent(v) : v
}

export default function link(v, t, l) {
  let res = ''
  if (!v) return '/'
  if (typeof v === 'object') {
    if (v.path) {
      res = v.path
    } else if (v.name) {
      const index = l.findIndex((e)=> e.name === v.name)
      if (index !== -1) {
        res = l[index].path
        const params = l[index].route.params
        for (const key in v.params) {
          if (!params[key]) warnRouter(553, key)
        }
        for (const [ key, param ] of Object.entries(params)) {
          const r = replacement(v.params, param, key)
          res = res.replace('/:' + key, encode(r))
        }
        if (res.slice(-1) === '*') {
          res = res.replace(/\*$/, v.pathMatch || '')
        }
        if (v.query) res += '?' + (new URLSearchParams(v.query)).toString()
      } else warnRouter(551, v.name)
    } else {
      const url = new URL(t.fullPath)
      if (v.params) {
        if (!Object.keys(t.params).length) warnRouter(552)
        res = t.route.path
        for (const key in t.params) {
          const param = v.params[key] || t.params[key]
          if (param) {
            const r = replacement(v.params, param, key)
            res = res.replace('/:' + key, encode(r))
          } else warnRouter(553, key)
        }
        if (res.slice(-1) === '*') {
          res = res.replace(/\*$/, v.pathMatch || t.pathMatch)
        }
      } else res = url.pathname
      if (v.query) {
        for (const key in v.query) {
          v.query[key] === '' ? url.searchParams.delete(key) : url.searchParams.set(encode(key), encode(v.query[key]))
        }
        res += url.search
      }
      if (v.hash) {
        if (typeof v.hash === 'string') url.hash = v.hash
        res += url.hash
      }
    }
  } else res = v
  res = res.replace(/\/$/, '').replace(/^([^/])/, '/$1')
  return res || '/'
}