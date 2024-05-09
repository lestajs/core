import button from '../../button'
import miniava from '../../miniava'

export default {
  template: `<div class="LstCardWr fx">
          <div class="LstCardMiniature"></div>
          <div>
            <div class="LstCardTitle"></div>
            <div class="LstCardDesc"></div>
          </div>
          <div class="LstCardButtons fx"></div>
        </div>`,
  props: {
    proxies: {
      buttons: {},
      title: {},
      desc: {},
      ava: {}
    },
    methods: {
      change: {}
    }
  },
  nodes() {
    return {
      LstCardTitle: {
        textContent: () => this.proxy.title,
      },
      LstCardDesc: {
        textContent: () => this.proxy.desc,
      },
      LstCardButtons: {
        onclick: (event) => {
          event.preventDefault()
          event.stopPropagation()
        },
        component: {
          src: button,
          induce: () => this.proxy.buttons,
          iterate: () => this.proxy.buttons,
          proxies: {
            value: ({ index }) => this.proxy.buttons[index].text,
            active: () => this.proxy.active
          },
          params: {
            name: ({ index }) => this.proxy.buttons[index].name,
            icon: ({ index }) => this.proxy.buttons[index].icon,
            type: 'text'
          },
          methods: {
            action: this.method.change
          }
        }
      },
      LstCardMiniature: {
        component: {
          src: miniava,
          induce: () => this.proxy.ava,
          proxies: {
            url: () => this.proxy.ava,
          },
          params: {
            width: 36,
            height: 36
          }
        }
      }
    }
  }
}