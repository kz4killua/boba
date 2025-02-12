export class Runtime {

  worker: Worker;

  constructor() {
    this.worker = new Worker('/workers/runtime.js');
  }

  execute(code: string) {
    return new Promise((resolve, reject) => {
      this.worker.onmessage = (event) => {
        if (event.data.error) {
          reject({ ...event.data, error: `RuntimeError: ${event.data.error}` });
        } else {
          resolve(event.data);
        }
      }
      this.worker.onerror = (event) => {
        reject({ error: "RuntimeError: Please try refreshing the page." });
      }
      this.worker.postMessage({ code: code });
    });
  }
}
