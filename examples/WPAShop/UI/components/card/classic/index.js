import btn from '../../buttonOld'
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
          src: btn,
          induce: () => this.proxy.buttons,
          iterate: () => this.proxy.buttons,
          params: {
            name: (btn) => btn.name,
            text: (btn) => btn.text,
            icon: (btn) => btn.icon,
            size: 'mini',
            type: 'text'
          },
          proxies: {
            active: () => this.proxy.active
          },
          methods: {
            change: this.method.change
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