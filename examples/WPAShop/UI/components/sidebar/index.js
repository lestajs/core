import './index.css'

export default {
  template: `
    <div class="lstSidebar">
      <div class="lstBackdrop"></div>
      <div class="lstSidebarWr">
        <div>
          <div spot="top"></div>
          <div spot="content"></div>
        </div>
        <div spot="bottom"></div>
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
  spots: ['top', 'content', 'bottom'],
  outwards: {
    methods: ['open', 'close', 'toggle']
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
    },
    toggle() {
      this.proxy.opened = !this.proxy.opened
    }
  }
}