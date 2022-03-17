# Composition
## 1 Definition
```
// Definition
// const compose = (f, g) => x => f(g(x))
// it is useful to combine N function to be call over an x 
// create a pipeline of execution
// it is execute right to left
// it returns a new function

const {compose} = require('ramda')

const toUpper = str => str.toUpperCase()

const exclaim = str => str + '!'

const first = xs => xs[0]

const loudFirst = compose(toUpper, first)

const shout = compose(exclaim, loudFirst)

console.log(shout('tears'))
```

## 2 Creating Programs with curry and compose

Basically we are going to build this pipelines to manipulate data, one block of the chain does not pass an output to the next function that would be te end of the program

```
const _ = require("ramda")

-> Example function written in a compose way 
const doStuff = _.compose(
    join(''),
    _.filter(x => x.length > 3),
    reverse,
    _.map(trim),
    split(' '),
    toLowerCase
  )
```
-> Previous function written "Normally"
```
const doStuff = str => {
  const lower = str.toLowerCase()
  const words = lower.split(' ')
 
  words.reverse()
 
  for(let i in words) {
    words[i] = words[i].trim()
  }
 
  let keepers = []
 
  for(let i in words) {
    if(words[i].length > 3) {
      keepers.push(words[i])
    }
  }
 
  return keepers.join('')
}
```

In the "Normal way" we are defining many variables and mutating them as the program runs, so it is less performant than the functional way, it is as well not much reusable

Object oriented programming can also cause some problems because a class practically is a undirected graph of mutations and that can cause some problems, on functional programming paradigm it is a Directed graphs of mutations

## 3 Composition is Dot chaining

They are equivalent (Pay attention to execution order)
```
const doStuff = str =>
  str
  .toLowerCase()
  .split(' ')
  .map(c => c.trim())
  .reverse()
  .filter(x => x.length > 3)
  .join('')
```
To
```
const doStuff = _.compose(
  join(''),
  _.filter(x => x.length > 3),
  reverse,
  _.map(trim),
  split(' '),
  toLowerCase
)

```

## 4 Logging in composition

You can create a log function to implement after o before every call in the pipe

```
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
```