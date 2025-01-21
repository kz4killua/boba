self.onmessage = function(event) {
  // Override console.log to capture logs
  const logs = [];
  console.log = function (...args) {
    logs.push(args.join(' '));
  }
  // Execute the supplied code
  try {
    const result = eval(event.data.code);
    self.postMessage({ result: result, logs: logs });
  } catch (error) {
    self.postMessage({ error: error.message, logs: logs });
  }
}