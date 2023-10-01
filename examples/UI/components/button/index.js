import { _attr } from '../directives'
import './index.css'

export default {
  template: `
  <button class="LstButton fx-b br pn">
    <span class="LstButtonIcon"></span>
    <span class="LstButtonText"></span>
  </button>`,
  directives: { _attr },
  props: {
    proxies: {
      color: {},
      text: {},
      active: {},
      disabled: {},
      hide: {}
    },
    params: {
      name: { default: '' },
      text: {},
      type: { default: '' },
      size: { default: 'small' },
      autofocus: {},
      icon: {
        default: ''
      },
      iconPosition: {}
    },
    methods: {
      change: {}
    }
  },
  nodes() {
    return {
      LstButton: {
        _class: {
          hide: () => this.proxy.hide,
          active: () => this.proxy.active,
          filled: this.param.type && this.param.type !== 'text',
          'fx-rev': this.param.iconPosition
        },
        _attr: {
          size: this.param.size,
        },
        name: this.param.name,
        type: this.param.type,
        onclick: () => this.method.change && this.method.change(this.param)
      },
      LstButtonIcon: {
        _html: () => this.param.icon
      },
      LstButtonText: {
        textContent: () => this.proxy.text ?? this.param.text ?? ''
      }
    }
  }
}