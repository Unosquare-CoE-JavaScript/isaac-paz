# 7 WebAssembly

- Modern JavaScript runtimes also support WebAssembly and it is a binary-encoded instruction format that runs on a stack- based virtual machine.
- The main motivation behind having such a thing in browsers and other JavaScript runtimes is to run the parts of your program that are performance-sensitive in an environment where execution can happen much faster than JavaScript.
- Another goal is to provide a compile target for typically compiled languages like C, C++, and Rust. This opens the door for developers of those languages to develop for the web.
- Generally, the memory used by WebAssembly modules is represented by ArrayBuffers, but it can also be represented by SharedArrayBuffers.
- There are WebAssembly instructions for atomic operations, similar to the Atomics object we have in JavaScript.

## Your First WebAssembly

- While WebAssembly is a binary format, a plain text format exists to represent it in human readable form.
- The language for this WebAssembly text format is simply called WebAssembly text format, but the file extension typically used is .wat,
- It uses S-expressions as its primary syntactic separator, which is helpful for both parsing and readability.
- We can’t pass whole arrays by value to WebAssembly functions or return them, but we can pass them by reference
- This means that to pass a string as an argument, we need to first allocate the bytes in the linear memory and write to them, then pass the index of the first byte to the WebAssembly function.
- Hand-writing WebAssembly in WAT, while clearly possible, isn’t usually the easiest path to being productive and getting performance gains with it. It was designed to be a compile target for higher-level languages, and that’s where it really shines. “Compiling C Programs to WebAssembly with Emscripten” explores that in more detail.

Example path: 7.- WebAssembly (222)/ch7-wasm-add/add.js

## Atomic Operaitons with WebAssembly

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

## Compiling C Programs to WebAssembly with Emscripten

- Emscripten has been the go-to way to compile C and C++ programs for use in JavaScript environments. Today, it supports multithreaded C and C++ code using web workers in browsers and worker_threads in Node.js
- Indeed, the C code we wrote way back in Chapter 1 can be compiled without any editing!
- Emscripten supports the full suite of POSIX thread functionality and GNU Compiler Collection (GCC) built-in atomic operation functions.

```
docker run --rm -v $(pwd):/src -u $(id -u):$(id -g) \
    emscripten/emsdk emcc happycoin-threads.c -pthread \
    -s PTHREAD_POOL_SIZE=4 -o happycoin-threads.js
```

## Other WebAssembly Compilers

- WebAssembly was designed primarily as a compile target, rather than as a general- purpose language in its own right.
  - Clang/Clang++
  - Rust
  - AssemblyScript

## AssemblyScript

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

## Happy-coin in AssemblyScript

Example Path: 7.- WebAssembly (222)/ch7-happycoin-as

- AssemblyScript doesn’t provide a way of spawning threads on its own, we’ll need to do that from JavaScript.
- "__getArray" function, provided by the loader, converts that pointer into a JavaScript array, which we can then use as normal.
