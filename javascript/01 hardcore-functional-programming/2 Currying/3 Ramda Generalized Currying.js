// Ramda General Curry function can handle n parameters to curry
const { curry } = require("ramda");

const replace = curry((regex, replacement, string) =>
  string.replace(regex, replacement)
);

const replaceVowels = replace(/[AEIOU]/gi, "!");

const result = replaceVowels("Hey i have words");

console.log(result);
