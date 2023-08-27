import header from './components/header'
import sidebar from './components/sidebar'
import button from './components/button'
import checkbox from './components/checkbox'
import buttons from './components/buttons'
import sidebarContent from './pages/main/components/sidebarContent'
import headerRight from './pages/main/components/headerRight'
import subHeader from './pages/main/components/subHeader'
import image from './components/image'
import notification from './components/notification'
import table from './components/table'
import { uid } from 'lesta'

export default {
  template: `
    <div class="screen fx">
        <div class="sidebar"></div>
        <div class="main">
          <div class="header"></div>
          <div class="subHeader"></div>
          <div class="notification"></div>
          <div class="table"></div>
        </div>
    </div>`,
  props: {
    proxies: {
      notifications: { store: 'notification' }
    },
    methods: {
      notifyAdd: { store: 'notification' },
      notifyClose: { store: 'notification' }
    }
  },
  proxies: {
    mini: false,
    body: []
  },
  nodes() {
    return {
      header: {
        component: {
          src: header,
          sections: {
            left: {
              src: button,
              params: {
                icon: '☰'
              },
              methods: {
                change: () => this.proxy.mini = !this.proxy.mini
              }
            },
            center: {
              src: checkbox,
              proxies: {
                checked: true,
                text: 'Задачи',
              }
            },
            right: {
              src: headerRight
            }
          }
        }
      },
      subHeader: {
        component: {
          src: subHeader
        }
      },
      sidebar: {
        component: {
          src: sidebar,
          proxies: {
            mini: () => this.proxy.mini
          },
          sections: {
            top: {
              src: image,
              params: {
                attitude: 1
              },
              proxies: {
                url: 'https://i.pinimg.com/736x/a5/b9/b6/a5b9b6cda1fe53b27d88ad7bc5b6dcac.jpg',
              }
            },
            content: {
              src: sidebarContent,
              induce: () => !this.proxy.mini
            },
            bottom: {
              src: buttons,
              params: {
                width: '100%',
                size: 'mini',
                buttons: ['Шаблоны', 'Архивы']
              },
              methods: {
                change: (value) => this.method.notifyAdd({ value })
              }
            }
          }
        }
      },
      notification: {
        component: {
          src: notification,
          params: {
            position: 'BR'
          },
          proxies: {
            _notifications: () => this.proxy.notifications
          },
          methods: {
            close: (index) => this.method.notifyClose({ index} )
          }
        }
      },
      table: {
        component: {
          src: table,
          params: {
            columns: ['id', 'text', 'desc']
          },
          proxies: {
            body: () => this.proxy.body
          }
        }
      }
      // accordion: {
      //   component: {
      //     src: accordion,
      //     sections: {
      //       content: {
      //         src: { template: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.' }
      //       }
      //     }
      //   }
      // }
    }
  },
  loaded() {
    for (let i = 0; i < 100; i++) {
      this.options.proxies.body.push({
        id: uid(),
        text: 'text',
        desc: 'desc'
      })
    }
  }
}