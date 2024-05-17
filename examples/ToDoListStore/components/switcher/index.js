import button from '../button'

export default {
	mixins: [button],
	props: {
		proxies: {
			disabled: {},
			active: {}
		}
	},
	nodes() {
		return {
			button: {
				_class: {
					active: () => this.proxy.active
				},
				disabled: () => this.proxy.disabled
			}
		}
	},
	created() {
		button.created()
		console.log('switcher component')
	}
}