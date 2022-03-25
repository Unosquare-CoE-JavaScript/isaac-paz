# Index

- [Index](#index)
- [1 The internal of Nodejs](#1-the-internal-of-nodejs)
  - [1 Nodejs Dependencies](#1-nodejs-dependencies)
    - [Purpose](#purpose)
  - [2 How Nodejs Modules is linked to C++](#2-how-nodejs-modules-is-linked-to-c)
  - [3 Threads](#3-threads)
    - [Definitions](#definitions)
  - [4 NodeJS Event loop](#4-nodejs-event-loop)
    - [NodeJS is not single Threaded](#nodejs-is-not-single-threaded)
    - [OS Operations](#os-operations)
- [2 Enhancing Node Performance](#2-enhancing-node-performance)
  - [1 Clustering](#1-clustering)
    - [How it works](#how-it-works)
    - [PM2 instance handler](#pm2-instance-handler)
  - [2 WebWorker Threads](#2-webworker-threads)
- [3 Data Caching with Redis](#3-data-caching-with-redis)
  - [1 Caching layer](#1-caching-layer)
    - [Cache Server](#cache-server)
  - [2 Installing redis](#2-installing-redis)
    - [Setting values on Nodejs](#setting-values-on-nodejs)
    - [Example of an implementation of Cache on mongo](#example-of-an-implementation-of-cache-on-mongo)
- [4 Automated Headless Browser Testing](#4-automated-headless-browser-testing)
  - [1 Differences between Unit testing an Integration testing](#1-differences-between-unit-testing-an-integration-testing)
  - [2 Puppeteer](#2-puppeteer)
    - [Common Object and methods](#common-object-and-methods)
  - [3 Jest](#3-jest)
    - [Setup](#setup)
    - [Common methods](#common-methods)
  - [4 Factories](#4-factories)
  - [5 Helpers and Proxy](#5-helpers-and-proxy)
    - [Proxy](#proxy)
- [5 Continuos Integration](#5-continuos-integration)
  - [1 CI Flow](#1-ci-flow)
    - [CI Providers](#ci-providers)
  - [2 Set Up](#2-set-up)
- [6 Scalable Image File Upload](#6-scalable-image-file-upload)
  - [1 Implementations](#1-implementations)
    - [Code to Generate pre-signed URL](#code-to-generate-pre-signed-url)
    - [AWS Configuration](#aws-configuration)

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

## 4 NodeJS Event loop

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

# 3 Data Caching with Redis

Databases usually have implemented indexes when consulting data, but on other hand when we request data via some particular fields that do not have an index it turns to be pretty expensive in terms of efficiency.

It can seem obvious that the answer would be create more indexes but it will also make slower to write data to the collection, and not all the time we know for sure what field we are going to use to request data.

Se have to come up with a different solution

## 1 Caching layer

### Cache Server

It saves the result of a query that have been execute before with those parameters to return the result of the query without running the query to the database, Making our API faster.

It is very fast because it saves data in a key value pair logic so it does not need a search algorithm

**Redis memory is volatile meaning if the server restart all data disappear, se we use it to save data that is not that critical**

To interact with this server we are going to install a library called node-redis

## 2 Installing redis

- Via brew execute the following
  `brew install redis`

- Once finished the installation start the service:
  `brew services start redis`

- check if server is running
  `redis_cli ping`
  it should return a 'PONG' message to know that server is running

### Setting values on Nodejs

**Create a Client**

```
const redis = require("redis");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
```

**Key Value pair Data**
client.set('key', 'value');
client.get('key', (err,val) => console.log(err,val))

**Nested Key value pair**
client.hset('key', 'key2','value');
client.hget('key', 'key2', (err,val) => console.log(err,val))

- **You can only store numbers and letters**
- **Query keys have to me consistent but unique between query executions**

### Example of an implementation of Cache on mongo

```
//Import All needed lib
const mongoose = require("mongoose");
const { type } = require("os");
const redis = require("redis");
const util = require("util");

//Create a redis client
const redisURL = "redis://127.0.0.1:6379";
const client = redis.createClient(redisURL);

//Promisify hget method to use it with asyn await syntax
client.hget = util.promisify(client.hget);
client.get = util.promisify(client.get);

//Save exec method from query prototype
const exec = mongoose.Query.prototype.exec;

//Create a function in Query prototype to indicate if que query should be cached
mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true;
  this.hashKey = JSON.stringify(options.key || "");
  return this;
};

//Override Query.Prototype.exec with the cached logic
mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    return exec.apply(this, arguments);
  }
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );

  // See if we have a value for 'key' in redis
  const cacheValue = await client.hget(this.hashKey, key);
  // If we do, return that

  if (cacheValue) {
    console.log(cacheValue);
    const doc = JSON.parse(cacheValue);
    return Array.isArray(doc) == true
      ? doc.map((item) => new this.model(item))
      : new this.model(doc);
  }

  // Otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, arguments);

  client.hset(this.hashKey, key, JSON.stringify(result), "EX", 10);

  return result;
};

//Export a hash function to clean radis data with a key when posting a new document to the database
module.exports = {
  clearHash: function (hashKey) {
    client.del(JSON.stringify(hashKey));
  },
};

```

**Make a Middleware with the clearHash function to use it on endpoints**

```
const { clearHash } = require("../services/cache");

module.exports = async (req, res, next) => {
  await next();
  clearHash(req.user.id);
};
```

# 4 Automated Headless Browser Testing

## 1 Differences between Unit testing an Integration testing

- Unit testing = Assert that one piece of you app is working the way you expect
- Integration Testing = Make sure that multiple 'units' work together correctly

## 2 Puppeteer

Allows us to launch a headless browser and interact with it programmatically

### Common Object and methods

- Puppeteer: Lib that allows us to interact with an instance of a browser
  - Method: launch = Init a Browser object
- Browser: Object that allows us to create multiple pages an interact with them
  - newPage: Init a page on the browser
- Page: Object that allows us to interact with the web applications via many methods
  - goto: Allows us to navigate to an URL
  - setCookie: Allows us to set a cookie in the instance of the page on the current web domain
  - waitFor: make the execution wait until an element of the DOM defined appears on screen
  - $eval: Allows us to retrieve a DOM element on the page
  - evaluate: Allows us to execute javascript code direct in the browser
  - click: Allows us to perform a click on a selector on the page

## 3 Jest

it is a testing framework pretty alike other

### Setup

Jest by default only load test code if we are going to need some libraries as was of this course case,
we need to load models of mongoose you need to pass into the jest command an option to a file that is going to be execute before test like this:

`"test": "jest --setupTestFrameworkScriptFile=./tests/setup.js"`

(inside /test/setup.js)

```
// Set max timeout for each test to 30 seconds
jest.setTimeout(30000);

//Import models and envs
require("../models/User");
const mongoose = require("mongoose");
const keys = require("../config/keys");

//Init connection to mongoDB
//use Nodejs standard implementation
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { userMongoClient: true });

```

### Common methods

- beforeEach: Allows us to run code before each test case
- afterEach: allows us to run code after each test case
- describe: Allows us to organize an group test cases and execute own beforeEach and afterEach to pre configure common situations to these test cases

## 4 Factories

These are functions that we are going to use a lot in our test cases so we make these to retrieve data we are going often need and don't want to handle this logic all the time

userFactory (Creates a new user on the database a retrieve that user to the test case)

```
() => {
  return new User({}).save();
};
```

SessionFactory(Take an user an generate the cookies needed to certificated that is authenticated and return those session to the test case)

```
(user) => {
  const sessionObject = {
    passport: {
      user: user._id.toString(),
    },
  };

  const session = Buffer.from(JSON.stringify(sessionObject)).toString("base64");

  const sig = keygrip.sign("session=" + session);

  return { session, sig };
};

```

## 5 Helpers and Proxy

These helpers allows us to reutilize code on all our test cases, we setup a Custom class to encapsulated the creation of the browser, page and the login logic to make it easy on all test cases to perform these actions

### Proxy

As we seek to have only on object to refer in terms of Page, Browser and new functionality that we wanted to add to this object without touching the lib we came up with the use of proxies

Proxies give us the capability to call to a certain function check if that function is implemented in a custom class other wise, call would be redirected to another object

Example:

```
class CustomPage {

  //Function that creates a browser, a page an return a proxy to call to methods of any of thesw objects priority is set to (CustomPage, browser, page)
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: (target, property) => {
        return customPage[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  //More custom functions we can add up and will have #1 priority at the moment of calls
  ...
}
```

# 5 Continuos Integration

**What is it?**

Process to merger all code changes into a single branch

**What is a CI Server?**

Server that runs automatic checks (tests) on the codebase to ensure the changes have not broken anything

## 1 CI Flow

- Developer pushes code to github
- Ci Server detects that a new push of code has occurred
- Si Server clones project to a cloud-based virtual machine
- CI Server runs all tests
- if all test pass, CI Server marks build as 'passing' and does some optional followup

### CI Providers

- Travis CI
- Circle CI
- CodeShip
- AWS Codebuild

## 2 Set Up

1.- First you have to make sure you have a mechanism to pass all your env to this new ci environment in this case we created this file : config/ci.js to handle all the environments

```
module.exports = {
  googleClientID:
    "70265989829-0t7m7ce5crs6scqd3t0t6g7pv83ncaii.apps.googleusercontent.com",
  googleClientSecret: "8mkniDQOqacXtlRD3gA4n2az",
  mongoURI: "mongodb://127.0.0.1:27017/blog_ci",
  cookieKey: "123123123",
  redisUrl: "redis://127.0.0.1:6379",
};

```

2.- Then you have to config you .travis.uml, this is the file that travis is going to read and use to build your project

```
language: node_js
node_js:
  - "8"
dist: trusty // type of linux very reliable with this process of CI
services: // Services that our project connects to and we want to have available on the virtual machine
  - mongodb
  - redis-server
env:
  - NODE_ENV=ci PORT=3000 //Some environments that are read directly from the project
cache: // Directories that are going to use cache to do not download it every time and make a faster CI
  directories:
    - node_modules
    - client/node_modules
install: // Scripts neede to setup and build the project
  - npm install
  - npm run build
script: // Scripts that travis is going to run if any of those scripts return <> 0 travis will say it was a successful build
  - nohup npm run start &
  - sleep 3
  - npm run test
```

3.- go to https://www.travis-ci.com/ register yourself with you github account, select a plan an configure travis to listen to your repository to trigger the ci pipeline

# 6 Scalable Image File Upload

The best approach to make a Scalable File upload feature on our applications would be using external storage service like amazon, azure or google solutions out there.

this because it is not expensive, it is scalable, automated backup and it is centralized

## 1 Implementations

The implementation of this course had this data flow

- Client app request to API a pre-signed url that allows user to upload a image directly to S3
- API generate from AWS SDK the pre-signed url
- Client upload image file with the pre-signed url
- Client send json data to create blog and linked with the uploaded image
- API Register blog and imageUrl in the mongoDB

### Code to Generate pre-signed URL

//Names of the images has to be unique, so that why key field is appended to userId and a generated uuid as a filename

```
const AWS = require("aws-sdk");
const uuid = require("uuid/v1");
const keys = require("../config/keys");

//Initiate a instance of S3 and pass credentials with IAM Service for security
const s3 = new AWS.S3({
  credentials: {
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
  },
  region: "us-east-1",
});


app.get("/api/upload", requireLogin, (req, res) => {
    const key = `${req.user.id}/${uuid()}.jpeg`;

    //Method to get pre-signedUrl
    s3.getSignedUrl(
      "putObject",
      {
        Bucket: "my-blog-ispm",
        ContentType: "image/jpeg",
        Key: key,
      },
      (err, url) => res.send({ key, url })
    );
  });
```

**Once Api client has already uploaded the image**
It send us the post request to create the blog with the url that it has already uploaded to link it with the blogs, here the handler of the API

```
app.post("/api/blogs", requireLogin, cleanCache, async (req, res) => {
    const { title, content, imageUrl } = req.body;

  //Create the document with the imageURl passed from client making reference to the amazon url
    const blog = new Blog({
      imageUrl,
      title,
      content,
      _user: req.user.id,
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
```

**It is a good practice to only save the key of the image as we in the future could change from provider to another like Google, Azure, etc**

### AWS Configuration

- Create your S3 Bucket
- Create a IAM Policy to only give permission to your S3 bucket
- Create an IAM user with the policy created the step before
- Configure Cors in S3 to allow your app domain like this:

```
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "http://localhost:3000"
        ],
        "ExposeHeaders": []
    }
]
```

- Create a bucket policy to allow public to access to object(images) save in your bucket like this:

```
{
    "Version": "2012-10-17",
    "Id": "Policy1648175599246",
    "Statement": [
        {
            "Sid": "Stmt1648175596697",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::my-blog-ispm/*"
        }
    ]
}
```
