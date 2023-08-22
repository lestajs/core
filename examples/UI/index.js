import '../../packages/components/ui.css'
import {
  accordion,
  button,
  buttons,
  // card,
  checkbox,
  dialog,
  dropdown,
  // form,
  header,
  // image,
  input,
  // list,
  // miniava,
  // pagination,
  // rating,
  select,
  sidebar,
  // tags,
  // textarea,
  // ticket
} from '../../packages/components/index'
import { createApp } from 'lesta'

const root = document.querySelector('#root')
const app = createApp({ root })
const component = {
  template: `
    <style>
        .form > div { padding: 20px; border-bottom: 2px solid var(--gray)}
    </style>
    <div class="form">
        <div class="header"></div>
        <div class="button"></div>
        <div class="buttons"></div>
        <div class="input"></div>
        <div class="search"></div>
        <div class="sidebar"></div>
        <div class="checkbox"></div>
        <div class="select"></div>
        <div class="accordion"></div>
    </div>`,
  nodes() {
    return {
      header: {
        component: {
          src: header,
          sections: {
            left: {
              src: { template: 'logo' }
            }
          }
        }
      },
      button: {
        component: {
          src: button,
          params: { text: 'Button' }
        }
      },
      buttons: {
        component: {
          src: buttons,
          params: {
            buttons: ['first', 'second'],
            actives: ['second']
          }
        }
      },
      search: {
        component: {
          src: input,
          params: {
            label: 'search',
            type: 'search'
          },
          proxies: {
            value: () => 'Search...',
          }
        }
      },
      input: {
        component: {
          src: input,
          params: {
            label: 'input',
          },
          proxies: {
            value: () => 'Edit...',
          }
        }
      },
      select: {
        component: {
          src: select,
          params: {
            label: 'select',
            options: ['first', 'second'],
            value: 'first'
          }
        }
      },
      checkbox: {
        component: {
          src: checkbox,
          params: {
            checked: true,
            text: 'checkbox',
          }
        }
      },
      sidebar: {
        component: {
          src: sidebar,
          sections: {
            content: {
              src: { template: 'sidebar' }
            }
          }
        }
      },
      accordion: {
        component: {
          src: accordion,
          sections: {
            content: {
              src: { template: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' }
            }
          }
        }
      }
    }
  }
}

app.mount(component)