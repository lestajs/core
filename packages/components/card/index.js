import btn from '../button'
import image from '../image'
import './index.css'

export default {
  template: `
    <a class="LstCard" link>
        <div class="LstCardActions"></div>
        <div class="LstCardImage"></div>
        <div class="LstCardStandard"></div>
        <div class="LstCardClassic"></div>
    </a>`,
  props: {
    params: {
      index: {}
    },
    proxies: {
      image: {},
      header: {},
      content: {},
      title: {},
      description: {},
      ava: {},
      buttons: {},
      actions: {
        default: []
      }
    },
    methods: {
      change: {},
      action: {}
    }
  },
  sources: {
    standard: () => import('./standard'),
    classic: () => import('./classic')
  },
  nodes() {
    return {
      LstCardStandard: {
        component: {
          induce: () => this.proxy.header || this.proxy.content,
          src: this.source.standard,
          proxies: {
            header: () => this.proxy.header,
            content: () => this.proxy.content
          }
        }
      },
      LstCardClassic: {
        component: {
          induce: () => this.proxy.title || this.proxy.buttons,
          src: this.source.classic,
          proxies: {
            title: () => this.proxy.title,
            desc: () => this.proxy.description,
            ava: () => this.proxy.ava,
            buttons: () => this.proxy.buttons
          },
          methods: {
            change: (btn) => this.method.change && this.method.change(btn.name, this.param.index)
          }
        }
      },
      LstCard: {
        href: this.proxy.url || ''
      },
      LstCardActions: {
        onclick: (event) => {
          event.preventDefault()
          event.stopPropagation()
        },
        component: {
          src: btn,
          iterate: () => this.proxy.actions,
          params: {
            name: (btn) => btn.name,
            text: (btn) => btn.text,
            icon: (btn) => btn.icon,
            size: 'small',
            type: 'text'
          },
          methods: {
            change: (btn) => this.method.action && this.method.action(btn.name, this.param.index)
          }
        }
      },
      LstCardImage: {
        component: {
          induce: () => this.proxy.image,
          src: image,
          proxies: {
            url: () => this.proxy.image
          },
          params: {
            width: 300,
            height: 200
          }
        }
      }
    }
  }
}