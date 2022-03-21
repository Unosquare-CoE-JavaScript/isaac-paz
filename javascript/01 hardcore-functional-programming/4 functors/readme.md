# Functors

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
