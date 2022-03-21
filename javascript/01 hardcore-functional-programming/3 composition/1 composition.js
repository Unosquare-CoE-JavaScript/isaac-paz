//Definition
//const compose = (f, g) => x => f(g(x))
// it is useful to combine to function to be call over an x
// it is execute right to left
// it returns a new function

const {compose} = require('ramda')

const toUpper = str => str.toUpperCase()

const exclaim = str => str + '!'

const first = xs => xs[0]

const loudFirst = compose(toUpper, first)

const shout = compose(exclaim, loudFirst)

console.log(shout('tears'))