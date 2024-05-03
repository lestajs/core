import './styles/index.css'
import main from './components/main'
import dialog from './components/dialog'

export default {
  template: `
    <div class="wrapper">
      <div class="popup"></div>
      <main></main>
    </div>`,
  directives: {
    _replace: {
      create: (node, options) => options().append(node)
    }
  },
  props: {
    methods: {
      addTask: { store: 'tasks' },
      editTask: { store: 'tasks' }
    }
  },
  outwards: {
    methods: ['createForm'],
  },
  sources: {
    addForm: () => import('./components/form'),
    editForm: () => import('./components/form'),
  },
  nodes() {
    return {
      popup: {
        _replace: () => document.body,
        component: {
          src: dialog,
          methods: {
            onclose: () => this.node.popup.spot.content.unmount()
          },
          spots: {
            content: {
              component: {} // for mounting
            }
          }
        }
      },
      main: {
        selector: 'main',
        component: {
          src: main
        }
      }
    }
  },
  methods: {
    createForm({ mode, data }) {
      this.node.popup.spot.content.mount({ // this.proxy.uncompleted = false
        src: this.source[mode + 'Form'],
        params: { data },
        methods: {
          save: (task) => {
            if (mode === 'edit') {
              this.method.editTask({ task })
            } else {
              this.method.addTask({ task })
            }
            this.node.popup.proxy.opened.setValue(false) // similar to this.node.popup.method.close()
          }
        }
      })
      this.node.popup.proxy.opened.setValue(true) // similar to this.node.popup.method.show()
    }
  },
  loaded() {
    this.app.rootContainer = this.container
    // this.options
  }
}