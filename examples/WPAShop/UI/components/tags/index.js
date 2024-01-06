import './index.css'
import tag from './tag'

export default {
  template: `<div class="LstTags"></div>`,
  props: {
    proxies: {
      _tags: {
        type: 'array'
      },
      active: {}
    },
    params: {
      tags: {
        type: 'array'
      },
      size: {
        default: 'small'
      },
      draggable: {}
    },
    methods: {
      active: {},
      remove: {},
      move: {}
    }
  },
  proxies: {
    selected: false,
  },
  params: {
    current: null
  },
  nodes() {
    return {
      LstTags: {
        component: {
          src: tag,
          iterate: () => this.proxy._tags || this.param.tags || [],
          proxies: {
            li: (li) => li,
            selected: (_, index) => this.proxy.selected === index,
            active: (tag) => this.proxy.active === tag,
          },
          params: {
            index: (_, index) => index,
            size: this.param.size,
            draggable: this.param.draggable
          },
          methods: {
            active: this.method.active,
            remove: this.method.remove,
            select: (index) => this.proxy.selected = index,
            change: (index) => this.param.current = index
          }
        },
        ondragover: (event) => {
          event.preventDefault()
          const selected = this.node.LstList.children[this.proxy.selected]
          const current = this.node.LstList.children[this.param.current]
          
          if (selected === current) return
     
          this.method.move(this.proxy.selected, this.param.current)
          this.proxy.selected = this.param.current
        }
      }
    }
  }
}