import { loadModule } from '../utils/index.js'
import { getStaticFile, generateStaticPage, saveStaticPage } from './generateStaticPage.js'
import renderComponent from './renderComponent.js'

class Render {
  constructor(entry) {
    entry.plugins = typeof entry.plugins === 'object' ? entry.plugins: {}
    entry.origin = entry.origin?.replace(/\/$/, '')
    this.app = {
      ...entry,
      ssg: this.ssg.bind(this),
      ssr: this.ssr.bind(this)
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
  async ssr(path, next) {
    this.app.plugins.router.render = async (to) => {
      let html = ''
      switch (to.route.type) {
        case 'dynamic':
          html = await getStaticFile(this.app.source)
          console.log(html)
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
      await next(html, to)
    }
    await this.app.plugins.router.push(path)
  }
  async ssg() {
    this.app.plugins.router.render = this.renderPage.bind(this)
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
    const options = await loadModule(to.route.component)
    let pageHtml = await renderComponent(this.app, options)
    if (to.route.layout) {
      const layout = await loadModule(this.app.plugins.router.layouts[to.route.layout])
      const layoutHtml = await renderComponent(this.app, layout)
      pageHtml = layoutHtml.replace('<!--section:router-->', pageHtml)
    }
    return await generateStaticPage(this.app, to, pageHtml)
  }
}

function createServerRender(options) {
  const render = new Render(options)
  return render.app
}
export { createServerRender, getStaticFile }