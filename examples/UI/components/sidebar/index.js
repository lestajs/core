import './index.css'
import { throttling } from 'lesta'

export default {
  template: `
    <div class="LstSidebar">
      <div class="LstClose"></div>
      <div class="LstSidebarWr">
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
      tabletWidth: {},
      scrollContainer: {},
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
  params: {
    scrollHandler: () => {},
    matchMedia: null
  },
  proxies: {
    tablet: false
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
          tablet: () => this.proxy.tablet
        },
      }
    }
  },
  methods: {
    resize() {
      const top = this.node.LstSidebar.getBoundingClientRect().top
      this.node.LstSidebar.style.maxHeight = this.param.scrollContainer.clientHeight - top + 'px'
    },
    tabletChange(v) {
      this.proxy.tablet = v.matches
      if (this.proxy.tablet && this.proxy.show) this.method.close && this.method.close()
    },
    isTablet() {
      return this.proxy.tablet
    }
  },
  mounted() {
    if (this.param.scrollContainer) {
      this.method.resize()
      this.param.scrollHandler = throttling(() => this.method.resize(), 100)
      this.param.scrollContainer.addEventListener('scroll', this.param.scrollHandler)
    }
    this.node.LstSidebar.style.setProperty('--sidebar-width', this.param.width || '210px')
    this.node.LstSidebar.style.setProperty('--sidebar-top', this.param.top || '0')
    this.node.LstSidebar.style.setProperty('--sidebar-minWidth', this.param.minWidth || '56px')
    this.param.matchMedia = window.matchMedia(`(max-width: ${ this.param.tabletWidth || '560px' })`)
    this.method.tabletChange(this.param.matchMedia)
    this.param.matchMedia.addListener(this.method.tabletChange)
  },
  unmounted() {
    this.param.scrollContainer && this.root.removeEventListener('scroll', this.param.scrollHandler)
    this.param.matchMedia.removeListener(this.method.tabletChange)
  }
}