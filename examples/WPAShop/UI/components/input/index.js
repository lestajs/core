import './index.css'
import { debounce } from 'lesta'
import { _attr } from '../directives'

export default {
  template: `
    <div class="LstLabel"></div>
    <div class="LstInputWr">
      <input type="text" class="LstInput b0 br pn">
      <div class="LstMessage"></div>
    </div>`,
  directives: { _attr },
  props: {
    proxies: {
      value: {
        default: ''
      },
      message: {}
    },
    params: {
      value: {},
      label: {},
      type: {
        default: 'text'
      },
      size: { default: 'small' },
      validate: {},
      placeholder: {
        default: ''
      },
      readonly: {},
      autocomplete: {},
      autofocus: {},
      maxlength: {},
      minlength: {},
      max: {},
      min: {},
      step: {}
    },
    methods: {
      change: {},
      onfocus: {},
      onblur: {}
    }
  },
  nodes() {
    return {
      LstLabel: {
        textContent: () => this.param.label
      },
      LstMessage: {
        textContent: () => this.proxy.message
      },
      LstInput: {
        _attr: {
          size: this.param.size,
          readonly: this.param.readonly,
          required: this.param.validate?.required,
          minlength: this.param.minlength,
          maxlength: this.param.maxlength,
          min: this.param.min,
          max: this.param.max
        },
        value: () => this.proxy.value ?? this.param.value ?? '',
        type: this.param.type,
        placeholder: this.param.placeholder,
        oninput: debounce((event) => {
          this.param.value = event.target.value
          this.proxy.value = event.target.value
          this.method.change && this.method.change(this.param)
        }),
        onfocus: () => this.method.onfocus && this.method.onfocus(this.proxy.value),
        onblur: () => this.method.onblur && this.method.onblur(this.proxy.value)
      }
    }
  },
  methods: {
    set(v) {
      this.proxy.value = v
    },
    validate() {
      if (!this.node.LstInput.checkValidity()) {
        this.proxy.message = this.node.LstInput.validationMessage
      } else return true

    },
    blur() {
      this.node.LstInput.blur()
    },
    focus() {
      this.node.LstInput.focus()
    },
    select() {
      this.node.LstInput.select()
    },
    disabled(v) {
      this.node.LstInput.disabled = v
    }
  }
}