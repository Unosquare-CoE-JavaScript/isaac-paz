const { Task } = require("../types");

const t1 = Task((rej, res) => res(2))
  .chain((two) => Task.of(two + 1))
  .map((three) => three * 2);

t1.fork(console.error, console.log);
