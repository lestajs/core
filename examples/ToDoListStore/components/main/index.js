import './index.css'
import card from '../card'
import form from '../form'
import search from '../search'
import notifications from '../notifications'
import { mapProps } from 'lesta'

export default {
  template: `
        <header>
            <div class="search"></div>
            <div class="btnGroup">
              <div class="count"></div>
              <button class="filter blue"></button>
              <button class="add green">Add Task</button>
            </div>
        </header>
        <div class="notifications"></div>
        <div class="cards"></div>`,
  props: {
    params: {
      popup: {}
    },
    proxies: {
      // tasks: { store: 'tasks' },
      // test: { store: 'tasks' }
      ...mapProps(['tasks', 'test'], { store: 'tasks' })
    },
    methods: {
      ...mapProps(['add', 'edit', 'remove', 'complete', 'search', 'filter', 'delayFilterStop'], { store: 'tasks' })
    }
  },
  handlers: {
    showIncomplete(v) {
      this.method.delayFilterStop()
    }
  },
  proxies: {
    showIncomplete: false
  },
  sources: {
    count: () => import('../count')
  },
  nodes() {
    return {
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
          this.method.filter({ incomplete: this.proxy.showIncomplete })
        }
      },
      add: {
        onclick: () => {
          this.proxy.showIncomplete = false
          this.method.popupAdd()
        }
      },
      search: {
        component: {
          src: search,
          methods: {
            search: (value) => {
              this.proxy.showIncomplete = false
              this.method.search({ value })
            }
          }
        }
      },
      notifications: {
        component: {
          src: notifications
        }
      },
      cards: {
        textContent: () => !this.proxy.tasks.length ? 'empty...' : '',
        component: {
          src: card,
          iterate: () => this.proxy.tasks,
          params: {
            index: (task, index) => index,
          },
          proxies: {
            _card: (task) => task
          },
          methods: {
            complete: (task) => this.method.complete({ id: task.id }),
            remove: (task) => {
              this.method.remove({ id: task.id })
              this.node.notifications.method.add({ text: task.name })
            },
            edit: this.method.popupEdit
          }
        }
      }
    }
  },
  methods: {
    popupAdd() {
      this.param.popup.section.content.mount({
        src: form,
        methods: {
          save: (task) => {
            this.method.add({ task })
            this.param.popup.method.close()
          }
        }
      })
      this.param.popup.method.open()
    },
    popupEdit(task) {
      this.param.popup.section.content.mount({
        src: form,
        params: {
          card: task,
        },
        methods: {
          save: ({ date, name, description }) => {
            task.date = date
            task.description = description
            task.name = name
            this.method.edit({ task })
            this.param.popup.method.close()
          }
        }
      })
      this.param.popup.method.open()
    }
  }
}