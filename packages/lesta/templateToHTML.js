export default function templateToHTML(template, context) {
	const html = typeof template === 'function' ? template.bind(context)() : template
	const capsule = document.createElement('div')
	capsule.innerHTML = html.trim().replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '')
	return capsule.childNodes
}