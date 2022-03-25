# Introduction

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

## Hidden Threads

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
