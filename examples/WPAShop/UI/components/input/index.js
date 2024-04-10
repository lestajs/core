import './index.css'

export default {
  template: `
    <div class="l-fx l-ai-c"><label class="lstLbl l-label"></label><div class="lstInputInfo"></div></div>
    <slot name="username"></slot>
    <div class="lstInputWr">
      <input type="text" class="lstInput l-field l-br">
    </div>`,
  props: {
    proxies: {
      value: { default: '' },
      disabled: {},
      error: {}
    },
    params: {
      type: { default: 'text' },
      name: { default: '' },
      size: { default: 'medium' },
      label: {},
      tooltip: {},
      attributes: {},
      validKeys: {}
    },
    methods: {
      action: {}
    }
  },
  nodes() {
    return {
      lstLbl: {
        _text: () => this.param.label
      },
      lstInput: {
        _class: {
          lstError: () => this.proxy.error
        },
        _attr: {
          size: this.param.size,
          ...this.param.attributes
        },
        type: this.param.type,
        name: this.param.name,
        value: () => this.proxy.value,
        disabled: () => this.proxy.disabled,
        onfocus: (event) => this.method.update('onfocus', event.target.value),
        onblur: (event) => this.method.update('onblur', event.target.value),
        oninput: (event) => this.method.update('oninput', event.target.value),
        onkeypress: (event) => this.param.validKeys && !(new RegExp(this.param.validKeys).test(event.key)) && event.preventDefault()
      }
    }
  },
  methods: {
    update(eventType, value) {
      const validationMessage = this.node.lstInput.validationMessage
      this.method.action?.({ name: this.param.name, value, validationMessage, eventType })
    }
  }
}