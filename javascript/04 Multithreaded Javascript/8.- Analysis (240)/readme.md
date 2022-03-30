# 8 Analysis

- While this book provides a lot of use cases and reference material, at no point did it say “you should add multithreading to your application,” and there’s an important reason for this.
- By and large the main reason to add workers to an application is to increase performance. But this trade-off comes with a cost of added complexity. The KISS principle, meaning “Keep It Simple, Stupid,” suggests that your applications should be so stupidly simple that anyone can quickly look at the code and get an understanding of it.
- There are absolutely good reasons to add threads to an application, and as long as you’re measuring performance and confirming that speed gains outweigh added maintenance costs, then you’ve found yourself a situation deserving of threads.

## When Not to Use

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

## When to use

- Here are some of the most straightforward characteristics of such a problem to keep an eye out for:Here are some of the most straightforward characteristics of such a problem to keep an eye out for:
  - **Embarrassingly parallel**: This is a class of problems where a large task can be broken down into smaller tasks and very little or no sharing of state is required.
  - **Heavy math**: I/O heavy, or one that mostly deals with network operations.
  - **MapReduce-friendly problems**: MapReduce is a programming model that is inspired by functional programming. This model is often used for large- scale data processing that has been spread across many different machines. MapReduce is broken into two pieces. The first is Map, which accepts a list of values and produces a list of values. The second is Reduce, where the list of values are iterated on again, and a singular value is produced.
  - **Graphics processing**: A lot of graphics processing tasks also benefit from multiple threads. Much like the Game of Life problem, which operates on a grid of cells, images are represented as a grid of pixels. In both cases the value at each coordinate can be represented as a number,
- the rendering of a template might be done using a string that represents the raw template and an object that contains variables to modify the template. With such use cases there usually isn’t much global state to consider, just the two inputs, while a single string output is returned.

Example of template rendering use case: 8.- Analysis (240)/ch8-template-render/server.js

## Summary of Caveats

- This is a combined list of the aforementioned caveats when working with threads in JavaScript:

- **Complexity**: Applications tend to be more complex when using shared memory. This is especially true if you are hand-writing calls with Atomics and manually working with SharedBufferArray instances. Now, admittedly, a lot of this complexity can be hidden from the application through the use of a third-party module. In such a case it can be possible to represent your workers in a clean manner, communicating with them from the main thread, and having all the intercommunication and coordination abstracted away.
- **Memory overhead**: There is additional memory overhead with each thread that is added to a program. This memory overhead is compounded if a lot of modules are being loaded in each thread. Although the overhead might not be a huge deal on modern computers, it is worth testing on the end hardware the code will ultimately run on just to be safe. One way to help alleviate this issue is to audit the code that is being loaded in separate threads. Make sure you’re not unnecessarily loading the kitchen sink!
- **No shared objects**: The inability to share objects between threads can make it difficult to easily convert a single-threaded application to a multithreaded one. Instead, when it comes to mutating objects, you’ll need to pass messages around that end up mutating an object that lives in a single location.
- **No DOM access**: Only the main thread of a browser-based application has access to the DOM. This can make it difficult to offload UI rendering tasks to another thread. That said, it’s entirely possible for the main thread to be in charge of DOM mutation while additional threads can do the heavy lifting and return data changes to the main thread to update the UI.
- **Modified APIs**: Along the same lines as the lack of DOM access, there are slight changes to APIs available in threads. In the browser this means no calls to alert(), and individual worker types have even more rules, like disallowing blocking XMLHttpRequest#open() requests, localStorage restrictions, top-level await, etc
- **Structured clone algorithm constraints**: There are some constraints on the structured clone algorithm that may make it difficult to pass certain class instances between different threads. Currently, even if two threads have access to the same class definition, instances of the class passed between threads become plain Object instances. While it’s possible to rehydrate the data back into a class instance, it does require manual effort.
- **Browsers require special headers**: When working with shared memory in the browser via SharedArrayBuffer, the server must supply two additional headers in the request for the HTML document used by the page. If you have complete control of the server, then these headers may be easy to introduce. However, in certain hosting environments, it might be difficult or impossible to supply such headers. Even the package used in this book to host a local server required modifications to enable the headers.
- **thread preparedness detection**: There is no built-in functionality to know when a spawned thread is ready to work with shared memory. Instead, a solution must first be built that essentially pings the thread and then waits until a response has been received.
