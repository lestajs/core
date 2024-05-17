import './styles/index.css'
import main from './components/main'
import dialog from './components/dialog'

export default {
  template: `
    <div class="wrapper">
      <div class="popup"></div>
      <main></main>
    </div>`,
  directives: { // local directives
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
            onclose: () => {
              // return true // stop closing
            }
          },
          spots: {
            content: {
              component: {} // for later mounting
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
            this.node.popup.method.close() // another not safe way: this.node.popup.proxy.opened.setValue(false)
          }
        }
      })
      // this.node.popup.spot.content.unmount() // if necessary
      this.node.popup.method.show() // another not safe way: this.node.popup.proxy.opened.setValue(true)
    }
  },
  loaded() {
    this.app.rootContainer = this.container
    // this.options
  },
  created() {
    // this.proxy
  },
  rendered() {
    // template in DOM
  },
  mounted() {
    // this.node
    console.log(`nodepath: ${this.node.popup.nodepath}, nodename: ${this.node.popup.nodename}, maxWidth: ${this.node.popup.param.maxWidth}`)
  }
}