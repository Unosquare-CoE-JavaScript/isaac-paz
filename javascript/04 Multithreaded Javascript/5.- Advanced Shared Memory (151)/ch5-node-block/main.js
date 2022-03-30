#!/usr/bin/env node
const http = require("http");
const view = new Int32Array(new SharedArrayBuffer(4));
setInterval(() => Atomics.wait(view, 0, 0, 1900), 2000);
const server = http.createServer((req, res) => {
  res.end("Hello World");
});
server.listen(1337, (err, addr) => {
  if (err) throw err;
  console.log("http://localhost:1337/");
});

//Every 2 seconds the app pauses for 1.9 seconds
