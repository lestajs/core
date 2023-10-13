import form from '../../../../UI/components/form'
import block from '../index'
import { deliver } from "lesta"

export default {
  template: `
    <div>
    <div class="elements"></div>
    <div class="children"></div>
    </div>`,
  props: {
    params: {
      target: {},
      path: {},
    },
    methods: {
      create: { store: 'form' },
      execute: { store: 'form' },
    }
  },
  nodes() {
    return {
      elements: {
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
      children: {
        component: {
          src: block,
          iterate: () => this.param.target.children,
          induce: () => {
            if (this.param.target.hidden) {
              const v = this.method.execute({path: this.param.path, direction: this.param.target.hidden})
              console.log(v, this.param.target.hidden)
            }
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
    if (!deliver(this.proxy._values, this.param.path)) {
        const value = {}
        this.param.target.elements?.forEach(el => {
          value[el.name] = el.value ?? el.default ?? null
        })
        this.method.create({ path: this.param.path, value })
    }
  }
}