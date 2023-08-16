import './index.css'
import { _attr } from '../directives'

export default {
  template: `
  <label class="LstCheckbox">
    <input type="checkbox" class="LstCheckboxInp">
    <span class="LstCheckmark"></span>
    <span class="LstCheckboxText"></span>
  </label>`,
  directives: { _attr },
  props: {
    proxies: {
      text: {},
      checked: {},
      disabled: {}
    },
    params: {
      checked: {},
      name: { default: '' },
      text: {},
      size: { default: '' },
      autofocus: {},
    },
    methods: {
      change: {}
    }
  },
  nodes() {
    return {
      LstCheckbox: {
        _attr: {
          size: this.param.size,
          name: this.param.name,
        }
      },
      LstCheckboxInp: {
        checked: () => this.param.checked || this.proxy.checked,
        onchange: (event) => {
          this.param.checked = event.target.checked
          this.proxy.checked = event.target.checked
          this.method.change && this.method.change(this.param)
        }
      },
      LstCheckboxText: {
        textContent: () => this.param.text || this.proxy.text
      }
    }
  },
  methods: {
    set(v) {
      this.proxy.checked = v
    }
  }
}