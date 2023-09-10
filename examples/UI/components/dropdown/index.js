import './index.css'
import { _outside } from '../directives'

export default {
  template: `
  <div class="LtsDropdown hide">
    <div section="content"></div>
  </div>`,
  directives: { _outside },
  props: {
    params: {
      target: {}
    },
    proxies: {
      hidden: {
        default: true
      }
    },
    methods: {
      hide: {}
    }
  },
  nodes() {
    return {
      LtsDropdown: {
        _class: {
          hide: () => this.proxy.hidden
        },
        _outside: {
          change: (event) => {
            if (this.param.target && this.param.target.contains(event.target)) return
            this.method.hide && this.method.hide(true)
          }
        }
      }
    }
  }
}