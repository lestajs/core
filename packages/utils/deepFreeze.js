function deepFreeze(obj) {
	if (obj === null || typeof obj !== 'object') return obj
	const frozenObjects = new WeakSet()
	function internalDeepFreeze(o) {
		if (Object.isFrozen(o) || !(o instanceof Object)) return o
		if (frozenObjects.has(o)) return o
		frozenObjects.add(o)
		Object.freeze(o)
		for (const key of Reflect.ownKeys(o)) {
			const value = o[key]
			if (value instanceof Object) internalDeepFreeze(value)
		}
		return o
	}
	return internalDeepFreeze(obj)
}
export { deepFreeze }