# 2 Enhancing Node Performance

Some times we have to do a lot of work on the event loop and there is no other way to do it, so we have two ways of make nodejs performance better

- Use Node in 'Cluster' Mode (Create multiples copies of node app running) (Recommended)
- Use Worker Threads (Experimental)

## 1 Clustering

some function like the example can block the event loop in case we have a really heavy cpu processing on a function and we cannot move it elsewhere we could use of clustering

```
function doWork(duration) {
  const start = Date.now();
  while (Date.now() - start < duration) {}
}
```

### How it works

There is a cluster manager who launch many instances of our application that are running on independent Threads so therefore we have many instances of our event loop of the same application

Example

```
//Is the file being executed in master mode?
if (cluster.isMaster) {
  //Cause index.js to be executed *again*
  //but in child mode
  cluster.fork();
  cluster.fork();
  cluster.fork();
  cluster.fork();
} else {
  //Im a child, im going to act like a server
  //and do nothing else
  const express = require("express");
  ...
}
```

**Important node of creating too many child process with clustering**
Depending on the specification of the hardware if we create many children we are going
to handle more tasks at the same time but because we are working in parallel jumping from one task to another the average time until we can give a response to each client is going to suffer and be longer. so there is an optimal number of children to create in clustering to not suffer for this average response time increase

**Tip**
You should try to not create more children that your physical o logical number of cores on your computer

### PM2 instance handler

There is a open source project that has an incredible implementation on this child managing.
it also has the capability if one of your instances fail it automatically restarts it for you

install it with `npm i -g pm2`

- `pm2 start <filename> -i <numberOfInstances>` = Start a project if you put 0 the -i param it create you the number of logical cores your machine has
- `pm2 list` = shows all running instances
- `pm2 show <appName>` = shows detailed data of all your instances of that app
- `pm2 monit` = shows you a terminal graphical interface to check info about all your running instances

## 2 WebWorker Threads

WebWorkers allows us to delegate our code to the thread-pool

It is not recommended to use both of these tricks inside one application at a time.

Here it is a example or worker_threads recently implemented on nodejs standard library

```
app.get("/", (req, res) => {

  //We can also write code in a separated file and called it from the constructor instead ///of writing it on a string
  let workerString = `
  //import parentPort(Channel of communication)
  //import workerData(Data passed from main thread to this worker via worker.postMessage(data))
  const { parentPort, workerData } = require('worker_threads');

  function count(){
    let counter = 0;
    while(counter < 1e9){
     counter++;
    }
    return counter;
  }

  //Send result to main thread returning the result of executing our function
  parentPort.postMessage(count());
  //Closing the thread with status 0
  process.exit();
  `;

  const worker = new Worker(workerString, { eval: true });

  //Getting data on message event
  worker.on("message", function (counter) {
    res.send({ counter });
  });

  //There is also more events to listens to
  // worker.on("error");
  // worker.on("exit");
  // worker.on("messageerror");
  // worker.on("online");

  //Initiate the worker sending some data
  worker.postMessage(10);
});
```
