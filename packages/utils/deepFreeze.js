function deepFreeze(obj) {
	if (obj === null || typeof obj !== 'object') return obj
	const frozenObjects = new WeakSet()
	function internalDeepFreeze(obj) {
		if (Object.isFrozen(obj) || !(obj instanceof Object)) return obj
		if (frozenObjects.has(obj)) return obj
		frozenObjects.add(obj)
		Object.freeze(obj)
		for (const key of Reflect.ownKeys(obj)) {
			const value = obj[key]
			if (value instanceof Object) internalDeepFreeze(value)
		}
		return obj
	}
	return internalDeepFreeze(obj)
}
export { deepFreeze }