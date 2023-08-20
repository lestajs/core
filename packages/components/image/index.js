import './index.css'
import '../skeleton/index.css'

export default {
  template: `
      <div class="LstImageWr">
        <img class="LstImage">
        <div class="LstPreload"></div>
      </div>`,
  proxies: {
    preload: true
  },
  props: {
    proxies: {
      url: {
        default: ''
      },
      alt: {
        default: ''
      }
    },
    params: {
      url: {
        default: ''
      },
      alt: {
        default: ''
      },
      width: {},
      height: {}
    },
    methods: {
      action: {}
    }
  },
  nodes() {
    return {
      LstPreload: {},
      LstImageWr: {
        style: () => {
          return { paddingTop: this.param.height * 100 / this.param.width + '%' }
        }
      },
      LstImage: {
        src: () =>  this.param.url || this.proxy.url,
        alt: () => this.param.alt || this.proxy.alt,
        onload: () => {
          this.node.LstPreload.classList.add('hide')
        },
        onerror: (event) => {
          event.target.classList.add('LstImageErr')
        }
      }
    }
  }
}