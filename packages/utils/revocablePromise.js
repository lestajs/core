async function revocablePromise(promise, signal, aborted) {
	return new Promise((resolve, reject) => {
		const abortHandler = () => {
			reject()
			aborted?.()
			signal?.removeEventListener('abort', abortHandler)
		}
		signal?.addEventListener('abort', abortHandler)
		if (signal?.aborted) abortHandler()
		promise.then(resolve).catch(reject)
	})
}

export { revocablePromise }