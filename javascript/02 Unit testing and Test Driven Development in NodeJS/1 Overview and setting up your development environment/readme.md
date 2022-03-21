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
