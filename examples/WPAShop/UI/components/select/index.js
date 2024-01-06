import './index.css'
import input from '../input'
import dropdown from '../dropdown'
import list from '../list'

export default {
  template: `
<div class="LstSelect">
   <div class="LstLabel"></div>
      <div class="LstSelectWr">
        <div class="LstSelectInput"></div>
        <div class="arrow"></div>
      </div>
      <div class="LstSelectOptions"></div>
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
      placeholder: {}
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
            placeholder: this.param.placeholder
          },
          proxies: {
            value: () => this.proxy.value ?? this.param.value ?? ''
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
            hidden: () => this.proxy.hide
          },
          sections: {
            content: {
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
            }
          }
        }
      }
    }
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