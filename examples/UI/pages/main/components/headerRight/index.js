import buttons from '../../../../components/buttons'
import miniava from '../../../../components/miniava'
import './index.css'

export default {
  template: `
    <div class="fx">
    <div class="rightBar"></div>
    <div class="miniava"></div>
    </div>
`,
  nodes() {
    return {
      rightBar: {
        component: {
          src: buttons,
          params: {
            buttons: ['☀', '☾']
          },
          proxies: {
            active: 1
          },
          methods: {
            change: (v) => {
              v === '☾' ? this.root.classList.add('dark') : this.root.classList.remove('dark')
            }
          }
        }
      },
      miniava: {
        component: {
          src: miniava,
          proxies: {
            url: 'https://i.pinimg.com/736x/a5/b9/b6/a5b9b6cda1fe53b27d88ad7bc5b6dcac.jpg'
          }
        }
      }
    }
  }
}