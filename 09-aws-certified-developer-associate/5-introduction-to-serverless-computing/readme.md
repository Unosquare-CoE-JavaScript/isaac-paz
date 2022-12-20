# 5 Introduction to serverless computing

## 5.1 Serverless 101
* Serverless allows you to run your application code in the cloud without having to worry about managing any servers
* AWS handles the infrastructure management tasks so that you can focus on writing code
* AWS takes cares of:
  * Capacity provisioning
  * Patching
  * Auto Scaling
  * High Availability
* competitive advantage
  * Increase speed to market
    * by eliminating the overhead of managing servers, you can release code quickly and get your application to market faster
  * Super Scalable
    * You can have a million users on your website and everything will scale automatically
  * Lower costs
    * You never pay for over-provisioning Serverless applications are event-driven and you are only charged when your code is execute
  * Focus on Your applications
    * AWS offers a range of serverless technologies which integrate seamlessly. Allowing to focus on building great applications.
* List of technologies
  * Lambda: Enables you to run code as functions without provisioning any servers
  * SQS (Simple Queue Service): A message queuing service that allows you to decouple and scale your applications
  * SNS (Simple Notification Service): A messaging service for sending text messages, mobile notifications and emails
  * API Gateway: Allow you to create, publish and secure APIs at any scale
  * Dynamodb: Fully manage noSQL database
  * S3: Object storage and web hosting

# 5.2 Introducing Lambda
* **Serverless compute**
  * Allows you to run your code in AWS without provisioning any servers
  * Lambda takes care of everything required to run your code, including the runtime environments
* Supported Languages
  * JAVA
  * Go
  * Powershell
  * Node.js
  * C#
  * Python
  * Ruby
* Upload your code to lambda and you are good to go
* **Enterprise Features**
  * Auto-scaling and high availability are already baked-in to the Lambda service
* **Pricing**
  * You are charged based on the number of requests, their duration, and the amount of memory used by your Lambda function
  * Requests: 
    * the first 1 million request per month are free
    * 0.20$ per month per 1 million requests
  * Duration:
    * you are charged in 1 millisecond increments
    * the price depends on the amount of memory you allocate to your Lambda function
  * Price per GB-second
    * $0.00001667 per GB-second
    * a function uses 512MB and runs for 100ms
    * 0.5GB * 0.1s = 0.05GB-second = $0.0000000083
    * The first 400,000GB-seconds per month are free 
  
* **Event-Driven Architecture**
  * Event-Driven
    * Lambda functions can be automatically triggered by other AWS services or called directly from any web or mobile app
  * Triggered by Events
    * These events could be changes made to data in an S3 bucket, or DynamoDB table.
  * Triggered by User Requests
    * You can use APi gateway to configure an HTTP endpoint allowing you to trigger you function at any time using HTTP request


* AWS services that can invoke Lambda functions
  * Dynamodb
  * Kinesis
  * SQS
  * Application Load Balancer
  * API Gateway
  * Alexa
  * CloudFront
  * S3
  * SNS
  * SES
  * CloudFormation
  * CloudWatch
  * CodeCommit
  * CodePipeline
  * Many more

* Tips:
  * Extremely Cost Effective
  * Continuous Scaling
  * Event-Driven
  * Independent: Each event will trigger a single Lambda
  * Serverless technology
  * Lambda triggers: be aware of the services that can trigger a Lambda function

## 5.3 Creating a Lambda function using the AWS console (Lab)
* Create a new lambda
* Create a test an execute the test
* Check the logs on Cloudwatch

## 5.4 API Gateway
* **API**
  * API stand for Application Programming Interface
  * We use APIs to interact with web applications, and applications use APIs to communicate with each other
* **What is API Gateway**
  * Publish, Maintain, and Monitor APIs
    * API Gateway is a service which allows you to publish, maintain, monitor, and secure APIs at any scale
  * A Front Door
    * An API is like a front door for applications to access data, business logic, or functionality from you backend services, e.g. applications running on EC2, Lambda
  * Supported API Types
    * RESTful APIs are optimized for stateless, serverless workloads
    * Websocket APIs are for real-time, two-way, stateful communication e.g, chat apps
  * RESTful APIs
    * Representational State Transfer
    * Optimized for serverless and web applications
    * Stateless
    * Supports JSON
      * JavaScript Object Notations
      * A notation language that uses key-value pairs
  * API Gateway provides a single endpoint for all client traffic interacting with the backend of your application
  * What can it do?
    * It allows you to connect to applications running on Lambda, EC2, or Elastic Beanstalk and services like DynamoDB and Kinesis
  * Supports Multiple endpoints and targets
    * Send each API endpoint to a different target
  * Supports Multiple versions
    * Allows you to maintain multiple versions of your API, so you can have different versions for your development, testing, and production environments
  * Serverless
    * cost effective and scalable
  * Integrated with CloudWatch
    * API Gateway logs API calls, latencies, and error rates to CloudWatch
  * Throttling
    * API Gateway helps you manage traffic with throttling so that backend operations can withstand traffic spikes and denial of service attacks.

