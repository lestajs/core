import header from '../header'
import card from '../card'
import search from '../search'
import menu from '../menu'
import notification from '../notification'
import controls from '../controls'
import total from '../total'
import { mapProps } from 'lesta'

export default {
  template: `
    <div class="header"></div>
    <div class="notifications"></div>
    <div class="cards"></div>
    <div class="bottom-panel"></div>`,
  props: {
    proxies: {
      ...mapProps(['tasks', 'loading', 'isModify'], { store: 'tasks' })
      // tasks: { store: 'tasks' },
      // loading: { store: 'tasks' }
    },
    methods: {
      ...mapProps(['addTask', 'searchTasks', 'filterTasks'], { store: 'tasks' })
    }
  },
  sources: {
    modify: () => import('../modify'),
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
                src: menu
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
          src: total
        }
      },
      cards: {
        _class: {
          loading: () => this.proxy.loading
        },
        _html: () => {
          if (this.proxy.tasks.length) return
          return '<strong>Empty...</strong>'
        },
        component: {
          src: card,
          // async: true,
          iterate: () => this.proxy.tasks,
          proxies: {
            card: ({ index }) => this.proxy.tasks[index]
          },
          spots: {
            // DOM properties
            bottom: {
              component: {
                src: controls,
                proxies: {
                  card: (node) => this.proxy.tasks[node.parent.index]
                },
                spots: {
                  buttons: {
                    component: {
                      induce: () => this.proxy.isModify,
                      src: this.source.modify,
                      proxies: {
                        card: (node) => this.proxy.tasks[node.parent.parent.index]
                      },
                      // aborted: (v) => console.log('aborted', v, this), // notify
                    }
                  }
                }
              }
            }
          },
          completed: (v) => this.node.bottom_panel.induce(true)
        }
      }
    }
  }
}
