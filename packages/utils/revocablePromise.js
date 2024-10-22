async function revocablePromise(promise, signal, aborted) {
	return new Promise((resolve, reject) => {
		const abortListener = () => {
			reject()
			aborted?.()
			signal.removeEventListener('abort', abortListener)
		}
		signal.addEventListener('abort', abortListener)
		if (signal.aborted) abortListener()
		promise.then(resolve).catch(reject)
	})
}

export { revocablePromise }