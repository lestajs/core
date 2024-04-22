import './index.css'
import header from '../header'
import card from '../card'
import form from '../form'
import search from '../search'
import notification from '../notification'
import bottomPanel from '../bottomPanel'
import { mapProps } from 'lesta'

export default {
  template: `
    <template>
      <div class="search"></div>
    </template>
    <template>
      <div class="controls">
        <div class="count"></div>
        <button class="filter blue"></button>
        <button class="add green">Add Task</button>
      </div>
    </template>
    <div class="header"></div>
    <div class="notifications"></div>
    <div class="cards"></div>
    <div class="bottom-panel"></div>`,
  props: {
    proxies: {
      // tasks: { store: 'tasks' },
      // loading: { store: 'tasks' }
      ...mapProps(['tasks', 'loading'], { store: 'tasks' })
    },
    methods: {
      ...mapProps(['addTask', 'searchTasks', 'filterTasks', 'filterStop'], { store: 'tasks' })
    }
  },
  handlers: {
    showIncomplete(v) {
      this.method.filterStop()
    }
  },
  proxies: {
    showIncomplete: false
  },
  sources: {
    count: () => import('../count'),
    cardButtons: () => import('../cardButtons'),
  },
  nodes() {
    return {
      header: {
        component: {
          src: header
        }
      },
      count: {
        component: {
          src: this.source.count,
          induce: () => this.proxy.showIncomplete
        }
      },
      filter: {
        textContent: () => this.proxy.showIncomplete ? 'Hide incomplete' : 'Show incomplete',
        onclick: () => {
          this.proxy.showIncomplete = !this.proxy.showIncomplete
          this.method.filterTasks({ incomplete: this.proxy.showIncomplete })
        }
      },
      add: {
        onclick: () => {
          this.proxy.showIncomplete = false
          this.method.addPopup()
        }
      },
      search: {
        _replace: () => this.node.header.spot.start, // this.node.header.spot.start
        component: {
          src: search,
          methods: {
            search: ({ value }) => {
              this.proxy.showIncomplete = false
              this.method.searchTasks({ value })
            }
          }
        }
      },
      controls: {
        _replace: () => this.node.header.spot.end,
      },
      notifications: {
        component: {
          src: notification
        }
      },
      cards: {
        _class: {
          loading: () => this.proxy.loading
        },
        component: {
          src: card,
          async: true,
          iterate: () => this.proxy.tasks,
          params: {
            index: (task, index) => index,
            bottomComponent: {
              module: this.source.cardButtons
            }
          },
          proxies: {
            card: (task) => task
          },
          aborted: (v) => console.log(v, this)
        }
      },
      bottom_panel: { // app selector
        component: {
          src: bottomPanel
        }
      }
    }
  },
  methods: {
    addPopup() {
      this.app.popup.spot.content.mount({
        src: form,
        methods: {
          save: (task) => {
            this.method.addTask({ task })
            this.app.popup.method.close()
          }
        }
      })
      this.app.popup.method.show()
    }
  },
  mounted() {
    console.dir(this.container)
  }
}