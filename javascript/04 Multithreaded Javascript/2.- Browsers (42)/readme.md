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

- You can create multiple intances of shared workers in a windows
- You can even create multiple shared workers that point to the same instance, When this happens, both of the SharedWorker instances’ .port properties are able to receive messages.
- These SharedWorker instances are definitely capable of maintaining state between page loads
- This state even persists through refreshes as long as one window remains open
- However, that state would be lost if both pages were refreshed simultaneously

## Service Workers
