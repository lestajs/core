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
      size: { default: 'small' },
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
          size: this.param.size
        }
      },
      LstCheckboxInp: {
        checked: () => this.proxy.checked,
        onchange: (event) => {
          this.proxy.checked = event.target.checked
          this.method.change && this.method.change(event.target.checked)
        }
      },
      LstCheckboxText: {
        textContent: () => this.proxy.text ?? ''
      }
    }
  },
  methods: {
    set(v) {
      this.proxy.checked = v
    }
  }
}