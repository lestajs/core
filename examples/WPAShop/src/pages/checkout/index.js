import tabs from '../../../UI/components/tabs'

export default {
  template: 
  `
      <div class="tabs"></div>
  `,
  nodes() {
    return {
      tabs: {
        component: {
          src: tabs,
          proxies: {
            value: ['Ship', 'Pick up'],
            
          },
          methods: {
            action({ value, index }) {

            }
          }
        }
      }
    }
  }
}