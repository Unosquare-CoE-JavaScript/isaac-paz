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
  * DynamodDB
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