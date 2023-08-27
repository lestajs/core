export default function() {
  let rating = 5;
  
  if (navigator.deviceMemory) {
  const deviceMemory = navigator.deviceMemory;
  if (deviceMemory >= 4) {
    rating += 2;
  }
}

if (navigator.connection && navigator.connection.effectiveType) {
  const internetSpeed = navigator.connection.effectiveType;
  if (internetSpeed === '4g' || internetSpeed === '3g') {
    rating += 1;
  }
}

const battery = navigator.getBattery ? navigator.getBattery() : null;
if (battery) {
  if (battery.charging) {
    rating += 1;
  }
  if (battery.level >= 0.8) {
    rating += 1;
  }
}

if (window.matchMedia) {
  const mediaQueryList = window.matchMedia('(display-mode: standalone)');
  if (mediaQueryList.matches) {
    rating += 1;
  }
}

// Add additional checks
if (window.navigator.hardwareConcurrency) {
  const cpuCores = window.navigator.hardwareConcurrency;
  if (cpuCores >= 4) {
    rating += 1;
  }
}

// Apply a formula for more efficient rating calculation
rating = (rating / 10) * 10;

return rating;
}
