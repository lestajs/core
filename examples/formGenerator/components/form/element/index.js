import { deliver } from 'lesta'

export default {
  template: `
    <div>
      <div class="lstEl"></div>
    </div>`,
  props: {
    params: {
      element: {},
      size: {},
      path: {},
    },
    proxies: {
      _values: { store: 'form' },
    },
    methods: {
      set: { store: 'form' },
      add: { store: 'form' },
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
  nodes() {
    return {
      lstEl: {
        hidden: () => this.proxy.hidden,
        _class: {
          'l-row': this.param.element.row
        },
        component: {
          src: this.elements[this.param.element.component],
          proxies: {
            value: () => {
              const binding = this.param.element.binding
              let v = deliver(this.proxy._values, this.param.fullPath)
              if (binding && !this.param.changed) {
                v = this.execute({ _values: this.proxy._values, path: this.param.path, value: v, direction: binding })
                this.method.set({path: this.param.fullPath, value: v})
              }
              this.param.changed = false
              return v
            },
            disabled: () => this.param.element.disabled,
            error: () => {
              const { validation, required } = this.param.element
              const value = deliver(this.proxy._values, this.param.fullPath)
              const ex = validation && !this.execute({ _values: this.proxy._values, path: this.param.path, value, direction: validation })
              const v = ex || (required && (!value || (Array.isArray(value) && !value.length)))
              this.method.error(this.param.element.name, v)
              return v
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
      this.node.lstEl.method[m] && this.node.lstEl.method[m](v)
    }
  },
  created() {
    this.proxy.hidden = this.param.element.hidden
    this.param.fullPath = [...this.param.path, this.param.element.name]
  }
}