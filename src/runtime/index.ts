export class Runtime {

  worker: Worker;

  constructor() {
    this.worker = new Worker('/runtime/worker.js');
  }

  execute(code: string) {
    return new Promise((resolve, reject) => {
      this.worker.onmessage = (event) => {
        if (event.data.error) {
          reject(event.data);
        } else {
          resolve(event.data);
        }
      }
      this.worker.onerror = (event) => {
        reject(event);
      }
      this.worker.postMessage({ code: code });
    });
  }
}
