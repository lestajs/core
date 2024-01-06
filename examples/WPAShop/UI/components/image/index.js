import './index.css'
import '../skeleton/index.css'

export default {
  template: `
      <div class="LstImageWr">
        <img class="LstImage">
        <div class="LstPreload"></div>
<!--        <div class="LstImageErr"></div>-->
      </div>`,
  proxies: {
    preload: true
  },
  props: {
    proxies: {
      url: {},
      alt: {
        default: 'image'
      }
    },
    params: {
      width: {},
      height: {},
      attitude: {}, // height / width
    },
    methods: {
      action: {}
    }
  },
  nodes() {
    return {
      LstPreload: {},
      LstImageWr: {},
      LstImage: {
        src: () => this.proxy.url,
        alt: () => this.proxy.alt,
        onload: () => {
          this.node.LstPreload.classList.add('hide')
        },
        onerror: () => {
          this.proxy.url = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
          this.node.LstImageWr.classList.add('LstImageErr')
        }
      }
    }
  },
  mounted() {
    this.node.LstImageWr.style.setProperty('--image-width', this.param.width || '100%')
    this.node.LstImageWr.style.setProperty('--image-height', this.param.height || '100%')
    this.node.LstImageWr.style.setProperty('--image-padding', (this.param.attitude && this.param.attitude * 100 || 56.3889) + '%')
  },
}