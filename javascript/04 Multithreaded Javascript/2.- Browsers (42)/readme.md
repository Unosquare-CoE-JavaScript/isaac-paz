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

## Advanced Shared Worker Usage

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

## Service Workers

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

## Service Worker Hello World

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

## Advanced Service Worker Concepts

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

## Message Passing Abstractions

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
