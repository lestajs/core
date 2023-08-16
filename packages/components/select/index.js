import './index.css'
import input from '../input'
import dropdown from '../dropdown'
import list from '../list'

export default {
  template: `<div class="LstLabel"></div>
             <div class="LstSelect">
                <div class="LstSelectWr">
                  <div class="LstSelectInput"></div>
                  <div class="arrow"></div>
                </div>
                <div class="LstSelectOptions relative"></div>
             </div>`,
  props: {
    proxies: {
      value: {}
    },
    params: {
      value: {},
      options: {},
      label: {},
      name: {},
      size: {},
      autofocus: {},
    },
    methods: {
      change: {}
    }
  },
  proxies: {
    active: false,
    hide: true
  },
  handlers: {
    active(v) {
      this.proxy.hide = !v
    }
  },
  nodes() {
    return {
      LstLabel: {
        textContent: () => this.param.label
      },
      arrow: {
        _class: {
          arrowTop: () => this.proxy.active
        }
      },
      LstSelectInput: {
        component: {
          src: input,
          params: {
            readonly: true,
            size: this.param.size,
          },
          proxies: {
            value: () => this.param.value || this.proxy.value
          },
          methods: {
            onfocus: () => this.proxy.active = true,
            onblur: () => this.proxy.active = false
          }
        }
      },
      LstSelectOptions: {
        component: {
          src: dropdown,
          proxies: {
            hide: () => this.proxy.hide
          },
          sections: {
            content: {}
          }
        }
      }
    }
  },
  mounted() {
    this.node.LstSelectOptions.integrate('content', {
      src: list,
      params: {
        list: this.param.options
      },
      methods: {
        change: (v) => {
          this.proxy.value = v
          this.param.value = v
          this.method.change && this.method.change(this.param)
        }
      }
    })
  },
  methods: {
    set(v) {
      this.proxy.value = v
    },
    blur() {
      this.node.LstSelectInput.method.blur()
    },
    focus() {
      this.node.LstSelectInput.method.focus()
    },
    select() {
      this.node.LstSelectInput.method.select()
    },
    disabled(v) {
      this.node.LstSelectInput.method.disabled(v)
    }
  }
}