import './index.css'
import { _overlay } from '../directives'

export default {
  template: `
  <div class="LtsDropdown hide">
    <div section="content"></div>
  </div>`,
  directives: { _overlay },
  props: {
    proxies: {
      hide: {
        default: true
      }
    },
    methods: {
      change: {}
    }
  },
  nodes() {
    return {
      LtsDropdown: {
        _class: {
          hide: () => this.proxy.hide
        },
        _overlay: {
          hide: () => {
            this.method.change && this.method.change(true)
          }
        }
      }
    }
  }
}