import tabs from '../../../UI/components/tabs'
import './index.pcss'
import shipIcon from 'bundle-text:./ship.svg'
import locationIcon from 'bundle-text:./location.svg'

export default {
  template: 
  `
    <div class="tabs"></div>
  `,
  proxies: {
    currentTab: 0,
  },
  nodes() {
    return {
      tabs: {
        component: {
          src: tabs,
          proxies: {
            items: [{label: 'Ship', icon: shipIcon}, {label: 'Pick up', icon: locationIcon}],
            value: () => this.proxy.currentTab,
          },
          methods: {
            action({ index }) {
              console.log(this, index)
              this.proxy.currentTab = index
            }
          }
        }
      }
    }
  }
}