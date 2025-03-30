import { errorRouter } from '../utils/errors/router'
import { deepFreeze } from '../utils'

function collectorRoutes(routes, collection, parent = { path: '' }) {
  routes.forEach(route => {
    if (!route.hasOwnProperty('path')) return errorRouter(route.name, 557)
    route.params = { ...parent.params, ...route.params }
    route.extra = { ...parent.extra, ...deepFreeze(route.extra) }
    route.beforeEnter = route.beforeEnter || parent.beforeEnter
    route.afterEnter = route.afterEnter || parent.afterEnter
    const collectorRoute = (path = '') => {
      if (!route.children) {
        collection.push({name: route.name, path: path.replace(/\/$/, '') || '/', route })
      } else {
        collectorRoutes(route.children, collection, { path, params: route.params, extra: route.extra, beforeEnter: route.beforeEnter, afterEnter: route.afterEnter })
      }
    }
    collectorRoute(parent.path + '/' + route.path.replace(/^\/|\/$/g, ''))
    if (route.alias) {
      const aliasPath = (path) => path.charAt(0) === '/' ? path : parent.path + '/' + path
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