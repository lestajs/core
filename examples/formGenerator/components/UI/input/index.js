import './index.css'
import { debounce } from 'lesta'
import { _attr } from '../directives'

export default {
  template: `
    <div class="lstLbl l-label"></div>
    <div class="lstInputWr">
      <input type="text" class="lstInput l-field l-br">
    </div>`,
  directives: { _attr },
  props: {
    proxies: {
      value: {},
      disabled: {},
      error: {},
    },
    params: {
      type: { default: 'text'},
      name: { default: '' },
      size: { default: 'small' },
      text: {},
      options: { default: {} }
    },
    methods: {
      change: {},
      onfocus: {},
      onblur: {},
      validated: {}
    }
  },
  nodes() {
    return {
      lstLbl: {
        textContent: () => this.param.text
      },
      lstInput: {
        _class: {
          LstInputError: () => this.proxy.error
        },
        _attr: {
          size: this.param.size,
          readonly: this.param.options.readonly,
          required: this.param.options.required,
          minlength: this.param.options.minlength,
          maxlength: this.param.options.maxlength,
          min: this.param.options.min,
          max: this.param.options.max,
          step: this.param.options.step
        },
        type: this.param.type,
        name: this.param.name,
        placeholder: this.param.options.placeholder ?? '',
        value: () => {
          const v = this.param.type === 'number' ? Number(this.proxy.value) : this.proxy.value
          return this.param.options.fixed ? v.toFixed(2) : v
        },
        disabled: () => this.proxy.disabled,
        onfocus: () => this.method.onfocus && this.method.onfocus(this.proxy.value),
        onblur: () => this.method.onblur && this.method.onblur(this.proxy.value),
        oninput: debounce((event) => {
          this.proxy.value = event.target.value
          this.method.change && this.method.change(event.target.value)
        }, 300)
      }
    }
  },
  methods: {
    set(v) {
      this.proxy._value = v
    },
    validated() {
      if (!this.node.lstInput.checkValidity()) this.methods.validated(this.node.lstInput.validationMessage)
    },
    blur() {
      this.node.lstInput.blur()
    },
    focus() {
      this.node.lstInput.focus()
    },
    select() {
      this.node.lstInput.select()
    }
  },
  mounted() {
    this.param.options.width && this.node.lstInput.style.setProperty('--width', this.param.options.width)
  }
}