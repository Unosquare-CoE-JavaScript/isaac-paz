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

## AWs lambda Pricing

- Pay per calls:
  - First 1,000,000 requests are free
  - $0.20 per 1 million requests
- Pay per durations:
  - 400,000 GB-seconds of compute time per month Free
    - == 400,000 seconds if function is 1GB RAM
    - == 3,200,000 seconds if function is 128 MB RAM
  - After that $1.00 for 600,000 GB-seconds
