import button from '../button'
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
      index: 'number'
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
      },
      url: {}
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
          async: true,
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
          async: true,
          src: this.source.classic,
          proxies: {
            title: () => this.proxy.title,
            desc: () => this.proxy.description,
            ava: () => this.proxy.ava,
            buttons: () => this.proxy.buttons
          },
          methods: {
            change: ({ name }) => this.method.change?.({ name, index: this.param.index })
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
          src: button,
          iterate: () => this.proxy.actions,
          proxies: {
            value: (btn) => btn.text
          },
          params: {
            name: (btn) => btn.name,
            icon: (btn) => btn.icon,
            size: 'small',
            type: 'text'
          },
          methods: {
            action: ({ name }) => this.method.action?.({ name, index: this.param.index })
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