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
