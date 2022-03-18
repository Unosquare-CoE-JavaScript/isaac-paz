# Either Monad

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