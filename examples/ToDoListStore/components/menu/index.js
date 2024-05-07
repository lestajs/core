import './index.css'
import { mapProps } from 'lesta'

export default {
  template:
    `<div class="menu">
      <div class="count"></div>
      <button class="filter blue"></button>
      <button class="add green">Add Task</button>
      <button class="mode"></button>
    </div>`,
  props: {
    proxies: {
      ...mapProps(['isCompleted', 'isModify'], { store: 'tasks' })
    },
    methods: {
      ...mapProps(['filterTasks', 'changeMode'], { store: 'tasks' })
    }
  },
  sources: {
    count: () => import('../count'),
  },
  nodes() {
    return {
      count: {
        component: {
          src: this.source.count,
          induce: () => this.proxy.isCompleted
        }
      },
      filter: {
        _text: () => this.proxy.isCompleted ? 'Hide completed' : 'Show completed',
        onclick: () => this.method.filterTasks()
      },
      add: {
        onclick: () => this.app.rootContainer.method.createForm({ mode: 'add' })
      },
      mode: {
        _text: () => this.proxy.isModify ? 'Read Only' : 'Modify',
        onclick: () => this.method.changeMode()
      }
    }
  }
}