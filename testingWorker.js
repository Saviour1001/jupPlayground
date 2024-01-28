import { Worker, isMainThread, workerData, parentPort } from 'worker_threads';
import keys from "./output";

/* const totalWorkers = require('os').cpus().length - 2;
console.log(`Running with ${totalWorkers} worker(s).`); */

for (let i = 0; i < 6; i++) {
  const worker = new Worker("./test.js", { workerData: keys[i] });

  worker.on('message', async (result) => {
    console.log(result);
        console.log("Am In")
  });

  worker.on('error', (error) => {
    console.error('Worker error:', error);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker stopped with exit code ${code}`);
    }
  });
}
