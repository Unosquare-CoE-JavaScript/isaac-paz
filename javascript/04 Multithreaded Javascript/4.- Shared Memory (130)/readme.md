# 4 Shared Memory

- We have only done so using message-passing APIs, ultimately depending on the familiar event loop to handle the receipt of a message. This is a much less performant system than the threading code you worked with C
- There are Two powerful tools available to your JavaScript applications: the Atomics object and the SharedArrayBuffer class to allows us to share memory between two threads with out depending on the event loop (message passing)

## Intro to Shared Memory

- For this example you will build a very basic application that is able to communicate between two web workers.

### Shared Memory in the Browser

- For security reasons (related to the Spectre CPU attack), the SharedArrayBuffer object isn’t always available for instantiation.

In the example: 4.- Shared Memory (130)/ch4-web-workers/main.js, further the initial value passed in the buffer, there has not been any other form of messaging between main and child thread, so it is possible to share memory between threads, but it is not guarantee

## Shared Memory in Node.JS

- You can share data via an buffer(SharedArrayBuffer) that its value is updated automatically on both threads
- Adding properties to the buffer array does not reflect on the others threads
- NodeJs equivalent of the previous application is mostly similar.
- See code example on 4.- Shared Memory (130)/ch4-node-workers/main_node.js
- It is mostly similar but worker global is not available on NodeJS, one should use worker_threads to get the parentPort and the worker class

## SharedArrayBuffer and TypedArrays

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

## Atomic Methods for Data Manipulation

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

## Atomicity Concerns

- Imagine you have a Uint8Array named typedArray, and the 0th element is set to 7. Then, imagine that multiple threads have access to that same typedArray to change its value
- Atomics guarantees that only one thread gets exclusive access to shared resources is called a critical section.
- If one thread of your application is using the compareExchange() method, and another thread is directly reading and writing to the same buffer location, then the safety mechanisms will have been defeated and your application will have nondeterministic behavior.
- Sadly, not all of the operations you’ll need to perform with shared memory can be represented using the Atomics methods. When that happens you’ll need to come up with a more manual locking mechanism

## Data Serialization

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

## Strings

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

## Objects

- Considering that objects can already be represented as strings using JSON, you do have the option of taking an object that you’d like to make use of across two threads, serializing it into a JSON string, and writing that string to an array buffer using the same TextEncoder API:
- const enc = new TextEncoder();
  return enc.encode(JSON.stringify(obj));

- JSON takes a JavaScript object and converts it into a string representation. When this happens, there are many redundancies in the output format. If you wanted to reduce the size of a payload even more, you could make use of a format like MessagePack,
- Performance trade-offs when communicating between threads is not usually due to the size of the payload being transferred, but is more than likely due to the cost of serializing and deserializing payloads. For that reason it’s usually better to pass simpler data representations between threads.
- If you do find yourself building an application that serializes and deserializes objects and writes them to a SharedArrayBuffer, you might want to reconsider some of the architecture of the application. You’re almost always better off finding a way to take objects that you’re passing around, serializing them using lower-level types, and passing those along instead.
