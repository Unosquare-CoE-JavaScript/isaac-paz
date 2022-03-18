# isaac-paz

## Index

- [isaac-paz](#isaac-paz)
  - [Index](#index)
- [1 Introduction](#1-introduction)
  - [1 Mathematical, Pure, Functions](#1-mathematical-pure-functions)
    - [Definition](#definition)
    - [Validations](#validations)
  - [2 Pure Function Checklist](#2-pure-function-checklist)
    - [Function or not Function](#function-or-not-function)
  - [3 Pure Function Advantages](#3-pure-function-advantages)
- [2 Currying](#2-currying)
  - [1 Properties, Arguments & Argument Order](#1-properties-arguments--argument-order)
    - [Properties](#properties)
    - [Why is it useful?](#why-is-it-useful)
  - [2 Currying Example & Argument Order](#2-currying-example--argument-order)
  - [3 Ramda Generalized Currying](#3-ramda-generalized-currying)
  - [4 Partial Application vs Currying](#4-partial-application-vs-currying)
  - [5 Currying Exercises And Solutions](#5-currying-exercises-and-solutions)
- [3 Composition](#3-composition)
  - [1 Definition](#1-definition)
  - [2 Creating Programs with curry and compose](#2-creating-programs-with-curry-and-compose)
  - [3 Composition is Dot chaining](#3-composition-is-dot-chaining)
  - [4 Logging in composition](#4-logging-in-composition)
- [4 Functors](#4-functors)
  - [1 Definition](#1-definition-1)
  - [2 Creating the identity Functor](#2-creating-the-identity-functor)
  - [3 Refactoring to Dot Chaining](#3-refactoring-to-dot-chaining)
- [5 Either Monad](#5-either-monad)
  - [1 Either monad](#1-either-monad)
  - [From nullable](#from-nullable)
  - [Refactoring using the either monad](#refactoring-using-the-either-monad)
  - [4 flattening either monads with chain](#4-flattening-either-monads-with-chain)
  - [Debugging with logging](#debugging-with-logging)
- [6 Task](#6-task)
  - [Task Monad](#task-monad)
  - [Refactoring Node IO with Task](#refactoring-node-io-with-task)
    - [Task Practices](#task-practices)
  - [transform & Monad Patterns](#transform--monad-patterns)
  - [Natural Transformation](#natural-transformation)

# 1 Introduction

## 1 Mathematical, Pure, Functions

### Definition

Programming with functions

**Function**
From the perspective of Set theory it is a Single value collection of pairs
For every input it should have a different output.
If it does not apply it is not a function.

| Function | Not a Function |
| -------- | -------------- |
| (a -> 2) | (a -> 2)       |
| (b -> 3) | **(b -> 3)**   |
| (b -> 3) | **(b -> 4)**   |
| (c -> 5) | (c -> 5)       |

**One input, One output**

**Input** is defined as Domain
**Output** is defines as Range

### Validations

**Total**

- ==For Every input there is a corresponding output==
- You will always have a value in the Range (Output)
- Null, is not a valid output,
- Functions must consider all input

- Non total function

```
const inc = i => {
    if (i === 0 ) return 1
    if (i === 1 ) return 2
    if (i === 2 ) return 3
  }
```

- Total Function

```
const inc = i => {
  return i + 1
}

const inc = i => {
  if (i === 0 ) return 1
  if (i === 1 ) return 2
  if (i === 2 ) return 3
  return 100
}
```

==It all depends how you frame it, if you say this first function written in this example return either a number of a null it would make it Total.==

**Deterministic**

- ==Always receive the same output for a given input==

- Non Deterministic Function
  ```
  const timeSince = comment => {
    const now = new Date()
    const then = new Date(comment.createdAt)
    return getDifference(now, then)
  }
  ```
- Deterministic Function

  ```
  const getDifference = (now, then) => {
    const days = Math.abs(now.getDate() - then.getDate());
    const hours = Math.abs(now.getHours() - then.getHours());
    return {days, hours}
  }

  ```

**No Observable Side-Effects**

- ==No observable effects besides computing a value==

- Function with Observable Side Effects (Write and output besides the returned value)

```
const add = (x, y) => {
    console.log(`Adding ${x} ${y}`)
    return x + y
}
```

- Function with No Observable Side Effects(All data is in the returned value)

```
const add = (x, y) => {
    return {result: x + y, log: `Adding ${x} ${y}`}
}
```

==it's depends also pretty much how you defined a side effect, most of the times it refers to some effect that client of the software can see==

## 2 Pure Function Checklist

Examples

Deterministic

```
// not a function
xs.splice(0,3)
//=> [1,2,3]

xs.splice(0,3)
//=> [4,5]

xs.splice(0,3)
//=> []

// function
xs.slice(0,3)
//=> [1,2,3]

xs.slice(0,3)
//=> [1,2,3]

xs.slice(0,3)
//=> [1,2,3]
```

You can return an error as a value, blowing the program with an error is not compatible with the mathematical definition

```
// not a function
const toSlug = (title) => {
    const urlFriendly = title.replace(/\W+/ig, '-')
    if(urlFriendly.length < 1) {
        throw new Error('is bad')
    }
    return urlFriendly
}

// function
const toSlug = (title) => {
    return new Promise((res, rej) => {
        const urlFriendly = title.replace(/\W+/ig, '-')

        if(urlFriendly.length < 1) {
            rej(new Error('is bad'))
        }
        return res(urlFriendly)
    })
}

```

This case is probably a observable side effect, one way we can push the problem
down the road is returning a function

```
// not a function
const toSlug = (title) => {
    const urlFriendly = title.replace(/\W+/ig, '-')
    if(urlFriendly.length < 1) {
        throw new Error('is bad')
    }
    return urlFriendly
}

// function
const toSlug = (title) => {
    return new Promise((res, rej) => {
        const urlFriendly = title.replace(/\W+/ig, '-')

        if(urlFriendly.length < 1) {
            rej(new Error('is bad'))
        }
        return res(urlFriendly)
    })
}
```

### Function or not Function

Not a function it is not deterministic

```
const birthday = user => {
    user.age += 1;
    return user;
}
```

It is a Function

```
const shout = word =>
    word.toUpperCase().concat("!")
```

It is not a function, because querySelector will return different values depending on the time it is called. so it is not deterministic

```
const headerText = header_selector =>
    querySelector(header_selector).text()
```

Location is global it is not deterministic because same input different output

```
const parseQuery = () =>
    location.search.substring(1).split('&').map(x => x.split('='))
```

It is a function

```
var parseQueryString = function(queryString) {
    var params = {}, queries, temp, i, l;

    queries = queryString.split("&");

    for ( i = 0, l = queries.length; i < l; i++ ) {
        temp = queries[i].split('=');
        params[temp[0]] = temp[1];
    }

    return params;
};
```

## 3 Pure Function Advantages

- Reliable (same input, same output)
- Portable
- Reusable (They are not dependent of the environment)
- Testable
- Composable
- Properties/Contract

PPTX Link: https://docs.google.com/presentation/d/1nj5xmsHeJh-6RdjLs1190Hwl8smclvFLePqPCTVsrYw/edit#slide=id.g61c861d54_010

# 2 Currying

## 1 Properties, Arguments & Argument Order

### Properties

As well as math operation has its own properties like:

```
// associative
add(add(x, y), z) == add(x, add(y, z))

// commutative
add(x, y) == add(y, x)

// identity
add(x, 0) == x

// distributive
add(multiply(x, y), multiply(x, z)) == multiply(x, add(y,z))
```

Also our function have its own properties

**You can take two arguments separated or destructured from an array and it would be equivalent**

```
const add = (x, y) => x + y;

const toPair =
  (f) =>
  ([x, y]) =>
    f(x, y);

const fromPair = (f) => (x, y) => f([x, y]);

const result = fromPair(toPair(add))(1, 2);

console.log(result);

```

**You can take two arguments separated or destructured from an array and it would be equivalent**

```
const add = (x, y) => x + y;

const toPair =
  (f) =>
  ([x, y]) =>
    f(x, y);

const fromPair = (f) => (x, y) => f([x, y]);

const result = fromPair(toPair(add))(1, 2);

console.log(result);

```

**Currying you function allow you to pass params one by one until all params are completed**

```
const add = (x, y) => {
  return x + y;
};

const curry = (f) => (x) => (y) => f(x, y);

const unCurry = (f) => (x, y) => f(x)(y)

const curriedAdd = curry(add);

const increment = curriedAdd(1);

const result = increment(4);

console.log(result);
```

### Why is it useful?

It allow us to reuse and generate new function on base pre-existing ones like this example:

```

const add = (x, y) => {
  return x + y;
};

const curry = (f) => (x) => (y) => f(x, y);

const modulo = curry((x, y) => y % x);

const isOdd = modulo(2)

const result = isOdd(6);

console.log(result);
```

## 2 Currying Example & Argument Order

**When to use currying:**
-> when you want to remember an argument.
-> When you want to pass a configuration and you want to remember than from then on

```
/*
You can get new functions by just remember arguments with currying
*/

const curry = (f) => (x) => (y) => f(x, y);
const modulo = curry((x, y) => y % x);
const isOdd = modulo(2);

//The argument that should be remember must be first
//Data that is going to operate on must go last
const filter = curry((f, xs) => xs.filter(f));
const getOdds = filter(isOdd);
const result = getOdds([1, 2, 3, 4, 5]);

console.log(result);
```

## 3 Ramda Generalized Currying

There's a lib that have an implemtation of Curry that can handle dinamyc numbers of params to curry

Example

```
// Ramda General Curry function can handle n parameters to curry
const { curry } = require("ramda");

const replace = curry((regex, replacement, string) =>
  string.replace(regex, replacement)
);

const replaceVowels = replace(/[AEIOU]/gi, "!");

const result = replaceVowels("Hey i have words");

console.log(result);

```

## 4 Partial Application vs Currying

There is a function on javascript that makes possible to implement currying called partial, but this course does not cover that, it is just another way to do currying

## 5 Currying Exercises And Solutions

1.- From

```
const words = function(str) {
  return split(' ', str);
}
```

To

```
//Split was already curried
const words = split(' ')
```

2.- From

```
const sentences = xs => _.map(words, xs);
```

To

```
//As map is curried you can eliminate the xs argument as it is goint to be passes when called
const sentences = _.map(words);
```

3.- From

```
const filterQs = function(xs) {
  return _.filter(function(x){ return _.test(/q/ig, x);  }, xs);
}
```

To

```
//Same we can eliminate xs, and its going to return a callable function like  (xs) => ...
const filterQs = _.filter(_.test(/q/ig));
```

4.- From

```
const max = function(xs) {
  return _.reduce(function(acc, x){
    return _keepHighest(acc, x);
  }, 0, xs);
}
```

To

```
//We can eliminate all data naming as it is going to return a callable function
waiting to that argument to execute the logic
const max = _.reduce(_keepHighest, 0)
```

5 Bonus 1

```
//Wrap slice built int function in a curried way
const slice = _.curry((start, end, xs) => xs.slice(start, end))
```

6 Bonus 2

```
// use slice to define a function take() that takes n elements from an array. make it curried
const take = slice(0)
```

# 3 Composition

## 1 Definition

```
// Definition
// const compose = (f, g) => x => f(g(x))
// it is useful to combine N function to be call over an x
// create a pipeline of execution
// it is execute right to left
// it returns a new function

const {compose} = require('ramda')

const toUpper = str => str.toUpperCase()

const exclaim = str => str + '!'

const first = xs => xs[0]

const loudFirst = compose(toUpper, first)

const shout = compose(exclaim, loudFirst)

console.log(shout('tears'))
```

## 2 Creating Programs with curry and compose

Basically we are going to build this pipelines to manipulate data, one block of the chain does not pass an output to the next function that would be te end of the program

```
const _ = require("ramda")

-> Example function written in a compose way
const doStuff = _.compose(
    join(''),
    _.filter(x => x.length > 3),
    reverse,
    _.map(trim),
    split(' '),
    toLowerCase
  )
```

-> Previous function written "Normally"

```
const doStuff = str => {
  const lower = str.toLowerCase()
  const words = lower.split(' ')

  words.reverse()

  for(let i in words) {
    words[i] = words[i].trim()
  }

  let keepers = []

  for(let i in words) {
    if(words[i].length > 3) {
      keepers.push(words[i])
    }
  }

  return keepers.join('')
}
```

In the "Normal way" we are defining many variables and mutating them as the program runs, so it is less performant than the functional way, it is as well not much reusable

Object oriented programming can also cause some problems because a class practically is a undirected graph of mutations and that can cause some problems, on functional programming paradigm it is a Directed graphs of mutations

## 3 Composition is Dot chaining

They are equivalent (Pay attention to execution order)

```
const doStuff = str =>
  str
  .toLowerCase()
  .split(' ')
  .map(c => c.trim())
  .reverse()
  .filter(x => x.length > 3)
  .join('')
```

To

```
const doStuff = _.compose(
  join(''),
  _.filter(x => x.length > 3),
  reverse,
  _.map(trim),
  split(' '),
  toLowerCase
)

```

## 4 Logging in composition

You can create a log function to implement after o before every call in the pipe

```
const log = curry((tag, value) => (console.log(tag, value), value));

const shout = compose(
  log("Last"),
  first,
  log("Third"),
  toUpper,
  log("Second"),
  exclaim,
  log("First")
);

shout("Tears");
```

# 4 Functors

## 1 Definition

In functional programming, a functor is a design pattern inspired by the definition from category theory, that allows for a generic type to apply a function inside without changing the structure of the generic type.

(Any object that has a map method inside itself)

## 2 Creating the identity Functor

**Identity functor example**

```
// This is just one of many ways we can implement it
const Box = (x) => ({
  map: (f) => Box(f(x)),
  inspect: `Box(${x})`,
  fold: (f) => f(x),
});

/*Allows us to keep applying function over data inside box without passing any
argument explicitly besides the function to be applied*/

const nextCharForNumberString = (str) =>
  Box(str)
    .map((x) => x.trim())
    .map((trimmed) => parseInt(trimmed, 10))
    .map((number) => number + 1)
    .fold(String.fromCharCode)
```

## 3 Refactoring to Dot Chaining

Example of a refactor to Dot chaining

```
//From
const halfTheFirstLargeNumber_ = (xs) => {
  const found = xs.filter((x) => x >= 20);
  const answer = first(found) / 2;
  return `The answer is ${answer}`;
};

//To
const halfTheFirstLargeNumber = (xs) =>
  Box(xs)
  .map(arr => arr.filter(x => x >= 20))
  .map(found => first(found) / 2)
  .fold(answer => `The answer is ${answer}`)
```

//as said in the begin compose is equivalent to dot chaining as it could be define as next using our Box class:

```
const compose = (f, g) => x => Box(x).map(g).fold(f)
```

3 Functor practices

Exercise 1

```
From
const moneyToFloat_ = (str) => parseFloat(str.replace(/\$/, ""));

To
const moneyToFloat = (str) =>
  Box(str)
    .map((str) => str.replace(/\$/, ""))
    .fold((str) => parseFloat(str));
```

Exercise 2

```
From
const percentToFloat_ = (str) => {
  const float = parseFloat(str.replace(/\%/, ""));
  return float * 0.01;
};

To
const percentToFloat = (str) =>
  Box(str)
    .map((str) => str.replace(/\%/, ""))
    .map((x) => parseFloat(x))
    .fold((x) => x * 0.01);
```

Exercise 3

```
From
const applyDiscount_ = (price, discount) => {
  const cents = moneyToFloat(price);
  const savings = percentToFloat(discount);
  return cents - cents * savings;
};

To
const applyDiscount = (price, discount) =>
  Box(moneyToFloat(price)).chain((cents) =>
    Box(percentToFloat(discount)).map((savings) => cents - cents * savings)
  ).fold(x => x);
```

# 5 Either Monad

## 1 Either monad

- Either monad allows us to control errors on dot chain operations by bubbling the error until fold method is called,
- As we are now throwing exception on the methods it makes them safer
- It can be used also on other situations to branch our code kind of like a if statement

Example on implementation of Either monad, it needs 2 identity factor and one of them "Left" when returned following chained process are not run until.

```
const Right = (x) => ({
  chain: (f) => f(x),
  map: (f) => Right(f(x)),
  fold: (f, g) => g(x),
  inspect: `Right(${x})`,
});

const Left = (x) => ({
  chain: (f) => Left(x),
  map: (f) => Left(x),
  fold: (f, g) => f(x),
  inspect: `Left(${x})`,
});

const findColor = (name) => {
  const found = { red: "#ff4444", blue: "#3b5998", yellow: "#fff68f" }[name];
  return found ? Right(found) : Left("missing");
};

const res = () =>
  findColor("red")
    .map((x) => x.toUpperCase())
    .map((x) => x.slice(1))
    .fold(
      () => "No color!",
      (color) => color
    );

console.log(res());
```

## From nullable

You can make a little function to check if value is null return Left Functor it allow to simplify our code

```
const fromNullable = (x) => (x != null ? Right(x) : Left());

const findColor = (name) =>
  fromNullable({ red: "#ff4444", blue: "#3b5998", yellow: "#fff68f" }[name]);
```

## Refactoring using the either monad

You can handle try error on monad in this way, also creating a
function called Try Catch can encapsulate logic to handle errors and return a Left Functor automatically, and reuse it many time you want

```

const tryCatch = (f) => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
};

const readFileSync = (path) => tryCatch(() => fs.readFileSync(path));

const getPort = () =>
  readFileSync("./config.json")
    .map((content) => JSON.parse(content))
    .map((config) => config.port)
    .fold(
      () => 8080,
      (x) => x
    );
```

## 4 flattening either monads with chain

In this example our utility functions return either a Right or Left Functor so it is necessary to chain them to flat them out an continue to hold just one 'Box' over the calls

```
const tryCatch = (f) => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
};

const readFileSync = (path) => tryCatch(() => fs.readFileSync(path));

const parseJSON = (content) => tryCatch(() => JSON.parse(content));

const getPort = () =>
  readFileSync("./config.json")
    .chain((content) => parseJSON(content))
    .fold(
      () => 8080,
      (x) => x
    );
```

## Debugging with logging

You can make a function to log the functor to know what is happening on the chain

```
const logIt = (x) => {
  console.log(x);
  return x;
};
```

# 6 Task

## Task Monad

It is basically as Promise, but with the difference that you actually has to know if you are going to return another task to chain them

```
import { Task } from "types";

const t1 = Task((reJ, res) => res(2))
  .chain((two) => Task.of(two + 1))
  .map((three) => three * 2);

t1.fork(console.error, console.log);

```

## Refactoring Node IO with Task

we could refactor the app to pass from this:

```
const app_ = () =>
  fs.readFile("config.json", "utf-8", (err, contents) => {
    console.log(err, contents);
    if (err) throw err;

    const newContents = contents.replace(/3/g, "6");

    fs.writeFile("config1.json", newContents, (err, _) => {
      if (err) throw err;
      console.log("success!");
    });
  });
```

To this:

```
const readFile = (path, enc) =>
  Task((rej, res) =>
    fs.readFile(path, enc, (err, contents) => (err ? rej(err) : res(contents)))
  );

const writeFile = (path, contents) =>
  Task((rej, res) =>
    fs.writeFile(path, contents, (err, contents) =>
      err ? rej(err) : res(contents)
    )
  );

  const app = () =>
  readFile("config.json", "utf-8")
    .map((contents) => contents.replace(/3/g, "6"))
    .chain((newContent) => writeFile("config1.json", newContent));

```

### Task Practices

if you don't want to use the typical constructor for Task:

```
const t = Task((rej, res) => res(2))
```

you can initialized a Task with a minimal context as it is call like this:

```
const t = Task.of(2)
```

it is equivalent, this is also called a appointed functor

## transform & Monad Patterns

If you need to transforms a [Task, Task] into Task[] or traverse other king of types you can use a method called
Traverse on the lib of 'immutable-ext'

it is basically ty flip types around

```
List([graterThan5, looksLikeEmail]).traverse(Either.of, v => (email))
```

Example:

```
const greaterThan5 = (x) =>
  x.length > 5 ? Right(x) : Left("not greater than 5");

const looksLikeEmail = (x) =>
  x.match(/@/gi) ? Right(x) : Left("not an email");

const email = "blahh@yadda.com";
const res = List([greaterThan5, looksLikeEmail]).traverse(Either.of, (v) =>
  v(email)
);

res.fold(console.log, (x) => console.log(x.toJS()));

```

Or a more real case application when flipping out the types makes sense to flat them out:

```

Either.of(List.of(4)).chain((xs) => Either.of(3));
// Either (List(Either))
// Either (Either(List))
// Either (List)

```

## Natural Transformation

Example to change an either type to a Task type
in order to be a natural transformation you don't have to touch the value just flip the type

```
const eitherToTask = e =>
e.fold(Task.rejected, Task.of)
```

Example on manipulating types can make things simpler

From

```
Db.find(1)
  .chain(eu =>
    eu.fold(
      e => Task.of(eu),
      u => Db.find(u.best_friend_id)
    )
  )
  .fork(
    error => send(500, { error }),
    eu =>
      eu.fold(
        error => send(404, { error }),
        x => send(200, x)
      )
  );
```

To

```
Db.find(3)
  .chain(eitherToTask)
  .chain(u => Db.find(u.best_friend_id))
  .chain(eitherToTask)
  .fork(error => send(500, { error }),
    u => send(200, u))
```
