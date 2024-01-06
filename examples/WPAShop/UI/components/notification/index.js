import './index.css'
import notify from './notify'

export default {
  template: `<div class="LstNotifyList"></div>`,
  props: {
    proxies: {
      _notifications: {
        type: 'array',
        default: []
      }
    },
    params: {
      position: {}
    },
    methods: {
      close: {},
      undo: {}
    }
  },
  nodes() {
    return {
      LstNotifyList: {
        className: (node) => this.param.position ? node.className + ' LstN' + this.param.position : node.className,
        component: {
          src: notify,
          iterate: () => this.proxy._notifications,
          params: {
            index: (notify, index) => index
          },
          proxies: {
            notify: (notify) => notify
          },
          methods: {
            close: (index) => this.method.close && this.method.close(index),
            undo: (index) => this.method.undo && this.method.undo(index)
          }
        }
      }
    }
  }
}