import './index.css'
import { throttling } from 'lesta'

export default {
  template: `
    <div class="LstSidebar w-side">
      <div class="wr-sidebar">
        <div class="LstClose"></div>
        <div>
          <div section="top"></div>
          <div section="content"></div>
        </div>
        <div section="bottom"></div>
      </div>
    </div>`,
  props: {
    params:{
      close: {},
      top: {},
      width: {},
      minWidth: {},
      autoHeight: {},
    },
    proxies: {
      show: {
        default: true
      },
      mini: {
        default: false
      }
    },
    methods: {
      close: {}
    }
  },
  nodes() {
    return {
      LstClose: {
        onclick: () => this.method.close && this.method.close()
      },
      LstSidebar: {
        _class: {
          mini: () => this.proxy.mini,
          show: () => this.proxy.show,
        },
      }
    }
  },
  methods: {
    resize() {
      this.node.LstSidebar.style.maxHeight = this.root.clientHeight - this.node.LstSidebar.getBoundingClientRect().top + 'px'
    }
  },
  mounted() {
    if (this.param.autoHeight) {
      this.method.resize()
      this.param.autoHeight = throttling(() => this.method.resize(), 100)
      this.root.addEventListener('scroll', this.param.autoHeight)
    }
    this.node.LstSidebar.style.setProperty('--sidebar-width', this.param.width || '210px')
    this.node.LstSidebar.style.setProperty('--sidebar-top', this.param.top || '0')
    this.node.LstSidebar.style.setProperty('--sidebar-minWidth', this.param.minWidth || '56px')
  },
  unmount() {
    this.param.autoHeight && this.root.removeEventListener('scroll', this.param.autoHeight)
  }
}