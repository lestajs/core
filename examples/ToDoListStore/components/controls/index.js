import './index.css'
import switcher from '../switcher'

export default {
  template: `
      <template class="switcher">uncompleted</template>
      <div spot="buttons"></div>`,
  spots: ['buttons'],
  props: {
    proxies: {
      isModify: { store: 'tasks' },
      card: {},
    },
    methods: {
      completeTask: { store: 'tasks' },
      addNotice: { store: 'notices' }
    }
  },
  nodes() {
    return {
      switcher: {
        prepared: true,
        component: {
          src: switcher,
          params: {
            className: 'completed'
          },
          proxies: {
            text: () => this.proxy.card.completed ? 'completed' : 'uncompleted',
            disabled: () => !this.proxy.isModify,
            active: () => this.proxy.card.completed
          },
          methods: {
            action: () => this.method.completeTask({ id: this.proxy.card.id })
          }
        }
      }
    }
  }
}