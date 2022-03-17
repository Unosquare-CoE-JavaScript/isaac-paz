
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
