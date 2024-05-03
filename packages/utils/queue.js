const queue = () => {
  const funcQueue = []
  let processing = false
  
  const size = () => funcQueue.length
  const isEmpty = () => funcQueue.length === 0
  
  const add = (fn) => {
    funcQueue.push(fn)
    if (!processing) {
      processing = true
      next()
    }
  }
  
  const next = async () => {
    const action = funcQueue.at(0)
    if (action) {
      await action()
      funcQueue.shift()
      next()
    } else {
      processing = false
    }
  }
  
  return { add, isEmpty, size }
}

export { queue }

// class Queue {
//   _queue = Promise.resolve();
//
//   enqueue(fn) {
//     const result = this._queue.then(fn);
//     this._queue = result.then(() => {}, () => {});
//
//     // we changed return result to return result.then()
//     // to re-arm the promise
//     return result.then();
//   }
//
//   wait() {
//     return this._queue;
//   }
// }


// class Queue {
//   constructor() {
//     this.queue = [];
//     this.running = false;
//   }
//   size() {
//     return this.queue.length
//   }
//   isEmpty() {
//     return this.queue.length === 0
//   }
//   add(fn) {
//     return new Promise((resolve, reject) => {
//       const action = async () => {
//         try {
//           const result = await fn();
//           resolve(result);
//         } catch (error) {
//           reject(error);
//         }
//       };
//
//       this.queue.push(action);
//
//       if (!this.running) {
//         this.running = true;
//         this.next();
//       }
//     });
//   }
//   async next() {
//     if (this.isEmpty()) return this.running = false
//     const action = this.queue.shift()
//     await action()
//     this.next()
//   }
// }