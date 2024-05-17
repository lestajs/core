function mapComponent(fn) {
	const res = { params: {}, proxies: {}, methods: {}, spots: {} }
	fn(res)
	return res
}

export { mapComponent }