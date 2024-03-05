import card from '../../../../UI/components/card'
import cartCard from '../../../layouts/cart/cartCard'
import toggle from './toggle'

export default {
  mixins: [cartCard],
  nodes() {
    return {
      card: {
        component: {
          src: card,
          proxies: {
            header: () => this.proxy._product.title,
            content: () => '$' + this.proxy._product.price
          }
        }
      },
      toggle: {
        component: {
          src: toggle,
          proxies: {
            quantity: () => this.proxy._product.quantity
          }
        }
      },
      price: {
        textContent: () => '$' + (this.proxy._product.price * this.proxy._product.quantity)
      }
    }
  }
}

// export default {
//     template:
//     `
//         <div>
//             <div class="cartExtend"></div>
//         </div>
//     `,
//     props: {
//         proxies: {
// _product: (v, check) => {
//     check(v.id, { type: 'number', default: 1, required: true})
// }
//         }
//         // proxies: {
//         //     _product: (v, f) => {
//         //         console.log(v)
//         //         f(v.id, { type: 'string' })

//         //         f(v, { store: product })
//         //     }
//         // },
//         // params: {
//         //     product: {
//         //         store: 'kakoy-nibut',
//         //         type: 'object',
//         //         validate: () => {

//         //         }
//         //     }
//         // }
//     },
//     nodes() {
//         return {
//             cartExtend: {
//                 component: {
//                     src: cartCard,
//                     proxies: {
//                         _product: () => this.proxy._product,
//                     },
//                     sections: {
//                         content: {
//                             src: toggle,
//                             proxies: {
//                                 quantity: () => this.proxy._product.quantity
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }
