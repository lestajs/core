import './index.css'

export default {
  template: `
    <div class="l-input">
        <div class="label"></div>
        <div class="field" contenteditable="true"></div>
    </div>`,
  props: {
    proxies: {
      hide: {},
      value: {
        default: ''
      }
    },
    params: {
      name: {},
      label: {},
      wrap: {
        default: false
      }
    },
    methods: {
      action: {}
    }
  },
  handlers: {
    value() {
      const el = this.node.field
      if (typeof window.getSelection != "undefined"
        && typeof document.createRange != "undefined") {
        const range = document.createRange()
        range.selectNodeContents(el)
        range.collapse(false)
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
      } else if (typeof document.body.createTextRange != "undefined") {
        const textRange = document.body.createTextRange()
        textRange.moveToElementText(el)
        textRange.collapse(false)
        textRange.select()
      }
    }
  },
  nodes() {
    return {
      LstTextarea: {
        _class: {
          hide: () => this.proxy.hide,
          error: () => this.proxy.value === ''
        },
        onclick: () => {
          this.node.field.focus()
        }
      },
      label: {
        textContent: () => this.param.label
      },
      field: {
        _class: {
          wrap: this.param.wrap
        },
        textContent: () => this.proxy.value,
        oninput: (event) => {
          const keycode = event.charCode || event.keyCode
          if (keycode === 13) event.preventDefault()
          const value = event.target.textContent
          this.method.action && this.method.action(this.param.name, value)
          this.proxy.value = value
        }
      }
    }
  },
  methods: {
    clear() {
      this.proxy.value = ''
    }
  }
}