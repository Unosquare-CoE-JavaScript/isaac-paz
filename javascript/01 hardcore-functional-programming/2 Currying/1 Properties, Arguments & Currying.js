/*
    Example that and two arguments are equivalent to pass one array of argument so it is 
    So it is isomorphic
*/

// const add = (x, y) => x + y;

// const toPair =
//   (f) =>
//   ([x, y]) =>
//     f(x, y);

// const fromPair = (f) => (x, y) => f([x, y]);

// const result = fromPair(toPair(add))(1, 2);

// console.log(result);

/*
    Example that you can flip the argument in this case and it won't make a difference
    and prove that this function flipped is actually equivalent
*/

// const add = (x, y) => {
//     return x + y;
// }

// const flip = (f) => (x, y) => f(y, x);

// const result = flip(add)(1, 3);

// console.log(result);

/*
    Currying function does not change the behavior of the function so you can uncurried it 
    and it would be just equivalent
*/

// const add = (x, y) => {
//   return x + y;
// };

// const curry = (f) => (x) => (y) => f(x, y);

// const unCurry = (f) => (x, y) => f(x)(y)

// const curriedAdd = curry(add);

// const increment = curriedAdd(1);

// const result = increment(4);

// console.log(result);

/*
    Why is it useful, in this example we can build a function from another function
    because of currying we can preload one argument and make it so the logic of the returned function
    would give us if the next param is odd or not 

    So it is reusable
*/

const add = (x, y) => {
  return x + y;
};

const curry = (f) => (x) => (y) => f(x, y);

const modulo = curry((x, y) => y % x);

const isOdd = modulo(2)

const result = isOdd(6);

console.log(result);
