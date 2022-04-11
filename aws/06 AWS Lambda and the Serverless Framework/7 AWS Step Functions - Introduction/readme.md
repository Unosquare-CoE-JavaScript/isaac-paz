# 7 Step Functions

- AWS Step functions
  - A Service that allows developer build visual workflows for business processes
    - Orchestrate data flow in a automated environment
    - For example: check if username and email provided are valid, if so, then allow users to open a new Account
    - Base on state machines and tasks
  - Benefits
    - Build and deploy fast
      - User the workflow studio to simply drag-and-drop
      - Express complex business logic as low-code, event-driven-workflows
      - Connect services(aws), systems or people quickly
    - write less integration code
      - Ready to use resources and services available
    - Reliable and Scalable
      - used for small projects as well as large
      - Reliable - has built-in try/catch, retry and rollback capabilities for error handling
    - Combine Lambda functions with a human approval
      - Use SNS to notify a human for validation
  - Building Blocks
    - State functions is based on
      - State machines
        - States are not the same thing as tasks, they are one of the state types:
          - Pass: Pushes input to output
          - Task: Takes input and produces output
          - Choice: Allows the user to use Branching Logic based on the input
          - Wait: it adds delays to State Machine Execution
          - Success: Has and expected finish-line: dead-end that stops execution successfully
          - Fail: has an expected dead-end - stops execution with a failure
          - Parallel: Implements parallel branches in execution -- use can start multiple states at once
          - Mapping: (Dynamic): Runs a set of steps for every input item
      - Tasks (takes input and produces output)
  - Pricing
    - Charged base on the number of state transitions required to execute your applications
      - 4000 state transitions per month are free (Free tier)
      - 0.000025 per state transition thereafter
      - == $0.025 per 1000 state transitions

## Definition

- It can be defined on amazon console, on the step functions, in a json format like this:

```
{
"Comment": "A Hello World example of the Amazon States Language using Pass states",
"StartAt": "Hello",
"States": {
    "Hello": {
      "Type": "Pass",
      "Result": "Hello",
      "Next": "World"
    },
    "World": {
      "Type": "Pass",
      "Result": "World",
      "End": true
    }
  }
}
```

## Choice State

- **Choice** Allows the user to use Branching Logic based on the input

## Task State

- Takes input and produces output
  - For example, a Lambda function that calculates the age of a cat in human years
