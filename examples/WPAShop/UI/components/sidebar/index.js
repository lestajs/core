import './index.css'

export default {
  template: `
    <div class="lstSidebar">
      <div class="lstBackdrop"></div>
      <div class="lstSidebarWr">
        <div>
          <div section="top"></div>
          <div section="content"></div>
        </div>
        <div section="bottom"></div>
      </div>
    </div>`,
  props: {
    proxies: {
      opened: {
        default: false
      },
      minimize: {
        default: false
      },
      mobile: {
        default: false
      }
    },
    methods: {
      onclose: {}
    }
  },
  nodes() {
    return {
      lstBackdrop: {
        onclick: () => this.method.close(),
      },
      lstSidebar: {
        _class: {
          'l-mini': () => this.proxy.minimize,
          'l-opened': () => this.proxy.opened,
          'l-mobile': () => this.proxy.mobile
        },
      }
    }
  },
  methods: {
    open() {
      this.proxy.opened = true
    },
    close() {
      this.proxy.opened = false
      this.method.onclose && this.method.onclose()
    }
  }
}