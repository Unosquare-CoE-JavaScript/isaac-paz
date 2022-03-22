# 1 The internal of Nodejs

## 1 Nodejs Dependencies

- V8 - engine that allow nodejs to run outside a browser (Created by Google)
- libuv - Library written in c++ that allows nodejs to have access to the OS, Network, File system, of the host machine (Open project)

### Purpose

NodeJS give us the possibility to write javascript and it gives us also standard libraries to access low level functionalities on the machine without having to write them in c++

## 2 How Nodejs Modules is linked to C++

1.- NodeJS: Calls a Method from the standard library
2.- NodeJS LIB: call its method implementation that binds with a C++ library
3.- V8: Traduce all javascript definition so c++ can understand them(boolean, arrays, objects, etc)
4.- libuv: Handles concurrency,processing constructs on c++ side

## 3 Threads

### Definitions

- **Process**: is an instance of a computer program that can have many threads
- **Threads**: Set of instructions that need to be execute by the CPU of the computer
- **OS Scheduler**: Decides which thread should be processed at a given time (givin priority of urgent and critical threads)
- **CPU Core**: Component responsible to run task that are given by threads (One core can handle more than 2 Thread via a process called multi-threading)

## NodeJS Event loop

Node js run over one thread and inside that thread runs our Event Loop.

Pseudo Code that explains how NodeJS works

```
// node myFile.js

const pendingTimers = [];
const pendingOSTasks = [];
const pendingOperations = [];

// New timers, tasks, operations are recorded from myFile running
myFile.runContents();

function shouldContinue() {
  // Check one: Any pending setTimeout, SetInterval, setImmediate?
  // Check two: Any pending OS tasks? (like server listening to port)
  // Check three: Any pending long running operations? (like fs module)
  return (
    pendingTimers.length || pendingOSTasks.length || pendingOperations.length
  );
}

//Entire body executes in on 'tick'
while (shouldContinue()) {
  // 1) Node looks at pendingTimers and sees if any functions are ready to be called (setTimeout, setIntervals)

  // 2) Node looks at pendingOsTasks and pendingOperations and calls the relevant callback

  // 3) Pause execution. Continue when...
  // -> a new pendingOSTasks is done
  // -> a new pendingOperations is done
  // -> a timer is about to complete

  // 4)Look at pendingTimers. Call any setImmediate

  // 5) Handle any 'close' events
}

// exit back to terminal

```

### NodeJS is not single Threaded

Node **Event Loop** is single threaded
Some of Node Framework/Std Lib is **NOT** Single threaded (They run outside out event loop)

these heavily computations runs outside the event loop, Nodejs make use of a thing called the **Thread** pool that is a series of 4 Threads(by default) that nodejs has in order to run heavy tasks

You can **Set Thread Pool size** by the environment variable = UV_THREADPOOL_SIZE

**Some common question about Thread-Pool**

- Can we use the thread-pool for javascript code or can only nodejs functions use it - Yes we can
- How does this thread-pool stuff fit into the event loop - Tasks running in the thread-pool are the 'pendingOperations' in our code example.

### OS Operations

Some implementations of libuv does not make use of thread pool, thing like network request of the module https, make use of Operative system implementations to handle this concurrency in a async manner

**Some common questions**

- What functions in node std library use de OS's async features? - Almost everything around networking for all OS's. Some other stuff is OS specific
- How does this os async stuff fit into the event loop? - Tasks using the underlying OS are reflected in our 'pendingOSTasks' array
