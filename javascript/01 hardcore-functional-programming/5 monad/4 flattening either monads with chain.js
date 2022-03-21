const fs = require("fs");

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

const result = getPort();

console.log(result);
