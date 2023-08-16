import './styles/index.css'
import main from './components/main'
import dialog from './components/dialog'

export default {
  template: `
    <div class="wrapper">
      <div class="popup"></div>
      <main></main>
    </div>`,
  selectors: {
    main: 'main'
  },
  nodes() {
    return {
      popup: {
        component: {
          src: dialog,
          sections: {
            content: {}
          }
        }
      },
      main: {
        component: {
          src: main,
          params: {
            popup: () => this.node.popup
          }
        }
      }
    }
  }
}