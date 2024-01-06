import image from '../image'
import './index.css'

export default {
    template: `<div><div class="LstMiniAva"></div></div>`,
    props: {
        proxies: {
            url: {}
        },
        params: {
            width: {
                default: '32px'
            },
            height: {
                default: '32px'
            }
        }
    },
    nodes() {
        return {
            LstMiniAva: {
                component: {
                    src: image,
                    proxies: {
                        url: () => this.proxy.url
                    },
                    params: {
                        width: this.param.width,
                        height: this.param.height,
                        attitude: 1
                    }
                }
            }
        }
    }
}