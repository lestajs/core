export default function active(reactivity, ref, value) {
  const match = (str1, str2) => {
    const arr1 = str1.split('.')
    const arr2 = str2.split('.')
    for (let i = 0; i < arr2.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false
      }
    }
    return true
  }
  for (let [fn, refs] of reactivity) {
    if (Array.isArray(refs)) {
      if (refs.includes(ref)) fn(value)
    } else {
      if (match(ref,refs)) {
        const p = [...ref.split('.') || []]
        p.shift()
        fn(value, p)
      }
    }
  }
}