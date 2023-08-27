import btn from '../button'
import './index.css'
import buttons from '../buttons'

export default {
  template: `
    <a class="LstTicket fx" link>
        <div class="LstTicketFirst" section="first"></div>
        <div class="LstTicketContent">
            <div class="LstTicketHeader">
                <div class="LstTicketExtra" section="extra"></div><h4 class="LstTicketName"></h4>
            </div>
            <div class="LstTicketTheme"></div>
            <div class="LstTicketTags"></div>
            <p class="LstTicketDesc"></p>
            <div class="LstTicketActions fx gap"></div>
        </div>
        <div class="LstTicketLast" section="last"></div>
    </a>`,
  props: {
    params: {
      index: {}
    },
    proxies: {
      image: {},
      name: {},
      theme: {},
      description: {},
      tags: {},
      actions: {},
    },
    methods: {
      change: {}
    }
  },
  nodes() {
    return {
      LstTicketName: {
        textContent: () => this.proxy.name
      },
      LstTicketTheme: {
        textContent: () => this.proxy.theme
      },
      LstTicketDesc: {
        textContent: () => this.proxy.description
      },
      LstTicket: {
        href: this.proxy.url || ''
      },
      LstTicketTags: {
        component: {
          src: buttons,
          params: {
            buttons: this.proxy.tags
          },
          methods: {
            change: (index) => console.log(index)
          }
        }
      },
      LstTicketActions: {
        onclick: (event) => {
          event.preventDefault()
          event.stopPropagation()
        },
        component: {
          src: btn,
          induce: () => this.proxy.actions,
          iterate: () => this.proxy.actions,
          params: {
            name: (btn) => btn.name,
            text: (btn) => btn.text,
            icon: (btn) => btn.icon,
            size: 'small',
            type: 'text'
          },
          methods: {
            change: this.method.change
          }
        }
      }
    }
  }
}