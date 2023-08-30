async function performanceRating() {
  let rating = 0
  
  if (navigator.deviceMemory && navigator.deviceMemory >= 4) {
    rating += 3
  }
  
  if (navigator.connection && ['4g', '3g'].includes(navigator.connection.effectiveType)) {
    rating += 1.5
  }
  
  const battery = navigator.getBattery ? await navigator.getBattery() : null;
  if (battery && battery.charging) {
    rating += 1
  }
  if (battery && battery.level >= 0.8) {
    rating += 1
  }
  
  if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
    rating += 1
  }
  
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 4) {
    rating += 1.5
  }
  
  if ((typeof window.orientation !== 'undefined') || (navigator.userAgent.indexOf('IEMobile') !== -1)) {
    rating -= 1
  }
  
  rating = Math.max(0, Math.min(10, (rating / 10) * 10))
  
  return rating
}

export { performanceRating }
