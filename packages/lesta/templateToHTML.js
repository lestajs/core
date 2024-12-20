export default function templateToHTML(template, context) {
	const html = typeof template === 'function' ? template.bind(context)() : template
	const parser = new DOMParser()
	const doc = parser.parseFromString(html, 'text/html')
	return doc.childNodes
}