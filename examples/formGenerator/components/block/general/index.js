import form from '../../form'
import block from '../index'
import { deliver } from "lesta"

export default {
  template: `
    <div class="fblContent">
    <div class="fblElements"></div>
    <div class="fblChildren"></div>
    </div>`,
  props: {
    params: {
      target: {},
      path: {},
    },
    proxies: {
      _values: { store: 'form' },
    },
    methods: {
      set: { store: 'form' }
    }
  },
  nodes() {
    return {
      fblContent: {
        dataset: () => {
          const index = this.param.path.at(-1)
          return typeof index === 'number' ? { index: index + 1 } : {}
        }
      },
      fblElements: {
        component: {
          induce: () => this.param.target.elements,
          src: form,
          params: {
            elements: this.param.target.elements,
            path: this.param.path,
            error: this.param.target.error || ''
          }
        }
      },
      fblChildren: {
        component: {
          src: block,
          iterate: () => this.param.target.children,
          induce: () => {
            if (this.param.target.hidden) {
              return this.execute({ _values: this.proxy._values, path: this.param.path, direction: this.param.target.hidden})
            }
            return true
          },
          params: {
            target: (child) => child,
            path: this.param.path
          }
        }
      }
    }
  },
  created() {
    if (!deliver(this.proxy._values, this.param.path)) this.method.set({ path: this.param.path, value: {} })
    this.param.target.elements?.forEach(el => {
      const fullPath = [...this.param.path, el.name]
      if (!deliver(this.proxy._values, fullPath)) this.method.set({ path: fullPath, value: el.value ?? el.default ?? null })
    })
  }
}