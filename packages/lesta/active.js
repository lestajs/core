export default function active(reactivity, ref, value) {
  if (!reactivity) return
  const match = (str1, str2) => {
    const min = Math.min(str1.length, str2.length)
    return str1.slice(0, min) === str2.slice(0, min)
  }
  for (let [fn, refs] of reactivity) {
    if (Array.isArray(refs)) {
      if (refs.includes(ref)) fn(value)
    } else if (match(ref,refs)) {
      fn(value, ref.length > refs.length ? ref.replace(refs + '.', '') : undefined) // .split('.')
    }
  }
}