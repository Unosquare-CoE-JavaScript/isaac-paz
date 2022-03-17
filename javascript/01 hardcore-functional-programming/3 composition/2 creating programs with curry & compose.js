const _ = require("ramda");

const doStuff = _.compose(
  join(""),
  _.filter((x) => x.length > 3),
  reverse,
  _.map(trim),
  split(" "),
  toLowerCase
);

const doStuff2 = (str) => {
  const lower = str.toLowerCase();
  const words = lower.split(" ");

  words.reverse();

  for (let i in words) {
    words[i] = words[i].trim();
  }

  let keepers = [];

  for (let i in words) {
    if (words[i].length > 3) {
      keepers.push(words[i]);
    }
  }

  return keepers.join("");
};
