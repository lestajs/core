import './index.css'

export default {
    template: `
        <div class="lstHdr l-fx l-gap">
            <div spot="left"></div>
            <div spot="center"></div>
            <div spot="right"></div>
        </div>`,
    spots: ['left', 'center', 'right'],
    // nodes() {
    //     return {
    //         left: {
    //             component: {}
    //         },
    //         center: {
    //             component: {}
    //         },
    //         right: {
    //             component: {}
    //         }
    //     }
    // }
}