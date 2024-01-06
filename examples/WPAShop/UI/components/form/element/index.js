// import './index.css'

export default {
  template: `
    <div>
      <div class="LstElement"></div>
    </div>`,
  sources: {
    input: () => import('../../input'),
    select: () => import('../../select'),
    button: () => import('../../button')
  },
  props: {
    params: {
      element: {},
      size: {}
    },
    methods: {
      change: {},
    }
  },
  proxies: {
    visible: false
  },
  nodes() {
    return {
      LstElement: {
        _classes: {
          hide: () => this.proxy.visible
        },
        component: {
          src: this.source[this.param.element.component],
          // proxies: {
          //   required: () => this.param.element.required && this.proxy.visible
          // },
          params: {
            label: this.param.element.label,
            name: this.param.element.name,
            text: this.param.element.text,
            type: this.param.element.type,
            size: this.param.size,
            validate: this.param.element.validate,
            options: this.param.element.options,
            value: this.param.element.value,
          },
          methods: {
            change: this.method.change
          }
        }
      }
    }
  },
  methods: {
    visible(v) {
        this.proxy.visible = v
    },
    transit(m, v) {
      this.node.LstElement.method[m] && this.node.LstElement.method[m](v)
    }
  },
  mounted() {
    this.proxy.visible = this.param.element.hidden
  }
}