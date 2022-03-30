const express = require("express");
const Worker = require("worker_threads").Worker;
const app = express();

app.get("/", (req, res) => {
  let workerString = `
  const { parentPort, workerData } = require('worker_threads');

  function count(){
    let counter = 0;
    while(counter < 1e9){
     counter++;
    }
    return counter;
  }

  parentPort.postMessage(count());
  process.exit();
  `;
  const worker = new Worker(workerString, { eval: true });

  worker.on("message", function (counter) {
    res.send({ counter });
  });

  // worker.on("error");
  // worker.on("exit");
  // worker.on("messageerror");
  // worker.on("online");

  worker.postMessage(10);
});

app.get("/fast", (req, res) => {
  res.send("This was fast!");
});

app.listen(3000, () => console.log("app listening on port 3000"));
