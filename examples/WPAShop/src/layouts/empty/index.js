import header from '../../../UI/components/header';
import left from '../main/headerTemplates/left';
import right from '../main/headerTemplates/right';


export default {
    template: `
        <div class="header"></div>
        <div class="content main" router></div>
    `,
    nodes() {
        return {
            header: {
                component: {
                    src: header,
                    sections: {
                        left: {
                            src:  left,
                        },
                        right: {
                            src: right,
                        }
                    }
                }
            },
        }
    }
}