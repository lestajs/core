import { errorRouter } from '../utils/errors/router.js'

function collectorRoutes(routes, collection, parentPath = '', parentParams = {}, parentExtras = {}) {
  routes.forEach(route => {
    if (!route.hasOwnProperty('path')) return errorRouter(route.name, 557)
    const params = { ...parentParams, ...route.params }
    route.params = params
    const extra = { ...parentExtras, ...route.extra }
    route.extra = extra
    const collectorRoute = (path) => {
      if (!route.children) {
        collection.push({name: route.name, path: path.replace(/\/$/, '') || '/', route })
      } else {
        collectorRoutes(route.children, collection, path, params, extra)
      }
    }
    collectorRoute(parentPath + '/' + route.path.replace(/^\/|\/$/g, ''))
    if (route.alias) {
      const aliasPath = (path) => path.charAt(0) === '/' ? path : parentPath + '/' + path
      if (Array.isArray(route.alias)) {
        for (const path of route.alias) {
          collectorRoute(aliasPath(path))
        }
      } else {
        collectorRoute(aliasPath(route.alias))
      }
    }
  })
}

export default collectorRoutes