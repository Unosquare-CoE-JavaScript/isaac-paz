## Index

- [1 Overview](#1-overview)
  - [1 Unit Testing](#1-unit-testing)
    - [Why do we unit test?](#why-do-we-unit-test)
    - [Level of testing](#level-of-testing)
    - [Unis Testing Specifics](#unis-testing-specifics)
    - [Example](#example)
  - [2 Test Driven Development](#2-test-driven-development)
    - [What is Test-Driven development](#what-is-test-driven-development)
    - [What are some of the benefits of TDD](#what-are-some-of-the-benefits-of-tdd)
    - [TDD Beginnings](#tdd-beginnings)
    - [TDD Workflow: Red, Green, Refactor](#tdd-workflow-red-green-refactor)
    - [Uncle Bob's 3 Laws of TDD](#uncle-bobs-3-laws-of-tdd)
  - [3 Quick Example TDD Session:](#3-quick-example-tdd-session)
  - [4 Installing Mocha and Chai](#4-installing-mocha-and-chai)
  - [5 Setting up Mocha test runners in visual studio code](#5-setting-up-mocha-test-runners-in-visual-studio-code)
- [2 Exploring Mocha and Chai](#2-exploring-mocha-and-chai)
  - [1 What is Mocha](#1-what-is-mocha)
  - [2 What is Chai](#2-what-is-chai)
  - [3 Create a Unit Test with Mocha and Chai](#3-create-a-unit-test-with-mocha-and-chai)
  - [4 Test Discovery](#4-test-discovery)
  - [5 Test suites](#5-test-suites)
  - [6 Test Setup and Teardown](#6-test-setup-and-teardown)
  - [7 Assert Statements with the chai Assert Library](#7-assert-statements-with-the-chai-assert-library)
    - [Assert API](#assert-api)
    - [Assert Api Calls](#assert-api-calls)
    - [Additional Assert API Calls](#additional-assert-api-calls)
    - [BDD Style Asserts](#bdd-style-asserts)
    - [Language Chains](#language-chains)
    - [Assertions Calls](#assertions-calls)
  - [Testing Asynchronous Code](#testing-asynchronous-code)
    - [Async testing of Callbacks](#async-testing-of-callbacks)
    - [Async testing with Promises](#async-testing-with-promises)
    - [Async Testing with Async/Await](#async-testing-with-asyncawait)
- [3 Hands-on Example - Implementing a checkout Cart with TDD](#3-hands-on-example---implementing-a-checkout-cart-with-tdd)
- [4 Isolating your unit tests](#4-isolating-your-unit-tests)
  - [1 Test Doubles](#1-test-doubles)
  - [2 Types of Test Doubles](#2-types-of-test-doubles)
  - [3 Mock Frameworks](#3-mock-frameworks)
  - [4 Sinon.JS](#4-sinonjs)
  - [5 Creating a Spy](#5-creating-a-spy)
  - [6 Method Wrapping Spy](#6-method-wrapping-spy)
  - [7 Spi API](#7-spi-api)
  - [8 Sinon Stubs](#8-sinon-stubs)
  - [9 Sinon Mocks](#9-sinon-mocks)
  - [10 Sinon Mocks Expectations](#10-sinon-mocks-expectations)
  - [11 Sinon Cleanup](#11-sinon-cleanup)
  - [12 Sinon-chai](#12-sinon-chai)
- [5 Best Practices for Unit Testing and TDD](#5-best-practices-for-unit-testing-and-tdd)
  - [1 TDD Best Practices](#1-tdd-best-practices)
    - [Always do the next simplest test case](#always-do-the-next-simplest-test-case)
    - [Use Descriptive Test names](#use-descriptive-test-names)
    - [Keep Test Fast](#keep-test-fast)
    - [Use Code Coverage Tools](#use-code-coverage-tools)
    - [Run your Test Multiple tiime and In Random Order](#run-your-test-multiple-tiime-and-in-random-order)
    - [Use a Static Code Analysis Tool](#use-a-static-code-analysis-tool)
  - [2 Overview of Code Coverage](#2-overview-of-code-coverage)
    - [What is Code Coverage Analysis?](#what-is-code-coverage-analysis)
  - [Types of Code Coverage Analysis](#types-of-code-coverage-analysis)
  - [Istanbul (nyc)](#istanbul-nyc)

# 1 Overview

## 1 Unit Testing

### Why do we unit test?

- Software bugs hurt the business
- Testing catches the bugs before they get to the field
- Need several levels of safety nets

### Level of testing

- Unit test (Validate individual functions)
- Component testing (Validate a collection of functions)
- System Testing (Collection of components of subsystems)
- Performance testing (Test the performance of int time and resource to be acceptable)

### Unis Testing Specifics

- Test individual functions
- A test should be written for each test case for a function
- Group of tests can be combined into test suites to better organization
- Executes in the development environment
- Execution of the test should be automated

### Example

Every unit test should have 3 steps

- Setup
- Action
- Assert

```
# Production code
function str_len(theStr){
    return theStr.length;
}

#A Unit Test
if('returns length of the string',
function(){
 testStr = "1" //Setup
 result = str_len(testStr); //Action
 expect(result).to.equal(1); //Assert
})
```

## 2 Test Driven Development

### What is Test-Driven development

- A process where the developer takes personal responsibility fro the quality of their code
- Unit test are written before the production code
- Do not write all the test or production code at once(Write one test and then the production code to pass the test)
- Test and production code are written together

### What are some of the benefits of TDD

- gives confidence to change the code
- Gives you immediate feedback
- Documents what the code is doing
- drives good object oriente design

### TDD Beginnings

- Create by kent Beck in 1990's
- Wrote the first TDD framework on SmallTalk called SUnit
- Wrote the first TDD framework on java called JUnit with Erich Gamma
- JUnit has been the basis for many other xUnit Testing Frameworks on other languages

### TDD Workflow: Red, Green, Refactor

- Write a failing unit test (The Red phase)
- Write just enough production code to make the test pass (Green phase)
- Refactor the unit test and the production code to make it clean (Refactor phase)
- Repeat until the feature is complete

### Uncle Bob's 3 Laws of TDD

- You may not write any production code until you have written a failing unit test
- You may not write more of a unit test than is sufficient to fail, and not compiling is failing
- You may not write production code than is sufficient to pass the currently failing unit test

## 3 Quick Example TDD Session:

-> Check 1 Overview and setting up your development environment/1 test

## 4 Installing Mocha and Chai

- Initialize a new Node project
  `npm init -y`
- Download mocha chai as a dev dependency
  `npm install --save-dev chai mocha`

## 5 Setting up Mocha test runners in visual studio code

Install this extension
`Mocha Test Explorer`
Automatically will search for a test dir and on the left bar of Visual studio go to new "Testing" icon
from there you can run the tests

**To recognize tests should be inside a folder named "test"**

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

# 3 Hands-on Example - Implementing a checkout Cart with TDD

# 4 Isolating your unit tests

## 1 Test Doubles

- Almost all code depends on and collaborates with other parts of the system
- Those other part of the system are not always easy to replicate in the unit test environment or would test slow if used directly

**Test doubles is the answer for this problems they are objects created in the test to replace the real production systems collaborator's**

## 2 Types of Test Doubles

- Dummy: Objects that can be passed around as necessary but do not have any type of test implementation and **should never be used**
- Fake: These object generally have simplified functional implementation of a particular interface that is adequate for testing but not for production
- Stub: These objects provide implementations with canned answers that are suitable for the test
- Spies: These objects provide implementations that record the values that were passes in so they can be used by the test
- Mocks: These objects are pre-programmed to expect specific calls and parameters and can throws exceptions when necessary

## 3 Mock Frameworks

- Most mock frameworks provide easy ways for automatically creating any of these types of test doubles at **runtime**
- They provide a fast means for creating mocking expectations for your tests
- They can be much more efficient than implementing custom mock object of your own creation
- Creating mock object by hand can be tedious and error prone

## 4 Sinon.JS

- Javascript Mocking Framework
- Work in NodeJS and a web browser
- Works well with Mocha and Chai

## 5 Creating a Spy

- Mos basic test double privided by sinon
- created by sinon.spy method
- spy keeps track of:
  - How many times a function was called
  - What parameters were passes to the functions
  - what value the function returned or if it threw

```
it('test spies', () =(){
  let callback = sinon.spy()
  prodFunction(callback)
  expect(callback).to.have.been.called()
})
```

## 6 Method Wrapping Spy

- spies can be created in two fashions: Either anonymous or wrapping a particular method
  - Anonymous spies are used to create fake function that need to be spied on during test
  - Method wrapping spies are created on existing functions such as class methods

```
//Method wrapping Spy
it('test spies'), () => {
  let tc = new TestClass();
  sinon.spy(tc, 'testFunc')
  tc.testFunc()
  expect(tc.testFunc).to.have.been.called()
})
```

## 7 Spi API

- Sinon provides an extensive API for testing made to a spy. For example:
  - spi.callCount - the number of times the spy was called
  - spy.called - True if the spy was called at least once
  - spy.calledWith(arg1, arg2, ...) - Spy was called with the specified arguments (and possibly others)
  - spi.returnValues - Array of returns values made from the spied on function for each call to the function
  - spy.threw - The spy threw an exception at least once
  - Complete API available at: https://sinonjs.org/releases/v.6.1.5/spies

## 8 Sinon Stubs

- Sinon provides an API for Stub test doubles
- like spies they can be anonymous or wrap existing functions
- Stubs support full Spy testing API (methods)
- Stubs are different from spies in that they do NOT call the wrapped function
- Stubs allow you to modify the behavior of the stubbed function call

```
it('test stub', () => {
  let tc = new TestClass();
  sinon.stub(tc, 'testFunc');
  testCall(tc)
  expect(tc.testFunc).to.have.been.called;
})
```

## 9 Sinon Mocks

- Sinon also provides and API for creating mock objects
- Sinon mocks provide all the capabilities of Sinon spies and stubs with the addition of pre programmed expectations.
- A mock verify that the specified expectations have ocurred and if not will fail the test

```
if('test mocks', () => {
  let tc = new TestClass();
  let mock = sinon.mock(tc);
  mock.expects('func').once();
  testCall(tc)
  mock.verify();
})
```

## 10 Sinon Mocks Expectations

- Sinon mocks provides an extensive API of expectations that can be set. For Example:
  - expectation.alLeast - The mock was called at least the specified number of times.
  - expectation.never - verifies the mock was never calls
  - expectation.once - verifies the mock was called once
  - expectation.withArgs = The mock was called with the specified arguments and possibly others
  - expectation.on(obj) - the mock was called with the specified object as "this"
  - Complete API available at: https://sinonjs.org/releases/v.6.1.5/mocks

## 11 Sinon Cleanup

- Sinon creates all of its test doubles in a sandbox
- although you can create your own sandbox you will typically use Sinon's default sandbox
- After each test the sandbox needs to be reset to clear out all the test doubles that were created by calling the sinon.restore method

```
afterEach(() => {
  sinon.restore()
})
```

## 12 Sinon-chai

- The Sinon-Chai library continues the BDD styles expectations provide by Chai weh using Sinon test doubles.
- Provides an API that on your mocks that mimics the chai expect and should APIs
- This helps ensure your unit test consistently follow the Chai BDD style of specifying expectations

```
it('test spies', () => {
  let tc = new TestClass();
  sinon.spy(tc, 'testFunc');
  tc.testFunc();
  tc.should.have.been.called();
})
```

# 5 Best Practices for Unit Testing and TDD

## 1 TDD Best Practices

### Always do the next simplest test case

- Always do the next simplest test case allows you to gradually increase the complexity of your code
- If you jump into the complex test cases too quickly you will find yourself stuck writing a lot of functionality all at once
- Beyond just slowing you down, this can also lead to bad design decisions

### Use Descriptive Test names

- code is read 1000 times more than it's written, Make it clear and readable
- Unit test are the best documentation for how you code works, make them easy to understand
- Test suites should name the class or function under test and the test name should describe the functionality being tested

### Keep Test Fast

- One of the biggest benefits of TDD is the fast feedback on how your changes have affected things
- This goes away if your unit test take more than a few seconds to build and run
- To help your test fast try to:
  - Keep console output to a minimum, this slows things down and can clutter up the testing framework output
  - Mock out any slow collaborators with test doubles that are fast

### Use Code Coverage Tools

- Run your unit test trough a code coverage tool
- It helps with identify any test cases you may have missed
- Goal should be 100% code coverage in functions with real logic(not simple getters and setters)
- istanbul is easy to install (npm install --save-dev nys) code coverage tools nad generates and easy to use html output

### Run your Test Multiple tiime and In Random Order

- Running your test many times will help ensure that you don't have any flaky tests that fail intermittently.
- Running your tests in random order ensures that your tests don’t have any dependencies between each other.
- The “choma” plugin for Mocha provide randomization of the
  execution order of the tests in Mocha.

### Use a Static Code Analysis Tool

- Static code analysis is a core requirement for ensuring code quality.
- JSHint is an excellent open source static code analysis tool that will find errors in your code that you may have missed in your testing.
- JSHint can verify your javascript code meets your team's coding standard.

## 2 Overview of Code Coverage

### What is Code Coverage Analysis?

- Code coverage tools analyze the execution of your production code
  as you run your unit tests to see what parts of the production code
  were executed.
- Code coverage tools produce a report at the end of the execution of
  your unit tests specifying the coverage of the tests.
- The coverage report can tell you if you have any holes in your tests
  where parts of the production code are not being tested.
- Your goal should be to have 100% code coverage of all your
  production code by your unit tests (barring simple getter/setter
  functions).

## Types of Code Coverage Analysis

- Line - With this type of analysis the coverage report specifies which
  executable lines of the production code were executed.
- Statement - This type of coverage goes a step beyond line
  coverage to verify that every individual statement is covered (even
  multiple statements on the same line.
- Branch - Branch testing reports on the percentage of each branch
  point that has been executed at least once.
- Modified Condition/Decision - This is an advance form of branch
  coverage which verifies that all entry and exit points in a program
  has been invoked at least once and with all possible condition
  criteria combinations.

## Istanbul (nyc)

- Code coverage plugin for Javascript both in NodeJS and the
  browser.
- Provides Line, Statement, and Branch coverage
- Can generate reports to the console or in HTML.
- Easy to install via “npm install nyc” and works well with Mocha.
- Webstorm integrates Istanbul code coverage results into the IDE.
