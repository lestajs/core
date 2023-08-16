import './index.css'

export default {
  template: `
    <div class="LstTrigger">
        <strong class="LstTriggerHeader">header</strong>
        <div class="LstTriggerIcon LstArrow"></div>
    </div>
    <div class="LstPanel">
        <p class="LstContent" section="content"></p>
    </div>`,
  proxies: {
    hide: false
  },
  props: {
    params: {
      header: {}
    },
    proxies: {
      header: {}
    },
    methods: {
      change : {}
    }
  },
  nodes() {
    return {
      LstTrigger: {
        _class: {
          up: () => !this.proxy.hide
        },
        onclick: () => {
          this.proxy.hide = !this.proxy.hide
          this.method.change(this.proxy.hide)
        }
      },
      LstTriggerHeader: {
        textContent: () => this.param.header || this.proxy.header,
      },
      LstContent: {},
      LstPanel: {
        _class: {
          hide: () => this.proxy.hide
        }
      }
    }
  },
  methods: {
    resize() {
      this.node.LstPanel.style.hide = this.node.LstContent.clientHeight + 'px'
    }
  },
  mounted() {
    this.method.resize()
  }
}
