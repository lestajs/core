import './styles/index.css'
import main from './components/main'
import dialog from './components/dialog'

export default {
  template: `
    <div class="wrapper">
      <div class="popup"></div>
      <main></main>
    </div>`,
  nodes() {
    return {
      popup: {
        component: {
          src: dialog,
        }
      },
      main: {
        selector:  'main',
        component: {
          src: main
        }
      }
    }
  },
  mounted() {
    this.app.popup = this.node.popup
  }
}