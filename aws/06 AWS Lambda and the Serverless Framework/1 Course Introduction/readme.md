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