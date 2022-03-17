# Currying

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

## 5 Currying Exercises

## 6 Currying Solutions
