let counter = 0

const ports = []

self.onconnect = (initEvent) => {
  const port = initEvent.source
  ports.push(port)
  
  port.onmessage = (event) => {
    counter += event.data
    ports.forEach((p) => p.postMessage(counter))
  }
}

// const worker = new SharedWorker(`worker.js`)
//
// btn.onclick = () => worker.port.postMessage(1)
//
// worker.port.onmessage = (event) => {
//   btn.textContent = event.data
// }
//
// worker.port.postMessage(0)