# Data Caching with Redis

Databases usually have implemented indexes when consulting data, but on other hand when we request data via some particular fields that do not have an index it turns to be pretty expensive in terms of efficiency.

It can seem obvious that the answer would be create more indexes but it will also make slower to write data to the collection, and not all the time we know for sure what field we are going to use to request data.

Se have to come up with a different solution

## Caching layer

### Cache Server

It saves the result of a query that have been execute before with those parameters to return the result of the query without running the query to the database, Making our API faster.

It is very fast because it saves data in a key value pair logic so it does not need a search algorithm

**Redis memory is volatile meaning if the server restart all data disappear, se we use it to save data that is not that critical**

To interact with this server we are going to install a library called node-redis

## Installing redis

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
