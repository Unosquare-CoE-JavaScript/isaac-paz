# 2 Exploring Mocha and Chai

## 1 What is Mocha

- Its a uni testing framework for javascript that works both in NodeJS and in the browser
- Implements an API for testing that follows behavior Driven Development (BDD) to help write test describe system stories
- Provide hooks to execute code before and after each individual test or suites of test
- Proves an API for testing asynchronous code via Promises
- Has command line parameters to help filter which tests are executed and in what order

## 2 What is Chai

- Javascript Assertion Library con run in Nodejs and browser
- Implements an Api for "expectations" that follows Behavior Driven Development(BDD) style of testing
- Provide an API for Test-Driven Development
- The BDD API provide a chained way to create expectation that can be read as natural english i.e expect(result).to.equal(1

## 3 Create a Unit Test with Mocha and Chai

- Uni test are specified with the "it" Mocha API call
- Test do verification of values using the Chai expectations API

```
const expect = require('chai').expect

it('returns true', () => {
    expect(call()).to.equal(true);
})
```

## 4 Test Discovery

- Mocha will automatically search test in a "test" directory inside the current working directory when it's executed
- Alternative test directories can be specified on the command line `mocha test_dir_one test_dir_two`
- the sub-directories will automatically be searched in the "--recursive" command line parameter is specified
- Specific test filenames can be specified as well i.e mocha test/test_file1.js
- More generalized globs (or regular expression) can also be used or for specifying specific test files
- Globs can also be used with the -g command line parameter to identify specific tests that should be run

## 5 Test suites

- Test suites allow you to group similar tests together
- Test suites are defined in Mocha with the "describe" API call
- All tests defined inside of the "describe" function are part of that test suite

Example:

```
const expect = require("chai").expect

describe('test_suite', () => {
    it('returns true', () => {
        expect(call()).to.equal(true);
    })
})
```

**Nested test suite**

- Mocha allows you tu have nested test suites
- Specify a nested test suite by making a new describe call inside an existing describe call
- Many tests suites and unit tests can be created at each nesting level

```
const expect = require("chai").expect

describe('outer', () => {
    describe('inner', () => {
        it('returns true', () => {
        expect(call()).to.equal(true);
        })
    })
})
```

## 6 Test Setup and Teardown

**Mocha 'Before' and 'After' Hooks**

- 'Before' = Specifies code that executes before any test contained in a Describe block
- 'After' = Specifies code that executes after all test contained in a Describe block have finished
- Can be placed anywhere in the Describe block
- Multiple calls can be specified in any Describe block

```
describe('test_suite', () => {
    before(() => {
        console.log('Before tests')
    });

    it('returns true', () => {
        expect(call()).to.equal(true)
    })

    after(() => {
        console.log('After tests')
    })
})
```

**Mocha 'beforeEach' and 'afterEach' Hooks**

- 'beforeEach' = specifies code that executes before each test in a Describe block
- 'afterEach' = specifies code that executes after each test in a Describe block
- Can specify multiple and can be placed anywhere in the Describe block

```
describe('test_suite', () => {
    beforeEach(() => {
        console.log('Before each')
    });

    it('returns true', () => {
        expect(call()).to.equal(true)
    })

    afterEach(() => {
        console.log('After each')
    })
})
```

**Root-level Hooks**

- Mochas has an implied describe block known as the 'root suite' which is outside all other test suites
- Any hooks specified outside of a describe block will be included in the 'root suite'
- Hooks in teh root suite will **apply to all test found in all files**

```
beforeEach(() => {
    console.log('before each')
})

describe('test_suite', () => {
    it('returns true', () => {
        expect(call()).to.equal(true)
    })
})

afterEach(() => {
    console.log('after each')
})
```

--> See 2 Exploring Mocha and Chai with Examples/3 hooks_suite.js

## 7 Assert Statements with the chai Assert Library

**Javascript Truth and False**

- Many of the expressions that chai validates pass of fail depending on if the expression is "truthy" or "Falsy"
- It is depends of javascript definition of true or false
- There are only six values that are "Falsy": [false, 0(zero), empty string, null , undefined, NaN (not a number)]

### Assert API

- Chai provides a classic assert API like what is typically found in other testing frameworks
- Basic call with expression and message parameters
- The expression parameter is tested for "truthiness" and if it passes the assert passes
- When the assert fails the specified message is included in the failure output

```
it('assert_example', () => {
    assert(false, "Assert fail!")
})
```

### Assert Api Calls

```
assert.isTrue(true, "false")
assert.isNan(1.1, "NaN")
assert.exists(foo, "!Exists")
assert.isArray(obj, "!Array")
```

### Additional Assert API Calls

- `assert.equal(actual, expected)` => Verify equality of one value to another
- `assert.isString(actual, expected)` => verifying the type of a value
- `assert.property(object, propName)` => Verify the properties of objects
- `assert.throws(function)` => Verify exceptions are or are not thrown

**Complete API defined at: http://www.chaihs.com/api/assert**

### BDD Style Asserts

- Chai provides a BDD assert style which is exposed through the "expect" and "should" API calls
- This API allows you to chain additional calls to create a natural language representations of the expected behavior
- The "expect" call is added as a reference to your script and is passed in a value to test
- "should" is called by your script and adds a "should" property to Object.prototype

```
const expect = require("chai").expect;
const should = require("chai").should();

it('likes BDD!', () => {
    let result = productionCall();
    expect(result).to.equal(true);
    result.should.equal(true);
})
```

### Language Chains

- Chai provides a set of chain-able getter methods for creating natural language assertions
- Combine these language chain calls together along with the actual assertion call to create a natural language statement.

(to, be, been, is, that, which, has, have, with, at, of, same, but, does)

here are two assertions which are essentially equivalent:

```
expect(result).to.equal(1);

expect(result).to.be.that.which.is.equal(1)
```

### Assertions Calls

- `expect(result).to.equal(1)` => Verifying equality
- `expect(result).to.be.true` => Verifying true/false
- `expect(result).to.be.instanceof(a)` => Verifying type
- `expect(result).to.t` => Verifying exceptions

**Complete API defined at: http://www.chaijs.com/api/bdd**

## Testing Asynchronous Code

### Async testing of Callbacks

- To test asynchronous code with callbacks pass a "done" parameter to your test.
- this is a callback function provides by Mocha
- Mocha will not complete the test until the "done" callback has been called

```
//Production code
function myAsyncFunction(callback){
    setTimeout(function(){
        callback("blah")
    }, 50)
}

//Test
it('callback test', function(done) {
    myAsyncFunction(function(str){
        expect(str).to.equal("blah");
        done();
    })
})
```

### Async testing with Promises

- To test asynchronous code with promises you simply return the promise from your test
- Mocha delays the test until the returned promise is resolved

```
//Production code
function promiseFunc(){
    return new Promise(
        (resolve, reject) => {
            setTimeout(() => {
                resolve("blah");
            }, 50)
        }
    )
}

//Test
it('promise test', () => [
    return promiseFunc().then(res => {
        expect(res).to.equal("blah")
    })
])
```

### Async Testing with Async/Await

- Specify "async" on your unit test
- Inside your test you then call "await" on the asynchronous function that you are testing
- Your uni test will return a promise which Mocha will wait to be resolve

```
//Production code
function promiseFunc(){
    return new Promise(
        (resolve, reject) => {
            setTimeout(() => {
                resolve("blah");
            }, 50)
        }
    )
}

//Test
it('promise test', () => [
    let res = await promiseFunc();
    expect(res).to.equal("blah")
])
```
