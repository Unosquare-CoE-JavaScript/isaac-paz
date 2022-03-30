Index

- [1 Introduction](#1-introduction)
  - [1 Introduction](#1-introduction-1)
  - [2 What are Threads?](#2-what-are-threads)
  - [3 Concurrency Versus Parallelism](#3-concurrency-versus-parallelism)
  - [4 Single-Threaded Javascript](#4-single-threaded-javascript)
    - [Hidden Threads](#hidden-threads)
  - [5 Threads in C: Get Rich with Happpycoin](#5-threads-in-c-get-rich-with-happpycoin)
- [2 Browsers](#2-browsers)
  - [1 Dedicated Workers](#1-dedicated-workers)
  - [2 Advanced Dedicated Worker Usage](#2-advanced-dedicated-worker-usage)
  - [3 Shared Workers](#3-shared-workers)
  - [4 Advanced Shared Worker Usage](#4-advanced-shared-worker-usage)
  - [5 Service Workers](#5-service-workers)
  - [6 Service Worker Hello World](#6-service-worker-hello-world)
  - [7 Advanced Service Worker Concepts](#7-advanced-service-worker-concepts)
    - [States](#states)
  - [8 Message Passing Abstractions](#8-message-passing-abstractions)
    - [The RCP Pattern](#the-rcp-pattern)
    - [The Command Dispatcher Pattern](#the-command-dispatcher-pattern)
    - [Putting it all together](#putting-it-all-together)
- [3 Node.js](#3-nodejs)
  - [1 Before We Had Threads](#1-before-we-had-threads)
  - [2 The worker_threads Module](#2-the-worker_threads-module)
    - [workerdata](#workerdata)
    - [MessagePort](#messageport)
  - [3 Happycoin: Revisited](#3-happycoin-revisited)
  - [4 Worker Pools with Piscina](#4-worker-pools-with-piscina)
  - [5 A Pool Full of Happy-coins](#5-a-pool-full-of-happy-coins)
- [4 Shared Memory](#4-shared-memory)
  - [1 Intro to Shared Memory](#1-intro-to-shared-memory)
    - [Shared Memory in the Browser](#shared-memory-in-the-browser)
  - [2 Shared Memory in Node.JS](#2-shared-memory-in-nodejs)
  - [3 SharedArrayBuffer and TypedArrays](#3-sharedarraybuffer-and-typedarrays)
  - [4 Atomic Methods for Data Manipulation](#4-atomic-methods-for-data-manipulation)
  - [5 Atomicity Concerns](#5-atomicity-concerns)
  - [6 Data Serialization](#6-data-serialization)
    - [Booleans](#booleans)
  - [7 Strings](#7-strings)
  - [8 Objects](#8-objects)
- [5 Advanced Shared Memory](#5-advanced-shared-memory)
  - [1 Atomic Methods for Coordination](#1-atomic-methods-for-coordination)
  - [2 Timing and Nondeterminism](#2-timing-and-nondeterminism)
    - [Example of Nondeterminism](#example-of-nondeterminism)
  - [3 Detecting Thread Preparedness (165)](#3-detecting-thread-preparedness-165)
  - [4 Example Application: Conway's Game of life](#4-example-application-conways-game-of-life)
    - [Single-Threaded Game of Life](#single-threaded-game-of-life)
    - [Multi-Threaded Game of Life](#multi-threaded-game-of-life)
    - [Atomics and Events](#atomics-and-events)
- [6 Multithreaded Patterns](#6-multithreaded-patterns)
  - [1 Thread Pool](#1-thread-pool)
    - [Pool Size](#pool-size)
    - [Dispatch Strategies](#dispatch-strategies)
    - [Example implementation](#example-implementation)
  - [2 Mutex: A Basic Lock](#2-mutex-a-basic-lock)
  - [3 Streaming Data with Ring Buffers](#3-streaming-data-with-ring-buffers)
  - [4 Actor Model](#4-actor-model)
    - [Pattern Nuances](#pattern-nuances)
    - [Relating to javascript](#relating-to-javascript)
    - [Example Implementation](#example-implementation-1)
- [7 WebAssembly](#7-webassembly)
  - [1 Your First WebAssembly](#1-your-first-webassembly)
  - [2 Atomic Operaitons with WebAssembly](#2-atomic-operaitons-with-webassembly)
  - [3 Compiling C Programs to WebAssembly with Emscripten](#3-compiling-c-programs-to-webassembly-with-emscripten)
  - [4 Other WebAssembly Compilers](#4-other-webassembly-compilers)
  - [5 AssemblyScript](#5-assemblyscript)
  - [6 Happy-coin in AssemblyScript](#6-happy-coin-in-assemblyscript)
- [8 Analysis](#8-analysis)
  - [1 When Not to Use](#1-when-not-to-use)
    - [Low Memory Constraints](#low-memory-constraints)
    - [Low Core Count](#low-core-count)
    - [Containers Versus Threads](#containers-versus-threads)
  - [2 When to use](#2-when-to-use)
  - [3 Summary of Caveats](#3-summary-of-caveats)

# 1 Introduction

## 1 Introduction

- In the past computer only could run one program at time
- then multitasking was born and user start to run many programs a time
- Preemptive multitasking is the model that most computer use now, the OS determine which program would run on which cpu on a given time
- a Typical chunk of asynchronous javascript code using two different patters would be like this:

```
//Callback model
readFile(filename, (data) => {
  doSomethingWithData(data, (modifiedData) => {
    writeFile(modifiedData, () => {
      console.log('done');
}); });
});

// or Promise (Async Await syntax)
const data = await readFile(filename);
const modifiedData = await doSomethingWithData(data); await writeFile(filename);
console.log('done');
```

- Javascript threads does not have shared memory at least not directly
- Creating a new Thread and handling a message in a browser can be as simple as:

```
const worker = new Worker('worker.js'); worker.postMessage('Hello, world');
// worker.js
self.onmessage = (msg) => console.log(msg.data);
```

- Not every problem or CPU-intense problem should be solved with threads.
- **Goal of this book is give you the tools and the criteria to know when to use it and how**

## 2 What are Threads?

- A process runs on a single CPU on an assigned space of memory
- A process may spawn many threads
- A thread is like a process, except that it share memory space with the process that it belongs to
- Each thread has it own instruction pointer
- All the properties about execution of processes apply to threads (share a memory space, easy to share values between threads) this make them valuable than processes for concurrency, but at the cost fo some complexity
- A typical way to take advantage of this would be to offload CPU-intensive work to threads while the main thread is interacting with user or waiting to events, and when result is ready it takes it and return it to the user in the main thread
- To be useful threads need to be able to coordinate with each other, we do this with our shared memory space between threads.

## 3 Concurrency Versus Parallelism

- There are closely related terms that can mean very similar things depending on the circumstance
  - Concurrency
    - Tasks are run in overlapping time
    - It means that two task runs jumping from the execution from one to another but NOT at se same time
  - Parallelism
    - Tasks are run at exactly the same time
    - This is a subset of concurrency but with the difference that the two task are running at the same time in separated cores
- Threads do not automatically provide parallelism, hardware muy allow this by having multiples cores, scheduler decide tu run threads in separated CPU cores, and not having more threads than cores
- If you create multiple threads in a single core CPU there is no improvement of performance it might even perform worse

## 4 Single-Threaded Javascript

- In the past javascript did not provide any thread support
- Today it is possible but it does not have a built in solutions for that all that logic is implemented by environment-specific APIs's like other capabilities like network, devices, filesystem even system calls
- Javascript is written in a event-oriented manner operation on a single execution thread
- Callbacks is at its core how javascript manage asynchronous programming even in promises or async/await syntax
- Only one call stack is active at any given time

Example

```
import fs from 'fs/promises';
async function getNum(filename) {
return parseInt(await fs.readFile(filename, 'utf8'), 10);
}
try {
const numberPromises = [1, 2, 3].map(i => getNum(`${i}.txt`)); const numbers = await Promise.all(numberPromises); console.log(numbers[0] + numbers[1] + numbers[2]);
} catch (err) {
console.error('Something went wrong:'); console.error(err);
}
```

- Just because the promises are created and waited together, does not mean thar are run at the same time, it just mean their time frames are overlapping, there is only one instructor pointer, and only one instruction is being executed at a time
- In the absence of threads, there is only one javascript environment, one VM, one instruction pointer, one garbage collector
- That does not mean we are restricted to one global object, in node and browser we have realms
- Realms are instances of javascript environment as provided to javascript code, meaning each real get its own global object
- you can refer to global object as globalThis on modern version of node and browsers

On browser each iframe has its own realms that can be demonstrated in this example

```
const iframe = document.createElement('iframe');
document.body.appendChild(iframe);
const FrameObject = iframe.contentWindow.Object; // Global object inside iframe is accessible with the contentWindows property

console.log(Object === FrameObject);// Returns false
console.log(new Object() instanceof FrameObject); // Return false
console.log(FrameObject.name); //Have the same name property
```

- In NodeJS realms can be constructed with vm.createContext()
- realms in Nodejs are called context and all realms rules apply to context, with the exception that in context you do not have access to any global properties or anything else that might be in scope in your Node.js files, if you wants these features they need to be manually passed in to the context

Example of a creation of a context on Node.js

```
const vm = require('vm');
const ContextObject = vm.runInNewContext('Object');

console.log(Object === ContextObject);
console.log(new Object() instanceof ContextObject);
console.log(ContextObject.name);
```

**In any of these realm cases, we only still have one instruction pointer, and only code from one realm is running at a time, it is still a single threaded execution**

### Hidden Threads

- While our javascript code might run by default in a single thread, the process running our javascript uses many threads
- Modern javascript engines like V8 uses separated threads to handle garbage collector and other features that are not need to run in line with javascript execution
- NodeJS uses libuv as an OS dependency and it uses a pool of worker threads to avoid blocking program code when using otherwise-blocking APIs's (Filesystem for example)
- By default 4 of these thread are spawned, this number is configurable via the UV_THREADPOOL_SIZE env, with a value up to 1024
- it important to measure how many threads your application is spawning as many native addons in the nodejs ecosystem spawn their own as well.

## 5 Threads in C: Get Rich with Happpycoin

See Example 1./Introduction/Ch1-c-threads

- On one hand, it’s useful for splitting up computationally expensive tasks so that they can be run in parallel
- On the other hand, we need to ensure that some events are properly synchronized so that weird errors don’t occur
- You don’t want to have the
  complexity of threaded code in your application if it doesn’t turn out to give you any actual benefit so you have to measure the improvement

# 2 Browsers

- Javascript has multiple implementation from various engines like V8, SpiderMonkey and JavaScriptCore.
- Browser vendors try to implement Javascript the same way, but bugs do happen
- Other Api's are also added in each implementation to make the javascript that can be run even more powerful
- the most approachable of whish is the web worker
- Using these worker threads is beneficial for many reasons, but one that is particularly applicable to browsers is that, by offloading CPU-intensive work to a separate thread, the main thread is then able to dedicate more resources to rendering the UI.

## 1 Dedicated Workers

- Web workers allow you to spawn a new environment for executing JavaScript in
- Communication occurs between these two environments by using a pattern called message passing
- It’s possible for a JavaScript environment to spawn more than one web worker, and a given web worker is free to spawn even more web workers.
- There is more than one type of web worker, the simplest of which is the dedicated worker.

Example of creating a Web Worker

main.js

```
console.log("hello from main.js");

const worker = new Worker("worker.js"); // We pass the code to execute as a web worker
worker.onmessage = (msg) => { //Function define to handle the output of the web worker
  console.log("message received from worker", msg.data);
};
worker.postMessage("message sent to worker"); // Function that trigger the web worker
console.log("hello from end of main.js");

```

The self identifier is an alias for globalThis inside a web worker

```
console.log("hello from worker.js");
self.onmessage = (msg) => { // Function that runs when web worker is triggered
  console.log("message from main", msg.data);
  postMessage("message sent from worker");
};

```

**Rules to Web Worker Runs**

- The file that is loaded must be in the same origin that the main JavaScript environment is running in
- browsers won’t allow you to run dedicated workers when JavaScript runs using the file:// protocol, which is a fancy way of saying you can’t simply double-click the index.html file and view the application running. Instead, you’ll need to run your application from a web server.

## 2 Advanced Dedicated Worker Usage

- When it comes to dedicated workers, you can’t inject a script tag into the DOM because there’s no DOM associated with the worker.
- You can make use of the importScripts() function, accepts one or more arguments that represent the paths to scripts to be loaded, These scripts are loaded in a synchronous manner
- The Worker class provides the most important methods on the instance.
  - worker.postMessage(msg)
  - worker.onmessage
  - worker.onerror
  - worker.onmessageerror
  - worker.terminate()
- Some of the high-level communication APIs like XMLHttpRequest, WebSocket, and fetch() are available
- Useful functions that aren’t necessarily part of JavaScript but are rebuilt by every major engine, like setTimeout(), setInterval(), atob(), and btoa(), are also available
- The two data-storage APIs, localStorage and indexedDB, are available.

## 3 Shared Workers

This kind of worker can be referenced an shared between two different file, and the instance will always remain the same

- red.html includes worker
- blue.html includes worker

You can use this king of worker in order to kind of subscribe two pages into a one instance of the worker this allows you to send a message from the worker to all its page subscribers.

Code:

red.js

```
console.log("red.js");
const worker = new SharedWorker("shared-worker.js");
worker.port.onmessage = (event) => {
  console.log("EVENT", event.data);
};

```

blue.js

```
console.log("blue.js");
const worker = new SharedWorker("shared-worker.js");
worker.port.onmessage = (event) => {
  console.log("EVENT", event.data);
};

```

worker.js

```
const ID = Math.floor(Math.random() * 999999);
console.log("shared-worker.js", ID);
const ports = new Set();

self.onconnect = (event) => {

  //this port make reference to the new page connected to the worker
  const port = event.ports[0];
  ports.add(port);
  console.log("CONN", ID, ports.size);

// Send message to all page subscribed
  port.onmessage = (event) => {
    console.log("MESSAGE", ID, event.data);
    for (let p of ports) {
      p.postMessage([ID, event.data]);
    }
  };

};

```

## 4 Advanced Shared Worker Usage

- Also have access to the importScripts() function for loading external JavaScript files
- The shared worker instances do have access to a connect event, which can be handled with the self.onconnect() method

it is recommended that the array of port that keeps track of the connection would close before the page closes to do not interact with closed pages.

this can be done with this code

```
 // main JavaScript file
  window.addEventListener('beforeunload', () => {
    worker.port.postMessage('close');
});
```

```
port.onmessage = (event) => { i
  f (event.data === 'close') {
  ports.delete(port);
  return;
  }
  ...
}
```

The full constructor for the SharedWorker class looks like this:
`const worker = new SharedWorker(filename, nameOrOptions)'`

- On the name options you can pass different names on two or more scripts to create total different instances of workers referenced by its name
- When passed options it is the same options as the Dedicated Worker class

- You can create multiple instances of shared workers in a windows
- You can even create multiple shared workers that point to the same instance, When this happens, both of the SharedWorker instances’ .port properties are able to receive messages.
- These SharedWorker instances are definitely capable of maintaining state between page loads
- This state even persists through refreshes as long as one window remains open
- However, that state would be lost if both pages were refreshed simultaneously

## 5 Service Workers

- A service worker functions as a sort of proxy that sits between one or more web pages running in the browser and the server
- They are associated with potentiall y multiple pages
- A service worker can exist and run in the background even when a page isn’t necessarily still open.
- It does require a web page to be opened first to install the shared worker.
- It is commonly used with some network request to check for cached or do some computation on the result of the request
- It should not be used to offload CPU-intensive work to another thread
- Cannot access DOM
- It is only allow on web pages that has the protocol HTTPS
- It is not a good idea to store states ont his service workers because can fail and start at any moment
- Async Await syntax is not supported on service workers
-

## 6 Service Worker Hello World

```
let counter = 0;

//Great for doing first time configurations
self.oninstall = (event) => {
  console.log("service worker install");
};

//Great for doing some clean up code, for tearing down old version of caches
self.onactivate = (event) => {
  console.log("service worker activate");
  event.waitUntil(self.clients.claim());
};

self.onfetch = (event) => {
  // Would be called every time a network request is dene
  console.log("fetch", event.request.url);

  if (event.request.url.endsWith("/data.json")) {
    counter++;
    event.respondWith(
      new Response(JSON.stringify({ counter }), {
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
    return;
  }
  // fallback to normal HTTP request
  event.respondWith(fetch(event.request));
};

```

## 7 Advanced Service Worker Concepts

- Service workers are intended to only be used for performing asynchronous operations
- localStorage API is not available
- indexedDB is available
- Top-level await is disable
- Same api of onmessage and postmessage is available on this service worker

### States

- Parsed = The content of the javascript file has been parsed
- Installing = The installation has begun but is not yet complete
- Installed = At this point the installation is complete
- activating = This stat happens when onactivated is called but the event.respondsWith() promise has not yet resolved
- redundant= At this point, a newer version of the script has been loaded, and the previous script is no longer necessary

## 8 Message Passing Abstractions

### The RCP Pattern

- The RPC (Remote Procedure Call) pattern is a way to take a representation of a function and its arguments, serialize them, and pass them to a remote destination to have them get executed.
- This standard defines JSON representations of request and response objects as “notification” objects,

Problems with multiple request sends at the same time, you cannot relate what answer is corresponding to what call

```
worker.postMessage('square_sum|num:4');
  worker.postMessage('fibonacci|num:33');
  worker.onmessage = (result) => {
    // Which result belongs to which message?
    // '3524578'
    // 4.1462643
};
```

With JSON-RPC this is nota problem

```
// worker.postMessage
{"jsonrpc": "2.0", "method": "square_sum", "params": [4], "id": 1}
{"jsonrpc": "2.0", "method": "fibonacci", "params": [33], "id": 2}
// worker.onmessage
{"jsonrpc": "2.0", "result": "3524578", "id": 2} {"jsonrpc": "2.0", "result": 4.1462643, "id": 1}
```

### The Command Dispatcher Pattern

- The command dispatcher has a mechanism for determining what code path to execute on the receiving end
-

Example of a command dispatcher implementation

```
const commands = { square_sum(max) {
let sum = 0;
for (let i = 0; i < max; i++) sum += Math.sqrt(i); return sum;
  },
  fibonacci(limit) {
let prev = 1n, next = 0n, swap; while (limit) {
      swap = prev; prev = prev + next;
      next = swap; limit--;
    }
return String(next); }
};
function dispatch(method, args) {
if (commands.hasOwnProperty(method)) { //check if property exists
  return commands[method](...args);
}
throw new TypeError(`Command ${method} not defined!`); }

```

// The dispatch method take two arguments, the first one being the method and the second being the array of arguments

### Putting it all together

In this section we will mix JSON RPC and the command dispatcher pattern to end up with a way of working win web-workers easily

See Example of a completed implementation on /2.- Browsers (42)/ch2-patterns

# 3 Node.js

- Multi-threading is done using web workers
- Useful on nodejs tools like babel, typescript, heavy I/O

## 1 Before We Had Threads

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

## 2 The worker_threads Module

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

## 3 Happycoin: Revisited

- When running the single thread version of happy-coin.js it takes almost 2 minutes to complete the task (3.- Nodejs (102)/ch3-happycoin/happycoin.js)
- when running the multi-threaded version of happy-coin it takes about 30 seconds to finish the task 3.- Nodejs (102)/ch3-happycoin/happycoin-threads.js

## 4 Worker Pools with Piscina

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

## 5 A Pool Full of Happy-coins

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

# 4 Shared Memory

- We have only done so using message-passing APIs, ultimately depending on the familiar event loop to handle the receipt of a message. This is a much less performant system than the threading code you worked with C
- There are Two powerful tools available to your JavaScript applications: the Atomics object and the SharedArrayBuffer class to allows us to share memory between two threads with out depending on the event loop (message passing)

## 1 Intro to Shared Memory

- For this example you will build a very basic application that is able to communicate between two web workers.

### Shared Memory in the Browser

- For security reasons (related to the Spectre CPU attack), the SharedArrayBuffer object isn’t always available for instantiation.

In the example: 4.- Shared Memory (130)/ch4-web-workers/main.js, further the initial value passed in the buffer, there has not been any other form of messaging between main and child thread, so it is possible to share memory between threads, but it is not guarantee

## 2 Shared Memory in Node.JS

- You can share data via an buffer(SharedArrayBuffer) that its value is updated automatically on both threads
- Adding properties to the buffer array does not reflect on the others threads
- NodeJs equivalent of the previous application is mostly similar.
- See code example on 4.- Shared Memory (130)/ch4-node-workers/main_node.js
- It is mostly similar but worker global is not available on NodeJS, one should use worker_threads to get the parentPort and the worker class

## 3 SharedArrayBuffer and TypedArrays

- Represent a buffer of binary data that is of fixed length and cannot be resized.
- It can’t be directly modified. Instead, a “view” into the buffer must first be created.
- It inherit from Object and come with those associated methods.

Some basic interactions with an ArrayBuffer:

const ab = new ArrayBuffer(8); const view = new Uint8Array(ab)
for (i = 0; i < 8; i++) view[i] = i;
console.log(view);
// Uint8Array(8) [
// 0, 1, 2, 3,
// 4, 5, 6, 7
// ]
ab.byteLength; // 8
ab.slice(); // 0, 1, 2, 3, 4, 5, 6, 7
ab.slice(4, 6); // 4, 5
ab.slice(-3, -2); // 5

- Different JavaScript environments display the contents of an ArrayBuffer instance differently

  - Nodejs = list of hexadecimal pairs
  - Chrome v88 = expandable object with several different views
  - Firefox = won’t display the data, and will need to first be passed through a view.

  **Views**

- Due to the ambiguity of what binary data can mean, we need to use a view to read and write to the underlying buffer
- There are several of these views available in JavaScript. Each of these views extends from a base class called TypedArray.
- Classes extended from TypedArray
  - Int8Array
  - Uint8Array
  - Uint8ClampedArray
  - Int16Array
  - Uint16Array
  - Int32Array
  - Uint32Array
  - Float32Array
  - Float64Array
  - BigInt64Array
  - BigUint64Array
- When creating one of these views, the ArrayBuffer instance is passed into the constructor of the view. The buffer byte length must be a multiple of the element byte length used by the particular view that it’s being passed into.
- The U prefix to half of these classes refers to unsigned, which means that only positive
- The BigInt64Array and BigUint64Array entries also deserve some special attention. Unlike the other TypedArray views, which work with the Number type, these two variants work with the BigInt type
  - setting a value with these views must be done with a BigInt, and the values retrieved will also be of type BigInt.
- It is possible to pass more than one SharedArrayBuffer between threads, so if you find yourself needing to mix types, then you might benefit from having more than one buffer.

## 4 Atomic Methods for Data Manipulation

- Essentially, if an operation is atomic, it means that while the overall operation may be composed of multiple smaller steps, the overall operation is guaranteed to either entirely succeed or entirely fail.
- JavaScript provides a global object named Atomics with several static methods available on it.
  - Atomics.add() = This method adds the provided value to the existing value in a typedArray that is located at index.
  - Atomics.and() = This method performs a bitwise and using value with the existing value in typedArray located at index.
  - Atomics.compareExchange() = This method checks typedArray to see if the value oldExpectedValue is located at index.
  - Atomics.exchange() = This method sets the value in typedArray located at index to value.
  - Atomics.isLockFree() = This method returns a true if size is a value that appears as the BYTES_PER_ELEMENT for any of the TypedArray subclasses (usually 1, 2, 4, 8), and a false if otherwise.
  - Atomics.load() = This method returns the value in typedArray located at index.
  - Atomics.or() = This method performs a bitwise or using value with the existing value in typedArray located at index.
  - Atomics.store() = This method stores the provided value in typedArray located at index.
  - Atomics.sub() = This method subtracts the provided value from the existing value in typedArray that is located at index.
  - Atomics.xor() = This method performs a bitwise xor using value with the existing value in typedArray located at index.

## 5 Atomicity Concerns

- Imagine you have a Uint8Array named typedArray, and the 0th element is set to 7. Then, imagine that multiple threads have access to that same typedArray to change its value
- Atomics guarantees that only one thread gets exclusive access to shared resources is called a critical section.
- If one thread of your application is using the compareExchange() method, and another thread is directly reading and writing to the same buffer location, then the safety mechanisms will have been defeated and your application will have nondeterministic behavior.
- Sadly, not all of the operations you’ll need to perform with shared memory can be represented using the Atomics methods. When that happens you’ll need to come up with a more manual locking mechanism

## 6 Data Serialization

- Buffers are extremely powerful tools. That said, working with them from an entirely numeric point of view can start to get a little difficult. Sometimes you’ll need to store things that represent nonnumeric data using a buffer.
- When this happens you’ll need to serialize that data in some manner before writing it to the buffer, and you’ll later need to deserialize it when reading from the buffer.

### Booleans

- When storing data in individual bits like this, it’s best to start with the least significant bit, e.g., the bit farthest to the right labeled 0, then move on to more significant bits if you find yourself adding more booleans to the byte that you’re storing them in
- The reason for this is simple: as the number of booleans you need to store grows, so too will the size of the buffer, and existing bit locations should remain correct.

```
const buffer = new ArrayBuffer(1); const view = new Uint8Array(buffer); function setBool(slot, value) {
    view[0] = (view[0] & ~(1 << slot)) | ((value|0) << slot);
  }
function getBool(slot) {
return !((view[0] & (1 << slot)) === 0);
}

```

This code has some shortcomings and shouldn’t necessarily be used in production. For example, it isn’t meant for working with buffers that are larger than a single byte, and you’ll encounter undefined behavior when reading or writing to entries past 7. A production-ready version would consider the size of storage and do bounds checking, but that’s an exercise left to the reader.

## 7 Strings

- Best way to encode string is using utf-8 that takes up tu 14 bytes to represent an emoji, and also is backwards compatible with ASCII

```
 // Warning: Anti-pattern!
function stringToArrayBuffer(str) {
const buffer = new ArrayBuffer(str.length);
const view = new Uint8Array(buffer);
for (let i = 0; i < str.length; i++) {
      view[i] = str.charCodeAt(i);
    }
return view; }
  stringToArrayBuffer('foo'); // Uint8Array(3) [ 102, 111, 111 ] // CORRECT
  stringToArrayBuffer('€');   // Uint8Array(1) [ 172 ]/ Should be represented as 8364/

```

- An API is available to modern JavaScript for encoding and decoding strings directly to ArrayBuffer instances. This API is provided by the globals TextEncoder and TextDecoder

(With text encoder)

```
const enc = new TextEncoder();
enc.encode('foo'); // Uint8Array(3) [ 102, 111, 111 ] enc.encode('€'); // Uint8Array(3) [ 226, 130, 172 ]
```

And here’s how to decode such values:

```
const ab = new ArrayBuffer(3);
const view = new Uint8Array(ab);
view[0] = 226; view[1] = 130; view[2] = 172; const dec = new TextDecoder();
dec.decode(view); // '€'
  dec.decode(ab);   // '€'
```

## 8 Objects

- Considering that objects can already be represented as strings using JSON, you do have the option of taking an object that you’d like to make use of across two threads, serializing it into a JSON string, and writing that string to an array buffer using the same TextEncoder API:
- const enc = new TextEncoder();
  return enc.encode(JSON.stringify(obj));

- JSON takes a JavaScript object and converts it into a string representation. When this happens, there are many redundancies in the output format. If you wanted to reduce the size of a payload even more, you could make use of a format like MessagePack,
- Performance trade-offs when communicating between threads is not usually due to the size of the payload being transferred, but is more than likely due to the cost of serializing and deserializing payloads. For that reason it’s usually better to pass simpler data representations between threads.
- If you do find yourself building an application that serializes and deserializes objects and writes them to a SharedArrayBuffer, you might want to reconsider some of the architecture of the application. You’re almost always better off finding a way to take objects that you’re passing around, serializing them using lower-level types, and passing those along instead.

# 5 Advanced Shared Memory

- This chapter covers additional functionality for coordinating reads and writes to shared data across threads for situations when the previously covered Atomics methods just aren’t enough.

## 1 Atomic Methods for Coordination

- These methods only works on Int32Array and BigInt64Array instances and they only make sense when used with SharedArrayBuffer
- If you try to use these methods with the wrong type of TypedArray, you’ll get errors
- (These methods were developed inspired by this) Mutex can also be referred to as a lock, where one thread locks access to the data, does its thing, and then unlocks access, allowing another thread to then touch the data. A futex is built on two basic operations, one being “wait” and the other being “wake.”
- Atomics.wait()
  - status = Atomics.wait(typedArray, index, value, timeout = Infinity)
  - This method first checks typedArray to see if the value at index is equal to value. If it is not, the function returns the value not-equal. If the value is equal, it will then freeze the thread for up to timeout milliseconds. If nothing happens during that time, the function returns the value timed-out. On the other hand, if another thread calls Atomics.notify() for that same index within the time period, the function then returns with a value of ok.
- Atomics.notify()
  - awaken = `Atomics.notify(typedArray, index, count = Infinity)`
  - The Atomics.notify()1 method attempts to awaken other threads that have called Atomics.wait() on the same typedArray and at the same index. If any other threads are currently frozen, then they will wake up. Multiple threads can be frozen at the same time, each waiting to be notified. The count value then determines how many of them to awaken. The count value defaults to Infinity, meaning that every thread will be awakened.
- Atomics.waitAsync()
  - promise = Atomics.waitAsync(typedArray, index, value, timeout = Infinity)
  - This is essentially a promise-based version of Atomics.wait()
  - This method is essentially a less-performant, non-blocking version of Atomics.wait() that returns a promise which resolves the status of the wait operation.
  - Due to the loss of performance, it isn’t necessarily as useful for the hot-path of a CPU-heavy algorithm.
  - it can be useful in situations where a lock change is more convenient to signal another thread than to perform message-passing operations via postMessage()
  - Because this method doesn’t block the thread, it can be used in the main thread of an application.

## 2 Timing and Nondeterminism

- The Atomics.notify() function accepts an argument count that contains the number of threads to wake up. The glaring question in this situation is which threads get woken up and in which order?

### Example of Nondeterminism

- Threads are woken up in FIFO (first in, first out) order, meaning the first thread that called Atomics.wait() is the first to be woken up
- You should build your application in such a way that it continues to work fine regardless of the order in which threads have been awoken.

Example on this path 5.- Advanced Shared Memory (151)/ch5-notify-order

- In the example we can se that threads time out not by its time of creation but by its time of calling the method "await" and it it non deterministic, every time we execute the script it shows different results

## 3 Detecting Thread Preparedness (165)

- How can an application deterministically know when a thread has finished going through initial setup and is thus prepared to take on work?
  - A simple way to do so is to call postMessage() from within the worker threads to post back to the parent thread at some point during the onmessage() handler. This works because once the onmessage() handler has been called the worker thread has finished its initial setup and is now running JavaScript code.
- Exercise - Example Path: 5.- Advanced Shared Memory (151)/ch5-notify-when-ready
- Chrome seems to have better order and performance about initializing the threads

## 4 Example Application: Conway's Game of life

### Single-Threaded Game of Life

- Example: 5.- Advanced Shared Memory (151)/ch5-game-of-life/gol.html

### Multi-Threaded Game of Life

- Example: 5.- Advanced Shared Memory (151)/ch5-game-of-life/thread-gol.html

### Atomics and Events

- This pattern now allows applications to halt the execution of JavaScript, thereby causing the event loop to completely stop working.
- Because of this you can’t simply start throwing calls to make use of multi-threading into your application and expect it to work without problem
  - The main thread of the application should not call Atomics.wait()

Example of a node application being block with an Atomics.wait() function: 5.- Advanced Shared Memory (151)/ch5-node-block

- Don’t use Atomics.wait() in the main thread.
- Designate which threads are CPU-heavy and use lots of Atomics calls and which threads are evented.
- Consider using simple “bridge” threads to wait and post messages where appropriate.

# 6 Multithreaded Patterns

- By examining these patterns you’ll get a much better feel for how the applications you develop can benefit from multithreading.

## 1 Thread Pool

- Used in most multi-thread applications
- A thread pool is a collection of homogeneous worker threads that are each capable of carrying out CPU-intensive tasks that the application may depend on
- Workers is capable of carrying out the same work and each thread is just as capable as the other since they’re all running on the same machine.

**The first question when creating a thread pool is how many threads should be in the pool?**

### Pool Size

- Types of programs
  - those that run in the background, like a system daemon process, which ideally shouldn’t consume that many resources
  - Programs that run in the foreground that any given user is more likely to be aware of, like a desktop application or a web server
- the number of CPU cores available to the machine should be a determining factor for the number of threads
- A single CPU core will be handling the work of more than one thread.
- Each time a CPU core switches focus between programs—or threads of a program—a small context shift overhead comes into play. Because of this, having too many threads compared to the number of CPU cores can cause a loss of performance.
- Once you have determined the number of threads to use, you’re ready to determine how to dispatch work to the workers.

### Dispatch Strategies

- Because the goal of a thread pool is to maximize the work that can be done in parallel, it stands to reason that no single worker should get too much work to handle and no threads should be sitting there idle without work to do.
- A few strategies are often employed by applications to dispatch tasks to workers in a worker pool. These strategies draw parallels to those used by reverse proxies for the purpose of sending requests to backend services, List of the most common
  - Round robin: Go in order of the threads
  - Random: Pick a random thread to assign the task
  - Least busy: Pick the lest busy thread and assign a task to it

### Example implementation

- Example Path: 6.- Multithreaded Patterns (194)/ch6-thread-pool
  - Calls:
    - THREADS=3 STRATEGY=roundrobin node main.js
    - THREADS=3 STRATEGY=random node main.js

## 2 Mutex: A Basic Lock

- A mutually exclusive lock, or mutex, is a mechanism for controlling access to some shared data.
- A task acquires the lock in order to run code that accesses the shared data, and then releases the lock once it’s done.
- even thought atomics can block resources while working on the it is still possible to be broken example: 6.- Multi-threaded Patterns (194)/ch6-mutex/thread-product.js ()try at least 20 times or until it fails
- This allows us to operate datat on like any other typedArray
- path of the example: 6.- Multithreaded Patterns (194)/ch6-mutex/thread-product-multex.js

```
  const { i, shared } = workerData;
  const sharedInts = new Int32Array(shared);
  const mutex = new Mutex(sharedInts, 4);
  mutex.exec(() => {
    const a = sharedInts[i];
    for (let j = 0; j < 1_000_000; j++) {}
    const b = sharedInts[3];
    sharedInts[3] = a * b;
    assert.strictEqual(sharedInts[3], a * b);
  });
```

## 3 Streaming Data with Ring Buffers

- A ring buffer is an implementation of a first-in-first-out (FIFO) queue, implemented using a pair of indices into an array of data in memory. Crucially, for efficiency, when data is inserted into the queue, it won’t ever move to another spot in memory. Instead, we move the indices around as data gets added to or removed from the queue. The array is treated as if one end is connected to the other, creating a ring of data. This means that if these indices are incremented past the end of the array, they’ll go back to the beginning.
- Writing data moves the head forward, while reading data moves the tail forward

Example Path: 6.- Multithreaded Patterns (194)/ch6-ring-buffering/ring-buffer.js

## 4 Actor Model

- With this model an actor is a primitive container that allows for executing code. An actor is capable of running logic, creating more actors, sending messages to other actors, and receiving messages.
- The actor model is designed to allow computations to run in a highly parallelized manner without necessarily having to worry about where the code is running or even the protocol used to implement the communication.

### Pattern Nuances

- Although no two actors are able to write to the same piece of shared memory, they are free to mutate their own memory.
- Because there’s no shared memory involved, the actor model is able to avoid some of the multi-threading pitfalls discussed earlier
- Since actors handle a single task at a time they can often be implemented in a single- threaded fashion.
- while a single actor is only able to process a single task at a time, different actors are free to run code in parallel.

### Relating to javascript

- The actors that exist as first-class citizens in languages such as Erlang can’t be perfectly reproduced using JavaScript
- There are likely dozens of ways to draw parallels and implement actors, and this section exposes you to one of them
- One draw of the actor model is that actors don’t need to be limited to a single machine. This means that processes can run on more than one machine and communicate over the network
- Because there is no need to deal with shared memory between the different actors, the SharedArrayBuffer and Atomics objects can be largely ignored
- Actors require a message queue so that while one message is being processed another message can wait until the actor is ready
- JavaScript workers sort of handle this for us using the postMessage() method. Messages delivered in this manner wait until the current JavaScript stack is complete before grabbing the next message.
- If each actor is only running synchronous code, then this built-in queue can be used.
- On the other hand, if actors can perform asynchronous work, then a manual queue will need to be built instead.

### Example Implementation

- With the actor pattern, you shouldn’t think of the joined actors as external APIs. Instead, think of them as an extension of the program itself
- Although the individual actors within an actor process are chosen by which is least busy, the actor process itself is chosen randomly. This can lead to skewed workloads
- Actors aren’t addressable by other actors;
- A big benefit of this approach is that of resilience.
- Example Path: 6.- Multithreaded Patterns (194)/ch6-actors
  - `node server.js 127.0.0.1:8000 127.0.0.1:9000`
  - `node actor.js 127.0.0.1:9000`
  - `curl http://localhost:8000/99999`

# 7 WebAssembly

- Modern JavaScript runtimes also support WebAssembly and it is a binary-encoded instruction format that runs on a stack- based virtual machine.
- The main motivation behind having such a thing in browsers and other JavaScript runtimes is to run the parts of your program that are performance-sensitive in an environment where execution can happen much faster than JavaScript.
- Another goal is to provide a compile target for typically compiled languages like C, C++, and Rust. This opens the door for developers of those languages to develop for the web.
- Generally, the memory used by WebAssembly modules is represented by ArrayBuffers, but it can also be represented by SharedArrayBuffers.
- There are WebAssembly instructions for atomic operations, similar to the Atomics object we have in JavaScript.

## 1 Your First WebAssembly

- While WebAssembly is a binary format, a plain text format exists to represent it in human readable form.
- The language for this WebAssembly text format is simply called WebAssembly text format, but the file extension typically used is .wat,
- It uses S-expressions as its primary syntactic separator, which is helpful for both parsing and readability.
- We can’t pass whole arrays by value to WebAssembly functions or return them, but we can pass them by reference
- This means that to pass a string as an argument, we need to first allocate the bytes in the linear memory and write to them, then pass the index of the first byte to the WebAssembly function.
- Hand-writing WebAssembly in WAT, while clearly possible, isn’t usually the easiest path to being productive and getting performance gains with it. It was designed to be a compile target for higher-level languages, and that’s where it really shines. “Compiling C Programs to WebAssembly with Emscripten” explores that in more detail.

Example path: 7.- WebAssembly (222)/ch7-wasm-add/add.js

## 2 Atomic Operaitons with WebAssembly

- WebAssembly instructions often start with the type. In the case of atomic operations, the type is always i32 or i64, corresponding to 32-bit and 64-bit integers, respectively. All atomic operations have .atomic. next in the instruction name. After that, you’ll find the specific instruction name.
- Let’s go over some of the atomic operation instructions.
  - [i32|i64].atomic.[load|load8_u|load16_u|load32_u]
  - [i32|i64].atomic.[store|store8|store16|store32]
  - [i32|i64].atomic.[rmw|rmw8|rmw16|rmw32].[add|sub|and|or|xor|xchg|cmpxchg][|_u]
  - memory.atomic.[wait32|wait64]
  - memory.atomic.notify
  - atomic.fence
- When WebAssembly modules are initialized from JavaScript, they can be initialized with a linear memory provided as an option. This can be backed by a SharedArrayBuffer to enable usage across threads.
- it’s incredibly tedious and painstaking to write. Luckily, we can compile higher-level languages down to WebAssembly.

## 3 Compiling C Programs to WebAssembly with Emscripten

- Emscripten has been the go-to way to compile C and C++ programs for use in JavaScript environments. Today, it supports multithreaded C and C++ code using web workers in browsers and worker_threads in Node.js
- Indeed, the C code we wrote way back in Chapter 1 can be compiled without any editing!
- Emscripten supports the full suite of POSIX thread functionality and GNU Compiler Collection (GCC) built-in atomic operation functions.

```
docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) \
    emscripten/emsdk emcc happycoin-threads.c -pthread \
    -s PTHREAD_POOL_SIZE=4 -o happycoin-threads.js
```

## 4 Other WebAssembly Compilers

- WebAssembly was designed primarily as a compile target, rather than as a general- purpose language in its own right.
  - Clang/Clang++
  - Rust
  - AssemblyScript

## 5 AssemblyScript

- AssemblyScript is a subset of TypeScript that compiles to WebAssembly. Rather than compiling an existing langauge and providing implementations of existing system APIs, AssemblyScript was designed as a way to produce WebAssembly code with a much more familiar syntax than WAT.

Code Example

```
export function add(a: number, b: number): number {
  return a + b
}
```

can also use WebAssembly Types

```
export function add(a: i32, b: i32): i32 { return a + b
}
```

- AssemblyScript doesn’t provide the ability to spawn threads, but threads can be spawned in the JavaScript environment, and SharedArrayBuffers can be used for the WebAssembly memory.
- it supports atomic operations via a global atomics object

## 6 Happy-coin in AssemblyScript

Example Path: 7.- WebAssembly (222)/ch7-happycoin-as

- AssemblyScript doesn’t provide a way of spawning threads on its own, we’ll need to do that from JavaScript.
- "\_\_getArray" function, provided by the loader, converts that pointer into a JavaScript array, which we can then use as normal.

# 8 Analysis

- While this book provides a lot of use cases and reference material, at no point did it say “you should add multithreading to your application,” and there’s an important reason for this.
- By and large the main reason to add workers to an application is to increase performance. But this trade-off comes with a cost of added complexity. The KISS principle, meaning “Keep It Simple, Stupid,” suggests that your applications should be so stupidly simple that anyone can quickly look at the code and get an understanding of it.
- There are absolutely good reasons to add threads to an application, and as long as you’re measuring performance and confirming that speed gains outweigh added maintenance costs, then you’ve found yourself a situation deserving of threads.

## 1 When Not to Use

- Threading is not a magic bullet capable of solving an application’s performance problems. It is usually not the lowest-hanging fruit when it comes to performance, either, and should often be done as a final effort.
- This is particularly true in JavaScript, where multithreading isn’t as widely understood
- Adding threading support may require heavy changes to an application
- first hunt down other code inefficiencies first.

### Low Memory Constraints

- There is some additional memory overhead incurred when instantiating multiple threads in JavaScript.
- t could be a hindrance if you’re running code on an embedded ARM device with 512 MB of RAM or donated netbooks in a K–12 classroom.

### Low Core Count

- When creating an additional thread, the application now has at least two threads (the main and the worker), and the two threads will compete with each other for attention.
- There is additional overhead when it comes to communicating between threads.
- You probably shouldn’t build an app that takes advantage of your beefy multi-core developer laptop and then ship it to production where a container orchestrator limits the app to a single core.
- You can use taskset to limit the number of CPU cores that an application can use in order to see benefits or running on 1 or multiples cores: `THREADS=2 STRATEGY=leastbusy taskset -c 0 node main.js `
- In order to find the balance between cores an threads that most take advantage on your applications you should measure via some tool like taskset

### Containers Versus Threads

- The rule of thumb is that processes should scale horizontally. This is a fancy term meaning you should run multiple redundant versions of the program in an isolated manner
- While adding additional processes instead of increasing thread count increases overall resource consumption, not to mention the overhead of wrapping processes in a container, larger companies usually prefer the scaling flexibility of this approach.

## 2 When to use

- Here are some of the most straightforward characteristics of such a problem to keep an eye out for:Here are some of the most straightforward characteristics of such a problem to keep an eye out for:
  - **Embarrassingly parallel**: This is a class of problems where a large task can be broken down into smaller tasks and very little or no sharing of state is required.
  - **Heavy math**: I/O heavy, or one that mostly deals with network operations.
  - **MapReduce-friendly problems**: MapReduce is a programming model that is inspired by functional programming. This model is often used for large- scale data processing that has been spread across many different machines. MapReduce is broken into two pieces. The first is Map, which accepts a list of values and produces a list of values. The second is Reduce, where the list of values are iterated on again, and a singular value is produced.
  - **Graphics processing**: A lot of graphics processing tasks also benefit from multiple threads. Much like the Game of Life problem, which operates on a grid of cells, images are represented as a grid of pixels. In both cases the value at each coordinate can be represented as a number,
- the rendering of a template might be done using a string that represents the raw template and an object that contains variables to modify the template. With such use cases there usually isn’t much global state to consider, just the two inputs, while a single string output is returned.

Example of template rendering use case: 8.- Analysis (240)/ch8-template-render/server.js

## 3 Summary of Caveats

- This is a combined list of the aforementioned caveats when working with threads in JavaScript:

- **Complexity**: Applications tend to be more complex when using shared memory. This is especially true if you are hand-writing calls with Atomics and manually working with SharedBufferArray instances. Now, admittedly, a lot of this complexity can be hidden from the application through the use of a third-party module. In such a case it can be possible to represent your workers in a clean manner, communicating with them from the main thread, and having all the intercommunication and coordination abstracted away.
- **Memory overhead**: There is additional memory overhead with each thread that is added to a program. This memory overhead is compounded if a lot of modules are being loaded in each thread. Although the overhead might not be a huge deal on modern computers, it is worth testing on the end hardware the code will ultimately run on just to be safe. One way to help alleviate this issue is to audit the code that is being loaded in separate threads. Make sure you’re not unnecessarily loading the kitchen sink!
- **No shared objects**: The inability to share objects between threads can make it difficult to easily convert a single-threaded application to a multithreaded one. Instead, when it comes to mutating objects, you’ll need to pass messages around that end up mutating an object that lives in a single location.
- **No DOM access**: Only the main thread of a browser-based application has access to the DOM. This can make it difficult to offload UI rendering tasks to another thread. That said, it’s entirely possible for the main thread to be in charge of DOM mutation while additional threads can do the heavy lifting and return data changes to the main thread to update the UI.
- **Modified APIs**: Along the same lines as the lack of DOM access, there are slight changes to APIs available in threads. In the browser this means no calls to alert(), and individual worker types have even more rules, like disallowing blocking XMLHttpRequest#open() requests, localStorage restrictions, top-level await, etc
- **Structured clone algorithm constraints**: There are some constraints on the structured clone algorithm that may make it difficult to pass certain class instances between different threads. Currently, even if two threads have access to the same class definition, instances of the class passed between threads become plain Object instances. While it’s possible to rehydrate the data back into a class instance, it does require manual effort.
- **Browsers require special headers**: When working with shared memory in the browser via SharedArrayBuffer, the server must supply two additional headers in the request for the HTML document used by the page. If you have complete control of the server, then these headers may be easy to introduce. However, in certain hosting environments, it might be difficult or impossible to supply such headers. Even the package used in this book to host a local server required modifications to enable the headers.
- **thread preparedness detection**: There is no built-in functionality to know when a spawned thread is ready to work with shared memory. Instead, a solution must first be built that essentially pings the thread and then waits until a response has been received.
