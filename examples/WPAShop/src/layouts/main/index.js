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
          sections: {
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
          params: {
            width: '400px'
          },
          proxies: {
            opened: true
          },
          sections: {
            content: {
              // src: cart,

              // src: filter,
              // params: {
              //     header: 'New Filter'
              // },
              // methods: {
              //     change: () => {},
              //     priceFilter: (from, to) => {
              //         this.proxy.products = this.param.products.filter((el) => el.price >= from && el.price <= to);
              //     }
              // }
            },
            bottom: {}
          }
        }
      }
    }
  },
  mounted() {
    this.router.to.extra.sidebar = this.node.sidebar
  }
}
