import buttons from '../../../../components/buttons'
import button from '../../../../components/button'
import input from '../../../../components/input'
import './index.css'

export default {
  template: `
    <div class="searchBar"></div>
    <div class="folders"></div>
    <div class="hd fx jc-sb">
        <span>Проекты</span><div class="add"></div>
    </div>
    <div class="projects"></div>`,
  props: {
    methods: {
      notifyAdd: { store: 'notification' }
    }
  },
  nodes() {
    return {
      searchBar: {
        component: {
          src: input,
          params: {
            size: 'small',
            type: 'search',
            placeholder: 'search...'
          }
        }
      },
      folders: {
        component: {
          src: buttons,
          params: {
            width: '100%',
            size: 'mini',
          },
          proxies: {
            buttons: ['📂 Мои задачи', '📂 Все задачи', '📂 Все проекты']
          },
          methods: {
            change: (value) => this.method.notifyAdd({ value })
          }
        }
      },
      add: {
        component: {
          src: button,
          params: {
            size: 'mini',
            text: '+'
          }
        }
      },
      projects: {
        component: {
          src: buttons,
          params: {
            width: '100%',
            size: 'mini'
          },
          proxies: {
            buttons: ['Спутник', 'Мой дом']
          }
        }
      }
    }
  }
}