import './index.css'
import element from './element'

export default {
  template: `
    <div class="LstForm">
      <div class="LsrFormError"></div>
      <div class="LstElements fx gap"></div>
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
      change: {},
      submit: {}
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
      LstForm: {
        _class: {
          brError: () => this.proxy.error
        }
      },
      LstElements: {
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
              this.proxy.error = Object.values(this.param.errors).includes(true) ? this.param.error : ''
            }
          }
        }
      },
      LsrFormError: {
        textContent: () => this.proxy.error
      }
    }
  },
  methods: {
    transit(n, m, v) {
      const index = this.param.elements.findIndex(el => el.name === n)
      this.node.LstElements.children[index]?.method.transit(m, v)
    }
  }
}