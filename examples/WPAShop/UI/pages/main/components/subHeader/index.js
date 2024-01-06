import header from '../../../../components/header'
import button from '../../../../components/button'
import filters from '../../components/filters'

export default {
  template: `<div class="subHeader"></div>`,
  nodes() {
    return {
      subHeader: {
        component: {
          src: header,
          sections: {
            center: {
              src: filters
            },
            right: {
              src: button,
              params: {
                text: 'Поделиться ⠪',
              },
              methods: {
                change: () => this.proxy.mini = !this.proxy.mini
              }
            }
          }
        }
      }
    }
  }
}