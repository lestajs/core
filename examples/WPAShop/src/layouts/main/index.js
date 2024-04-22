// import button from '../../../UI/components/button'
import header from '../../../UI/components/header'
import sidebar from '../../../UI/components/sidebar'
import left from './headerTemplates/left'
import right from './headerTemplates/right'
import './index.pcss'

export default {
  template:
    `
    <div class="header"></div>
    <div class="wrapper l-fx l-gap">
        <div class="l-content main" router></div>
        <div class="sidebar"></div>
    </div>
    `,
  nodes() {
    return {
      header: {
        component: {
          src: header,
          spots: {
            left: {
              src: left
            },
            right: {
              src: right
            }
          }
        }
      },
      sidebar: {
        component: {
          src: sidebar,
          proxies: {
            opened: true
          }
        }
      }
    }
  },
  mounted() {
    this.app.sidebar = this.node.sidebar
  }
}
