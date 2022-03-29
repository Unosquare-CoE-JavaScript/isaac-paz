# 5 Advanced Shared Memory

- This chapter covers additional functionality for coordinating reads and writes to shared data across threads for situations when the previously covered Atomics methods just aren’t enough.

## Atomic Methods for Coordination

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

## Timing and Nondeterminism

- The Atomics.notify() function accepts an argument count that contains the number of threads to wake up. The glaring question in this situation is which threads get woken up and in which order?

### Example of Nondeterminism

- Threads are woken up in FIFO (first in, first out) order, meaning the first thread that called Atomics.wait() is the first to be woken up
- You should build your application in such a way that it continues to work fine regardless of the order in which threads have been awoken.

Example on this path 5.- Advanced Shared Memory (151)/ch5-notify-order

- In the example we can se that threads time out not by its time of creation but by its time of calling the method "await" and it it non deterministic, every time we execute the script it shows different results

## Detecting Thread Preparedness (165)

- How can an application deterministically know when a thread has finished going through initial setup and is thus prepared to take on work?
  - A simple way to do so is to call postMessage() from within the worker threads to post back to the parent thread at some point during the onmessage() handler. This works because once the onmessage() handler has been called the worker thread has finished its initial setup and is now running JavaScript code.
- Exercise - Example Path: 5.- Advanced Shared Memory (151)/ch5-notify-when-ready
- Chrome seems to have better order and performance about initializing the threads

## Example Application: Conway's Game of life

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