## 5.4 Building a Serverless Website - (Demo)
* Create a lambda 
* configure a Lambda trigger with an API Gateway endpoint, do not forget to allow CORS
* Create a bucket and make it a static web server
* Insert the index.html and the error.html with reference to the API Gateway endpoint associates with the Lambda to bring content to the web site

## 5.5 Version Control With Lambda - (Demo)
* Lambda Versions
  * When you create a Lambda function, there is only one version: $LATEST
  * when you upload a new version of the code to Lambda, this versions will become $LATEST
* Managing Multiple Versions
  * you can create multiple versions of your function code and use aliases to reference the version you want to use
  * use case: In a development environment you might want to maintain a few versions of the same function
  * Alias: an alias points to a specific version of the function code
* Demo Objectives:
  * Create a function
    * Publish version 1, and create an alias called prod
  * Upload Version 2:
    * Publish version 2, and create an alias called test
  * Review
    * Review the ARNs and aliases that we created

## 5.5 Lambda concurrent Executions Limit

* Concurrent Executions
  * Not necessary to memorize a lots of limits for the exam
  * Be aware that there is a concurrent execution limit for lambda
  * Safety feature to limit to number of concurrent executions across all functions in a given region per account
* Limit:
  * Default is 1000 per region
  * TooManyRequestException
  * HTTP Status code 429
  * Request throughput limit exceeded
  * you can request to increase that limit
* If you have many Lambda function running in the same region and you suddenly start seeing new invocations request being rejected, then you may have hit your limit
* At ACG, our daily usage is around 6.5m Lambda invocations per day in us-east-1
* Request an increase on this limit by submitting a request to the AWs Support Center
* Reserved concurrency guarantees that a set number of executions which will always be available for you critical function, however this also acts as a limit

## 5.6 Lambda and VPC Access
* Some use cases require Lambda to access resources which are inside a private VPC
* e.g. read or write to and RDS database, or shut down an EC2 instance in response to a security alert
* Enabling Lambda to Access VPC Resources
  * To enable this, you need to allow the function to connect to the private subnet
  * Lambda needs to following VPC configurations information so that it can connect to the VPC:
    * Private subnet ID
    * Security group ID (with required access)
    * Lambda uses this information to set up ENIs using an available IP address from your private subnet
  * you can add VPC information to your Lambda function config using the vpc-config parameter
  * Example command: `aws lambda update-function-configuration --function-name my-function --vpc-config subnetIds=subnet-1122aabb,SecurityGroupIds=sg-51530134`
  
## 5.7 Step Function - Demo
* Provide a visual interface for serverless applications, which enables you to build and run serverless applications as a series of steps
* Each step in your application executes in order, as defined by your business logic
* The output of one step may act as an input to the next step
* Orchestration for serverless applications
  * Manage the logic of your applications
  * Including sequencing, error handling, and retry logic, so your application executes in order, and as expected
  * step function also log the state of each step, so when things go wrong, you can diagnose and debug problems quickly
* consist in:
  * State machine: workflow definition
  * Tasks: the steps defined in the workflow

* Exam Tips:
  * Visualize
    * Great way to visualize your serverless application
  * Automate
    * Step functions automatically trigger and track each step, The output of one step is often the input to the next
  * Logging
    * step functions log the state of each step, so if something goes wrong you can track what when wrong, and where

## 5.8 Building a Serverless Application Using step functions, API Gateway, Lambda, and S3 on AWS
* Description:
  * In this AWS hands-on lab, we will create a fully working serverless reminder application using S3, Lambda, API Gateway, Step Functions, Simple Email Service, and Simple Notification Service.
  While the lab does use Python and JavaScript, you don't need to be able to code to understand and implement the solution. By the end of the lab, you will feel more comfortable architecting and implementing serverless solutions within AWS.
* Learning Objectives
  * Create the Lambda Functions
  * Create a Step Function State Machine
  * Create the API Gateway
  * Create and Test the Static S3 Website

## 5.9 Building and Troubleshooting a Serverless Web Application
* Description:
In this hands-on lab, we are going to build and troubleshoot a serverless web application using the following technologies:
  * DynamoDB
  * Lambda
  * API Gateway
  * S3
  * X-Ray
* Objectives:
  * Create a DynamoDB Table
  * Create a Lambda Function with an API Gateway Endpoint
  * Create an S3 Bucket and Upload the Website Files
  * Configure X-Ray
  * Review The X-Ray Service Map

