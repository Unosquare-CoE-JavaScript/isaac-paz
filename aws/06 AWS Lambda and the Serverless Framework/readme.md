- [1 Introduction](#1-introduction)
- [2 Overview](#2-overview)
- [2 AWS Lambda console - Create your first Lambda Function](#2-aws-lambda-console---create-your-first-lambda-function)
  - [The Serverless Framework](#the-serverless-framework)
    - [Installing](#installing)
    - [Commands](#commands)
- [3 AWS Lambda & Serverless - Deep Dive](#3-aws-lambda--serverless---deep-dive)
  - [Core concepts](#core-concepts)
  - [AWS Functions timeout and Memory](#aws-functions-timeout-and-memory)
  - [IAM Permissions for Lambda Functions](#iam-permissions-for-lambda-functions)
  - [Environment variables](#environment-variables)
  - [VPC for Lambda Functions](#vpc-for-lambda-functions)
  - [AWS lambda Pricing](#aws-lambda-pricing)
- [4 AWS SAM CLI Setup](#4-aws-sam-cli-setup)
  - [AWS Toolkit installation](#aws-toolkit-installation)
- [5 AWS SAM CLI Running AWS Lambda Function Locally](#5-aws-sam-cli-running-aws-lambda-function-locally)
- [6 Create a SAM Lambda app with VSCode](#6-create-a-sam-lambda-app-with-vscode)
- [7 Step Functions](#7-step-functions)
  - [Definition](#definition)
  - [Choice State](#choice-state)
  - [Task State](#task-state)
- [8 Creating Step & State machine Using VS Code](#8-creating-step--state-machine-using-vs-code)
  - [Create a step function from VS core](#create-a-step-function-from-vs-core)

# 1 Introduction

- Objectives
  - Learn About AWS lambda
    - Lambda functions
    - Architecture
    - Events
    - Pricing
  - Learn About the Serverless Framework
    - How to deploy lambda functions
    - How to iterate in development
    - How to clean your stack
  - Hands on - Real World Examples
  - What will we learn
    - Learn about aws lambda with the aws console
    - Deploy a fist hello world function using the console and lambda
    - Learn how to build more complicated integrations
    - Do a real-world example with aws lambda
- Pre-requisites
- AWS Lambda

# 2 Overview

- What is AWS
  - It a cloud provider
  - They provide servers and service that you can use on-demand and scale easily
  - AWS has revolutionized IT over time
  - It powers some of the biggest website in the world (for example Netflix)
  - Introduced Lambda in (2014)
- Why AWS Lambda
  - Virtual server in the cloud
    - Limited by RAM and CPU
    - Continuously running
    - Scaling means being able to add / remove servers
  - Virtual Functions - no servers to manage
    - Limited by time - short executions
    - Run on-demand
    - Scaling is automated!
- Benefits of AWS Lambda
  - Easy pricing
    - Pay per request and compute time
    - Free tier of 1000000 AWS Lambda requests and 400000Gbs of compute time
  - Integrated with the whole AWS Stack
  - Integrated with so many programming languages
  - Easy to monitor through AWS CloudWatch
  - Easy to get more resources per functions (up to 1.5GB of RAM!)
  - Increasing RAM will also improve CPU and network!
- AWS Lambda languages
  - Aws-nodejs
  - Aws-python
  - Aws-python3
  - Aws-groovy-gradle
  - Aws-java-gradle
  - Aws-java-maven
  - Aws-scala-sbt
  - Aws-csharp
- AWS Lambda Integrations(Main ones)
  - API Gateway
  - Kinesis (real time streaming of data)
  - DynamoDB (No-SQL managed database)
  - AWS S3 Simple storage service
  - AWS IoT Internet of things
  - CloudWatch Events
  - CloudWatch Logs
  - AWS SNS Simple Notification Service
  - AWS Cognito

# 2 AWS Lambda console - Create your first Lambda Function

- Deploying Hello World Function Using AWS Lambda
  - Sign up for an AWS Account
  - Create our first Lambda function
  - Test and Run it

## The Serverless Framework

- Aims to ease the pain of creating, deploying, managing, and debugging lambda functions
- It integrates well with CI/CD tools
- it has CloudFormation support so your entire stack con be deployed using this framework

### Installing

- Install dependencies (node & AWS CLI)
- Install the serverless framework
- Setting up AWS for the `serverless-admin` user
- Download credential on your machine
- setup serverless to use credentials

### Commands

- sls create (to create a new project from a template)
- sls deploy (to deploy or update all the project)
- sls deploy function -f ${name_of_the_function} (to update a specific function)
- sls invoke -f ${name_of_the_function} (to invoke or call a specific function)
- sls invoke -f ${name_of_the_function} --log (to invoke printing all log produces in the calling)
- sls logs -f ${name_of_the_function} (retrieve all saved logs of the function)
- sls remove (Remove all objects and dependencies from the project)

# 3 AWS Lambda & Serverless - Deep Dive

## Core concepts

- AWS Lambda Function
  - An independent unit of deployment - code that can be deploy in the cloud
  - Does a single job
    - Saving a user to the DynamoDB
    - Convert a largo image into a thumbnail
    - - make sure to perform one job only in your functions - best practice
- Events
  - Anything that triggers an AWS Lambda function to execute
  - An AWS API Gateway HTTP endpoints
  - An AWS S3 bucket upload
- Resources
  - AWs infrastructure component which your functions use
  - An AWS DynamoDB Table (saving a comment, ...)
  - An AWS S3 bucket (for saving audio files, ...)
  - An AWS SNS (sending message asynchronously)
- Service
  - Framework's unit organization (project file)
  - aws-nodejs-project
  - Where you define your Functions, the events that trigger them and the resources your Functions use
  - A service can be described in YAML or JSON

## AWS Functions timeout and Memory

- It is important to assign a timeout time, because if our function crash an still is running, it is going to still charging money to us
- It can be configure on de serverless.yml file like this:

```
  hello-long-timeout:
    handler: handler.hello
    timeout: 6
    memorySize: 256
    description: "Long timeout function"
```

- You can also provide default values to all function in this manner:

```
provider:
  name: aws
  runtime: python3.8
  timeout: 2
  memorySize: 512
```

## IAM Permissions for Lambda Functions

- our lambda functions access other services
  - S3 storage
  - DynamoDB
- By default our lambda function are not authorized to do that
- So for this, we provide an IAM policy
- IAM allows you to entirely secure your AWS setup
- You can setup a iam role statements in your serverless yaml file and it will create a role automatically with those permissions:

```
provider:
  name: aws
  runtime: python3.8
  profile: serverless-admin
  region: us-east-1

  iam:
    role:
      statements:
        - Effect: "Allow"
          Action:
            - "lambda:*"
          Resource:
            - "*"
```

## Environment variables

- They are good because they provide external configuration to your functions
- This way, we can change function's behavior without even changing the code of the function
- You can set you env variables at the provider level or at the function level:

```
provider:
  name: aws
  runtime: python3.8

  environment:
    variable: value1
    variable2: value3
    FIRST_NAME: "Gina"

functions:
  hello-env-gina:
    handler: handler.hello
  hello-env-marc:
    handler: handler.hello
    environment:
      FIRST_NAME: "Marc"
```

## VPC for Lambda Functions

- VPC are virtual private clouds
  - Many companies use VPC to privately deploy their applications
  - By default Lambda functions are not launched in a VPC
- But you can launch Lambda in your VPC, so that:
  - Your lambda functions can securely access your services
- You can also assign security groups to you lambda functions as well for enhance network security
- You can set it in the provider level or at the function level

```
provider:
  name: aws
  runtime: python3.8
  vpc:
    securityGroupIds:
      - sg-050b3d977de192b3a
    subnetIds:
      - subnet-029900df36c2c00f7
      - subnet-0317c0f7dc36b14c0

functions:
  hello-vpc:
    handler: handler.hello
    # vpc:
    #   securityGroupIds:
    #     - securityGroupId1
    #     - securityGroupId2
    #   subnetIds:
    #     - subnetId1
    #     - subnetId2
```

## AWS lambda Pricing

- Pay per calls:
  - First 1,000,000 requests are free
  - $0.20 per 1 million requests
- Pay per durations:
  - 400,000 GB-seconds of compute time per month Free
    - == 400,000 seconds if function is 1GB RAM
    - == 3,200,000 seconds if function is 128 MB RAM
  - After that $1.00 for 600,000 GB-seconds

# 4 AWS SAM CLI Setup

- Run Lambda locally using AWS toolkit for VS Code
  - You'll need to have VS code installed
- With AWS Toolkit we can:
  - Test code locally with step-through debugging in a Lambda environment
  - Deploy your applications to the AWS Region of your choice
  - Invoke your Lambda functions locally or remotely
  - Specify function configurations such as an event payload and environment variables

## AWS Toolkit installation

- Install VS Code
- Install the AWs Toolkit for VS Code
  - install on VS code plugin "aws toolkit"
  - Use AWS credentials to connect the toolkit to AWS
- Install AWS CLI
  - Run `aws configure` to set your credentials
- Install and run Docker
- Install the AWS Serverless Application Model CLI (SAM) - allows to define, test, and deploy a serverless application" `brew tap aws/tap && brew install aws-sam-cli`
  - Run to check version `sam --version`

# 5 AWS SAM CLI Running AWS Lambda Function Locally

- What is AWS SAM

  - AWS SAM (Serverless Application Model)
  - Used to define your serverless application (remember serverless Framework and the serverless.yml file)
  - AWS SAM consist of the following components:
    - **AWS SAM Template Specification**: you write properties to a file to describe functions, APIs permissions etc.
    - **AWS SAM CLI**: to invoke functions, packages and deploy serverless applications to a AWS cloud and so on
    - **Single deployment configurations**: deploy the whole stack as a single entity
    - **Extension of AWS CloudFormation**: reliable cloudFormation stack deployment
    - Built-in best practices - use AWS SAM to define and deploy your infrastructure as config:
      - **Enforces best practices as code reviews**
    - **Local debugging and Testing**: locally build, test and debug serverless app!
    - **Deep integration with development tools**: integrates well with many other AWS tools and services!

- Commands:
  - `sam build` build the project
  - `sam local invoke` invoke the functions on local environment (requires docker)
  - `sam deploy --guided ` deploy de project on the cloud with assistance
  - `sam local start-api ` deploy the project locally
  - `sam local invoke "HelloWorldFunction"` invoke a function locally
  - `aws cloudformation delete-stack --stack-name sam-app --region us-east-1` Delete the stack (Does not have an output)

# 6 Create a SAM Lambda app with VSCode

**Create de project**

- `ctrl + shift + p` Open command palette
- Chose: AWS: create Lambda SAM Application
- Follow the guide

**Deploy to AWS**

- `ctrl + shift + p` Open command palette
- Chose: AWS: Deploy SAM application
- Follow the guide

**Running locally**

- Go to your debug windows on VSCode and press the run button

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

# 8 Creating Step & State machine Using VS Code

- On AWS VS Code extension you can:
  - Download de definition of the step function
  - Render the Graph
  - Star Execution (Does not show output)

## Create a step function from VS core

- Open command palette and select `AWS: Create a new step function state machine`: Follow guide
- Open command palette and select `AWS: Publish state machine to step function`: Follow guide
