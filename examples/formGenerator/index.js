import '../UI/components/ui.css'
import './styles.css'
import { createApp } from 'lesta'
import main from './components/main'
import form from './stores/form'

const app = createApp({
    root: document.querySelector('#root'),
    stores: { form }
})

app.mount(main)