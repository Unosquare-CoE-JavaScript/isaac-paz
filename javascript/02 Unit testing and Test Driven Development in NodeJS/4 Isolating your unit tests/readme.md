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
