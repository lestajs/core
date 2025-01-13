function escHtml(unsafe) {
	return unsafe
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#x27;')
	.replace(/`/g, '&#x60;')
	.replace(/=/g, '&#x3D;')
}
 export { escHtml }