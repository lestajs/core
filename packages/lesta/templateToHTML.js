import { cleanHTML } from '../utils'

export default function templateToHTML(template, context) {
	const html = typeof template === 'function' ? template.bind(context)() : template
	return cleanHTML(html)
}