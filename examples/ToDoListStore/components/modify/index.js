import { mapProps, mapComponent } from 'lesta'
import button from '../button'

export default {
  template: `
      <template class="remove"></template>
      <template class="edit"></template>`,
  props: {
    proxies: {
      card: {},
    },
    methods: {
      ...mapProps(['editTask', 'removeTask'], { store: 'tasks' }),
      // editTask: { store: 'tasks' },
      // removeTask: { store: 'tasks' }
      addNotice: { store: 'notices' }
    }
  },
  nodes() {
    return {
      remove: {
        prepared: true,
        component: {
          src: button,
          params: {
            className: 'remove'
          },
          proxies: {
            text: 'remove'
          },
          methods: {
            action: () => {
              this.method.removeTask({ id: this.proxy.card.id })
              this.method.addNotice({ text: `${this.proxy.card.id}: removed` })
            }
          }
        }
      },
      edit: {
        prepared: true,
        component: {
          src: button,
          ...mapComponent(({ params, proxies, methods, spots }) => { // short note
            params.className = 'edit'
            proxies.text = 'edit'
            methods.action = () => this.app.rootContainer.method.createForm({ mode: 'edit', data: this.proxy.card })
          })
        }
      }
    }
  }
}
