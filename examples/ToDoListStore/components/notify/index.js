import './index.css'

export default {
  template: `
  <div class="notify red">
    <span class="text"></span>
    <span class="close">ok</span>
  </div>`,
  props: {
    params: {
      index: {
        type: 'number',
        required: true
      }
    },
    proxies: {
      notify: {
        validation: (v) => {
          return v.text || 'removed'
        },
        type: 'object',
        required: true,
        // default: ...
        // store: ''
      }
    },
    methods: {
      close: {
        required: true
      }
    }
  },
  nodes() {
    return {
      text: {
        _text: () => this.proxy.notify.text
      },
      close: {
        onclick: () => this.method.close(this.param.index)
      }
    }
  }
}