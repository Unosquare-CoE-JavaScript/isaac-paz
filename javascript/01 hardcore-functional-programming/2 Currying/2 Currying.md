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

## 3 Ramda Generalized Currying

## 4 Partial Application vs Currying

## 5 Currying Exercises

## 6 Currying Solutions
