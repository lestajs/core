// HTML Sanitizer API
function cleanHTML(str) {
  
  function stringToHTML(str) {
    const capsule = document.createElement('capsule')
    capsule.innerHTML = str
    return capsule
  }
  
  function removeScripts(html) {
    const scripts = html.querySelectorAll('script')
    for (let script of scripts) {
      script.remove()
    }
  }
  
  function isPossiblyDangerous(name, value) {
    let val = value.replace(/\s+/g, '').toLowerCase()
    if (['src', 'href', 'xlink:href'].includes(name)) {
      if (val.includes('javascript:') || val.includes('data:text/html')) return true
    }
    if (name.startsWith('on')) return true
  }
  
  function removeAttributes(elem) {
    
    const atts = elem.attributes
    for (let {name, value} of atts) {
      if (!isPossiblyDangerous(name, value)) continue
      elem.removeAttribute(name)
    }
    
  }
  
  function clean(html) {
    const nodes = html.children
    for (let node of nodes) {
      removeAttributes(node)
      clean(node)
    }
  }
  
  const html = stringToHTML(str)
  removeScripts(html)
  clean(html)
  return html.childNodes
}

export { cleanHTML }