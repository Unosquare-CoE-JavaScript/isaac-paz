# Node.js

- Multi-threading is done using web workers
- Useful on nodejs tools like babel, typescript, heavy I/O

## Before We Had Threads

- Before worker-threads we had to use Processes
- If shared memory is not important(and in many cases it is not) then its perfectly fine to solve these problems with processes

We can use this approach of clustering our service in order to have multiple threads ready to execute code

```
const http = require('http');
const cluster = require('cluster');
if (cluster.isPrimary) { // Check if we are in the main thread to spawn the slave instances
  cluster.fork(); cluster.fork(); cluster.fork(); cluster.fork();
} else { // If wer are in a slave thread instantiate our server
http.createServer((req, res) => {
    res.end('Hello, World!\n');
  }).listen(3000);
}
```

- The primary process listen to the events on the designed port and when a request is coming tha main thread handle this request to one of the slave process
- Process do not share memory

## The worker_threads Module

- Nodejs has a built in module called worker_threads to support this functionality
- Inside Nodejs worker you can user usual Nodejs API available via requires, or import
- fex differences in the API compared to the main thread:
  - You can not exit the programm with process.exit()
  - you can not change working directories with process.chdir()
  - you can not handle signals with process.on()
- libuv worker pool is shared across worker threads
- If you’re finding yourself bound by that thread pool’s size, you’ll find that adding more threads via worker_threads won’t lighten the load

Spawning a worker on NodeJS:

```
const { Worker } = require('worker_threads');
const worker = new Worker('/path/to/worker-file-name.js');
```

### workerdata

- It is data that we pass to the worker in order to user use it
- It is not reference of the original object but a separated clone.
- You can have memory that’s shared between threads via SharedArrayBuffer

### MessagePort

- Is one end of a two-way data stream.
- its available in the worker thread as the parentPort property
  - postMesage() // Send data to the mainThread

```
Example 3-6. Bidirectional communication via MessagePort
created with MessageChannel
const { Worker,
  isMainThread,
  MessageChannel,
  workerData

} = require('worker_threads');
if (isMainThread) {
const { port1, port2 } = new MessageChannel(); const worker = new Worker(__filename, {
    workerData: {
      port: port2
},
    transferList: [port2]
  });
  port1.on('message', msg => {
    port1.postMessage(msg);
});
} else {
const { port } = workerData; port.on('message', msg => {
    console.log('We got a message from the main thread:', msg);
  });
  port.postMessage('Hello, World!');
}

```

## Happycoin: Revisited

- When running the single thread version of happy-coin.js it takes almost 2 minutes to complete the task (3.- Nodejs (102)/ch3-happycoin/happycoin.js)
- when running the multi-threaded version of happy-coin it takes about 30 seconds to finish the task 3.- Nodejs (102)/ch3-happycoin/happycoin-threads.js

## Worker Pools with Piscina

- Piscina module encapsulates the work of setting up a bunch of worker threads and allocating tasks to them. The name of the module comes from the Italian word for “pool.”

```
const Piscina = require('piscina');

if (!Piscina.isWorkerThread) {
const piscina = new Piscina({ filename: __filename }); piscina.run(9).then(squareRootOfNine => {
    console.log('The square root of nine is', squareRootOfNine);
  });
}

module.exports = num => Math.sqrt(num);
```

- If you run this code, you’ll get a nonrecoverable JavaScript memory allocation error.
- It turns out the underlying task queue is not infinite. By default, the task queue will keep growing and growing until we run into an allocation error like this one.
- The piscina module lets you set a limit by using a maxQueue option in its constructor
- we need to be able to handle it when the queue is full.
  - Compare the values of piscina.queueSize and piscina.options.maxQueue. If they’re equal, then the queue is full.
  - If piscina.run() is called when the queue is full, the returned promise will reject with an error indicating that the queue is full.
- Piscina pools emit a drain event once the queue is empty

The next example does not crash

```
const Piscina = require('piscina'); const assert = require('assert'); const { once } = require('events');

if (!Piscina.isWorkerThread) { const piscina = new Piscina({
    filename: __filename,
    maxQueue: 'auto'
  });
(async () => {
for (let i = 0; i < 10_000_000; i++) {
if (piscina.queueSize === piscina.options.maxQueue) { await once(piscina, 'drain');
      }
      piscina.run(i).then(squareRootOfI => {
assert.ok(typeof squareRootOfI === 'number'); });
} })();
}
```

## A Pool Full of Happy-coins

- To use piscina to produce Happycoins, we’ll use a slightly different approach from what we did in the original worker_threads implementation
- Instead of getting a message back every time we have a Happycoin, we’ll batch them together and send them all at once when we’re done.

```
const THREAD_COUNT = 4;
if (!Piscina.isWorkerThread) {
  const piscina = new Piscina({
    filename: __filename,
    minThreads: THREAD_COUNT,
    maxThreads: THREAD_COUNT,
  });
  let done = 0;
  let count = 0;
  for (let i = 0; i < THREAD_COUNT; i++) {
    (async () => {
      const { total, happycoins } = await piscina.run();
      process.stdout.write(happycoins);
      count += total;
      if (++done === THREAD_COUNT) {
        console.log("\ncount", count);
      }
    })();
  }
}

module.exports = () => {
  let happycoins = "";
  let total = 0;
  for (let i = 0; i < 10_000_000 / THREAD_COUNT; i++) {
    const randomNum = random64();
    if (isHappycoin(randomNum)) {
      happycoins += randomNum.toString() + " ";
      total++;
    }
  }
  return { total, happycoins };
};

```

- Full Example: 3.- Nodejs (102)/ch3-happycoin/happycoin-piscina.js
