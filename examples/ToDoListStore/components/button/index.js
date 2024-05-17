export default {
	template: `<button></button>`,
	props: {
		params: {
			className: {
				default: ''
			}
		},
		proxies: {
			text: {}
		},
		methods: {
			action: {}
		}
	},
	nodes() {
		return {
			button: {
				selector: 'button',
				className: this.param.className,
				onclick: this.method.action,
				_text: () => this.proxy.text,
			}
		}
	},
	created() {
		console.log('button component')
	}
}