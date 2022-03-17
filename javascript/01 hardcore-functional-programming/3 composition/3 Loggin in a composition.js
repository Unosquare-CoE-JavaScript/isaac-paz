//Definition
//const compose = (f, g) => x => f(g(x))
// it is useful to combine to function to be call over an x
// it is execute right to left
// it returns a new function

const { compose, curry } = require("ramda");

const toUpper = (str) => str.toUpperCase();

const exclaim = (str) => str + "!";

const first = (xs) => xs;

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
