function replicate(data) {
  if (!data) return data ?? null
  return typeof data === 'object' ? JSON.parse(JSON.stringify(data)) : data
}

export { replicate }