## 5.10 Comparing Step functions Workflows
* Step functions workflows
  * Step function provides various types of state machines that feature different workflows to cater to a variety of tasks that you would like to orchestrate
  * the king of tasks you are orchestrating determine the type of workflow you should use
  * types:
    * **Standard workflows**:
      * Long-running: long-running, durable, and auditable workflows that may run for up to a year. Full execution history available for up to 90 days after completion
      * At-Most-Once-Model: Tasks are never executed more than once unless you explicitly specify retry actions
      * Non-Idempotent Actions: When processing payments, you only want a payment to be processed once, not multiple time
      * Change in State?: A request is non-idempotent if it always causes a change in state (e.g. sending the same email multiple times causes a change in state because you end up with multiple emails in your inbox)
    * **Express Workflows**:
      * short-lived: Up to 5 minutes Great for high-volume event-processing-type workloads
      * At-least-once model: ideal if there is a possibility that an execution might be run more than once or you require multiple concurrent executions
      * Idempotent model: for example, transforming input data and storing the result in DynamodB
      * Identical Request has no side effect: A request is considered idempotent if an identical request can be made once or several times in a row with no additional side effects (e.g reading data from a database or S3 bucket)
    * We have 2 different types of express workflows
      * Synchronous
        * Begins the workflow
        * Waits until it completes
        * Returns the result
        * Great for operations that are performed one at a time. The workflow must complete before the next begins
      * asynchronous 
        * Begins a workflow
        * confirms the workflow has started
        * The result of the workflow can be found in CloudWatch Logs
        * Great if services or operations do not depend on the completion and result of your workflow

## 5.11 Understanding X-Ray
* X-Ray is a tool which helps developers analyze and debug distributed applications.
* Allowing you to troubleshoot the root cause of performance issues and errors
* Provides a visualization of your application's underlying components
* Integrations:
  * AWS Services: You can use it with EC2, Elastic Container Service, Lambda, Elastic Beanstalk, SNS, SQS, DynamodB, Elastic Load Balancer and API Gateway
  * Integrate With Your Apps: You can use X-Ray with applications written in Java, Node.js, .NET, Go, Ruby, Python
  * API Calls: The X-Ray SDK automatically captures metadata for API calls made to AWS services using the AWS SDK
* Architecture:
  * Install the X-Ray agent: Install the agent on your EC2 instance
  * Configure: instrument your applications using the X-Ray SDK
  *  The X-Ray SDK: it gathers information from request and response headers, the code in your applications, and metadata about the AWS resource on which it runs, and sends this trace data to X-Ray

## 5.12 X-Ray configuration
* The AWS X-Ray SDK send the data to the X-Ray daemon which buffers segments in a queue and uploads them to X-Ray in batches
* You need both the X-Ray SDK and the X-Ray daemon on your systems
* x-Ray High Level configuration steps
  * Requirements
    * X-Ray SDK
    * X-Ray daemon
  * You use the SDK to instrument your applications to send the required data. e.g.g data about incoming and outgoing HTTP request that are being made to your Java application
  * Steps
    * Install 
      * On premises & EC2 instances: install the X-Ray daemon on your EC2 instance or on-premises server
      * Elastic Beanstalk: Install the X-Ray daemon on the EC2 instances inside your Elastic Beanstalk environment
      * Elastic Container Service: Install the X-Ray daemon in its own docker container on your ECS cluster alongside your app
  * Annotations & Indexing
    * When instrumenting you application, you can record additional information about requests by using annotations
    * Annotations are simple key-value pairs that are indexed for use with filter expressions, so that you can search for traces that contain specific data and group related traces together in the console

## 5.13 Advances API Gateway
* Importing APIs into API Gateway
  * Importing API Definition Files
    * You can use the API Gateway import API feature to import an API using a definition file
  * Supported protocols:
    * OpenAPI, formerly known as Swagger, is supported
  * Create New and Update Existing APIs
    * You can use an OpenAPI definition file to create a new API or update an existing API
* Legacy Protocols
  * For example, SOAP(simple object access protocol) which returns a response in XML format instead of JSON, is a legacy protocol
  * You can configure API Gateway as a SOAP web service passthrough
  * You can also use API Gateway transform the XML response to JSON

## 5.14 API Gateway Caching and throttling
* API Gateway Caching
  * Caches your endpoints response
    * this reduces the number of calls made to your endpoint and can also improve the latency for request to your API
  * TTL
    * when you enable caching, API Gateway caches responses from your endpoint for a specified time-to-live(TTL) period, in seconds, The default is 300 seconds or 5 minutes
  * API Gateway Returns the Cached response
    * API Gateway then responds to new requests by looking up the response from the cache, instead of making a new request to your application
  * This improves the performance of the APi and the latency to your end users, by caching the output of API calls to avoid calling your backend application every time 
* API Gateway Account Level Throttling
  * The purpose of this is to prevent your API from being overwhelmed by too many requests
  * Default limits:
    * by default, APi Gateway limits the steady-state request rate to 10,000 requests per second, per Region
  * concurrent requests:
    * the maximum concurrent requests is 5,000 requests across all APIs per region.
    * you can request an increase on there limits
  * 429 Error
    * if you exceed 10,000 requests per second or 5,000 concurrent requests you will receive a 429 Too Many Requests error message


