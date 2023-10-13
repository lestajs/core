import { deliver } from 'lesta'

export default {
  template: `
    <div>
      <div class="LstElement"></div>
    </div>`,
  sources: {
    input: () => import('../../input'),
    select: () => import('../../select'),
    button: () => import('../../button'),
    buttons: () => import('../../buttons')
  },
  props: {
    params: {
      element: {},
      size: {},
      path: {},
      spec: { store: 'form' }
    },
    proxies: {
      _values: { store: 'form' },
    },
    methods: {
      set: { store: 'form' },
      execute: { store: 'form' },
      error: {}
    }
  },
  proxies: {
    hidden: false
  },
  params: {
    fullPath: [],
    changed: false
  },
  setters: {},
  nodes() {
    return {
      LstElement: {
        hidden: () => this.proxy.hidden,
        _class: {
          row: this.param.element.row
        },
        component: {
          src: this.source[this.param.element.component],
          proxies: {
            value: () => {
              console.log(this.param.fullPath)
              const binding = this.param.element.binding
              let v = deliver(this.proxy._values, this.param.fullPath)
              if (binding && !this.param.changed) {
                v = this.method.execute({ path: this.param.path, value: v, direction: binding })
                this.method.set({path: this.param.fullPath, value: v})
              }
              this.param.changed = false
              return v
            },
            disabled: () => this.param.element.disabled,
            error: () => {
              const validation = this.param.element.validation
              if (validation) {
                let v = deliver(this.proxy._values, this.param.fullPath)
                v = this.method.execute({ path: this.param.path, value: v, direction: validation })
                this.method.error(this.param.element.name, !v)
                return !v
              }
            }
          },
          params: {
            size: this.param.size,
            name: this.param.element.name,
            type: this.param.element.type,
            text: this.param.element.text,
            options: this.param.element
          },
          methods: {
            change: (v) => {
              this.param.changed = true
              this.method.set({path: this.param.fullPath, value: this.param.element.type === 'number' ? Number(v) : v})
            },
            validated: (m) => this.method.error(m)
          }
        }
      }
    }
  },
  methods: {
    hidden(v) {
      this.proxy.hidden = v
    },
    transit(m, v) {
      this.node.LstElement.method[m] && this.node.LstElement.method[m](v)
    }
  },
  created() {
    this.proxy.hidden = this.param.element.hidden
    this.param.fullPath = [...this.param.path, this.param.element.name]
  }
}