import input from '../../../../../UI/components/input'
import './index.pcss'
import button from '../../../../../UI/components/button'

export default {
    template:
    `
        <div class="ship l-fx">
            <div class="name"></div>
            <div class="secname"></div>
            <div class="address"></div>
            <div class="email"></div>
            <div class="phone"></div>
            <div class="btn-wr">
                <div class="continueBtn"></div>
            </div>
        </div>
    `,
    nodes() {
        return {
            name: {
                component: {
                    src: input,
                    params: {
                        size: 'large',
                        attributes: {
                            placeholder: 'First name...'
                        }
                    }
                }
            },
            secname: {
                component: {
                    src: input,
                    params: {
                        size: 'large',
                        attributes: {
                            placeholder: 'Second name...'
                        }
                    }
                }
            },
            address: {
                component: {
                    src: input,
                    params: {
                        size: 'large',
                        attributes: {
                            placeholder: 'Address...'
                        }
                    }
                },
            },
            email: {
                component: {
                    src: input,
                    params: {
                        size: 'large',
                        attributes: {
                            placeholder: 'Email...'
                        }
                    }
                }
            },
            phone: {
                component: {
                    src: input,
                    params: {
                        size: 'large',
                        attributes: {
                            placeholder: 'Phone number...'
                        }
                    }
                }
            },
            continueBtn: {
                component: {
                    src: button,
                    proxies: {
                        value: 'Save & continue'
                    }
                }
            }
        }
    }
}