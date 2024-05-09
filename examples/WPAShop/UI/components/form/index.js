import './index.css'
import element from './element'

export default {
  template: `
      <form class="LstForm">
        <div class="LsrError pn"></div>
        <legend class="LstFormName"></legend>
        <fieldset class="LstElements"></fieldset>
      </form>`,
  props: {
    params: {
      elements: {
        type: 'Array'
      },
      name: {},
      description: {},
      size: {}
    },
    methods: {
      change: {},
      submit: {}
    }
  },
  params: {
    valid: true
  },
  nodes() {
    return {
      LstForm: {
        onsubmit: (event) => event.preventDefault()
      },
      LstFormName: {
        textContent: () => this.param.name
      },
      LstElements: {
        component: {
          src: element,
          iterate: () => this.param.elements || [],
          params: {
            element: ({ index }) => this.param.elements[index],
            size: this.param.size
          },
          methods: {
            change: (v) => {
              if (v.type === 'submit') {
                // for (const el of this.param.elements) {
                //   if (el.validate && !this.method.transit(el.name, 'validate')) {
                //     this.param.valid = false
                //     break
                //   }
                // }
                if (this.param.valid) this.method.submit && this.method.submit()
                this.param.valid = true
              } else this.method.change && this.method.change(v)
            }
          }
        }
      },
      LsrError: {}
    }
  },
  methods: {
    error(v) {
      this.node.LsrError.textContent = v
    },
    visible(n, v) {
      const index = this.param.elements.findIndex(el => el.name === n)
      return this.node.LstElements.children[index]?.method.visible(v)
    },
    transit(n, m, v) {
      const index = this.param.elements.findIndex(el => el.name === n)
      this.node.LstElements.children[index]?.method.transit(m, v)
    }
  }
}