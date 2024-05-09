import './index.css'
import { nextRepaint } from 'lesta'

export default {
  template: `
  <div class="notice red">
    <span class="text"></span>
    <span class="close">ok</span>
  </div>`,
  props: {
    params: {
      index: {
        type: 'number',
        required: true
      }
    },
    proxies: {
      notice: {
        validation: (v) => {
          return v.text || 'removed'
        },
        type: 'object',
        required: true,
        // default: {},
        // hole: true
      }
    },
    methods: {
      close: {
        required: true
      }
    }
  },
  nodes() {
    return {
      notice: {},
      text: {
        _text: () => this.proxy.notice.text
      },
      close: {
        onclick: () => {
          this.method.close({ index: this.param.index })
        }
      }
    }
  },
  async mounted() {
   await nextRepaint() // return promise
   this.node.notice.target.classList.add('visible')
  }
}