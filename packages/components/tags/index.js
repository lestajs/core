import './index.css'
import li from './li'

export default {
  template: `
  <div class="LstList"></div>`,
  props: {
    proxies: {
      _tags: {
        type: 'Array'
      },
      active: {}
    },
    params: {
      tags: {
        type: 'Array'
      },
      size: {},
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
      LstList: {
        component: {
          src: li,
          iterate: () => this.param.tags || this.proxy._tags || [],
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
  },
  mounted() {
    console.log(this.node.LstList.reactivity)
  }
}