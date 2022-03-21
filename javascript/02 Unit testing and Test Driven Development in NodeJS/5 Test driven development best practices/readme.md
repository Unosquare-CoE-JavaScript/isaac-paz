# Best Practices for Unit Testing and TDD

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
