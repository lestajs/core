import './index.css'

export default {
  template: `
    <div class="LstAccordionWr"></div>
    <div class="LstTrigger">
        <div class="LstTriggerHeader"></div>
        <div class="LstTriggerIcon LstArrow"></div>
    </div>
    <div class="LstPanel">
        <p class="LstContent" spot="content"></p>
    </div>`,
  proxies: {
    hide: false
  },
  props: {
    params: {
      header: {
        default: 'header'
      }
    },
    proxies: {
      header: {}
    },
    methods: {
      change : {}
    }
  },
  spots: ['content'],
  nodes() {
    return {
      LstTrigger: {
        _class: {
          up: () => !this.proxy.hide
        },
        onclick: () => {
          this.proxy.hide = !this.proxy.hide
          this.method.change && this.method.change(this.proxy.hide)
        }
      },
      LstTriggerHeader: {
        textContent: () => this.proxy.header ?? this.param.header ?? '',
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
      this.node.LstPanel.target.style.hide = this.node.LstContent.clientHeight + 'px'
    }
  },
  mounted() {
    this.method.resize()
  }
}
