import './index.css'

export default {
  template: `
  <div class="LstNotify">
    <span class="text"></span>
    <span class="LstClose"></span>
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
        type: 'string',
        required: true
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
        textContent: () => this.proxy.notify
      },
      LstClose: {
        onclick: () => this.method.close(this.param.index)
      }
    }
  }
}