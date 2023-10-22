import './index.css'
import element from './element'

export default {
  template: `
    <div class="lstForm">
      <div class="lstFormErr"></div>
      <div class="lstEls l-fx l-gap"></div>
    </div>`,
  props: {
    params: {
      elements: {
        type: 'Array'
      },
      path: {},
      error: {
        default: ''
      },
    },
    methods: {
      error: { store: 'form' },
    }
  },
  params: {
    errors: []
  },
  proxies: {
    error: ''
  },
  nodes() {
    return {
      lstForm: {
        _class: {
          brError: () => this.proxy.error
        }
      },
      lstEls: {
        component: {
          src: element,
          iterate: () => this.param.elements,
          params: {
            element: (el) => el,
            path: this.param.path,
            size: 'mini'
          },
          methods: {
            error: (key, v) => {
              this.param.errors[key] = v
              const value = Object.values(this.param.errors).includes(true)
              this.proxy.error = value ? this.param.error : ''
              this.method.error({ key: this.param.path.join('_'), value })
            }
          }
        }
      },
      lstFormErr: {
        textContent: () => this.proxy.error
      }
    }
  },
  methods: {
    transit(n, m, v) {
      const index = this.param.elements.findIndex(el => el.name === n)
      this.node.lstEls.children[index]?.method.transit(m, v)
    }
  }
}