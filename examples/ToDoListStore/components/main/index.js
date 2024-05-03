import header from '../header'
import card from '../card'
import search from '../search'
import menu from '../menu'
import notification from '../notification'
import bottomPanel from '../bottomPanel'
import { mapProps } from 'lesta'

export default {
  template: `
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
      ...mapProps(['addTask', 'searchTasks', 'filterTasks'], { store: 'tasks' })
    }
  },
  sources: {
    cardButtons: () => import('../cardButtons'),
  },
  nodes() {
    return {
      header: {
        component: {
          src: header,
          spots: {
            start: {
              component: {
                src: search,
                methods: {
                  search: ({ value }) => {
                    this.method.searchTasks({ value })
                  }
                }
              }
            },
            end: {
              component: {
                src: menu,
              }
            }
          }
        }
      },
      notifications: {
        component: {
          src: notification
        }
      },
      bottom_panel: { // global selector function in createApp
        component: {
          induce: false, // order node before this.node.bottom_panel.induce(true)
          src: bottomPanel
        }
      },
      cards: {
        _class: {
          loading: () => this.proxy.loading
        },
        component: {
          src: card,
          iterate: () => this.proxy.tasks,
          params: {
            index: (node) => node.index,
          },
          proxies: {
            card: (node) => this.proxy.tasks[node.index]
          },
          spots: {
            bottom: {
              component: {
                src: this.source.cardButtons,
                proxies: {
                  card: (node) => this.proxy.tasks[node.parent.index]
                }
              }
            }
          },
          aborted: (v) => console.log(v, this), // notify
          completed: (v) => this.node.bottom_panel.induce(true)
        }
      }
    }
  },
  mounted() {
    // this.node.cards.unmount()
  }
}
