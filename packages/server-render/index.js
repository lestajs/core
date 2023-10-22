import { getStaticFile, generateStaticPage, saveStaticPage } from './generateStaticPage.js'
import renderComponent from './renderComponent.js'
import plugins from '../lesta/create/plugins.js'
import { RouterBasic } from '../router/init/index.js'

class Render {
  constructor(entry) {
    Object.assign(entry.plugins || {}, plugins)
    entry.origin = entry.origin?.replace(/\/$/, '')
    this.app = {
      ...entry,
      routerPush: this.routerPush.bind(this),
      generateStatics: this.generateStatics.bind(this)
    }
  }
  cartesian(arrays) {
    return arrays.reduce((a, b) => {
      return a.flatMap((x) => {
        return b.map((y) => {
          return x.concat([y])
        })
      })
    }, [[]])
  }
  params(keys, values, path) {
    for (let i = 0; i < keys.length; i++) {
      path = values[i] ? path.replace(':' + keys[i], values[i]) : path.replace('/:' + keys[i], '') || '/'
    }
    return path
  }
  async combinations(arrays, route, path) {
    const keys = Object.keys(route.params)
    const combinations = this.cartesian(arrays)
    for await (const combination of combinations) {
      const v = this.params(keys, combination, path)
      await this.app.plugins.router.push(v)
    }
  }
  async routerPush(path) {
    this.app.plugins.router.render = async (to) => {
      let html = ''
      switch (to.route.type) {
        case 'dynamic':
          html = await getStaticFile(this.app.source)
          break
        case 'static':
          html = await getStaticFile(path)
          if (!html) {
            html = await this.renderPage.bind(this)(to)
            await saveStaticPage(this.app.outDir + to.path, html)
          }
          break
        default:
          html = await this.renderPage.bind(this)(to)
      }
      to.html = html
      return to
    }
    return await this.app.plugins.router.push(path)
  }
  async generateStatics() {
    this.app.plugins.router.render = async (to) => {
      const html = await this.renderPage.bind(this)(to)
      await saveStaticPage(this.app.outDir + to.path, html)
      return to
    }
    for await (const c of this.app.plugins.router.collection) {
      if (c.route.type === 'static') {
        const arrays = []
        for (const param of Object.values(c.route.params)) {
          if (param.enum) arrays.push(param.enum)
        }
        await this.combinations(arrays, c.route, c.path)
      }
    }
  }
  async renderPage(to) {
    let pageHtml = await renderComponent(to.route.component, this.app)
    if (to.route.layout) {
      const layoutHtml = await renderComponent(this.app.plugins.router.layouts[to.route.layout], this.app)
      pageHtml = layoutHtml.replace('<!--router-->', pageHtml)
    }
    return await generateStaticPage(this.app, to, pageHtml)
  }
}

function createRouter(options) {
  const router = new RouterBasic(options)
  return { init: router.initBasic }
}

function createServerApp(options) {
  const render = new Render(options)
  return render.app
}

export { createServerApp, createRouter }