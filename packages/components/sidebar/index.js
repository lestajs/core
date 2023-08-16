import './index.css'
import { throttling } from 'lesta'

export default {
  template: `
    <div class="LstSidebar w-side">
      <div class="wr-sidebar">
        <div class="close"></div>
        <div section="top"></div>
        <div section="content"></div>
        <div section="bottom"></div>
      </div>
    </div>`,
  props: {
    params:{
      close: {},
      top: {},
      width: {},
      scroll: {}
    },
    proxies: {
      show: {
        default: true
      }
    },
    methods: {
      close: {}
    }
  },
  nodes() {
    return {
      close: {
        onclick: () => this.method.close()
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
    this.method.resize()
    this.param.scroll = throttling(() => this.method.resize(), 100)
    this.root.addEventListener('scroll', this.param.scroll)
    this.node.LstSidebar.style.setProperty('--sidebar-width', this.param.width || '260px')
    this.node.LstSidebar.style.setProperty('--sidebar-top', this.param.top || '0')
  },
  unmount() {
    this.root.removeEventListener('scroll', this.param.scroll)
  }
}