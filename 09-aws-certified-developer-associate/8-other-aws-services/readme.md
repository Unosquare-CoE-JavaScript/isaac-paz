# 8 Other KMS Services
## 8.1 SQS
* Simple queue service
* It is a message queue service
* Enables web service applications to quickly and reliably queue messages that one component in the application generate for another component to consume
* A queue is a temporary repository for messages awaiting processing
* Partially processed messages are not going to be delete
* Works for decoupling your infrastructure
* Features:
  * Decuple application components
    * Decuple the components of an application so they run independently, easing message management between components
  * Store messages:
    * Any component of a distributed application can store messages in the queue. Messages can contain up to 256 KB of text in any format
  * Retrieve Messages:
    * Any component can later retrieve the messages programmatically using the Amazon SQS API
* A buffer between components
  * A buffer between the component receiving the data for processing, and the component producing and saving the data
* Resolves scheduling issues:
  * The queue resolves issues that arise if the producer is producing work faster than the consumer can process it 
  * If the producer or consumer are only intermittently connected to the network
* Key facts:
  * SQS is pull-based, not pushed based
  * Messages is up to 256KB in size 
  * Text Data: including XML, JSON and unformatted text
  * Guarantee: Messages will be processed at least once
  * Up to 14 Days of retention 
* Exam tips:
  * Distributed messages queueing systems
  * Allows uo to decouple the components of an application so that they are independent
  * Pull-base, not push-based

## 8.2 Understanding SQS Queue Types
* There are two types
* Standard queues are the default, which provide best-effort ordering
* FIFO (first in first out) queue are also available
* Standard queue
  * Unlimited transactions:
    * Nearly-unlimited number of transactions per second
  * Best-Effort Ordering
    * Standard queues provide best effort ordering which ensures that message are generally delivered in the same order as they are sent
    * occasionally (because of the highly-distributed architecture that allows high throughput), more than one copy of a message might be delivered out of order
  * Guarantee that a message is delivered at least once
* FIFO queues
  * First-in-First-Out Delivery
    * The order in which messages are sent and received is strictly preserved
  * Exactly-Once Processing
    * A message is delivered once and remains available until a consumer processes and deletes it. Duplicates are not introduced
  * 300 Transactions Per Second limit
    * but have all the capabilities of standard queues

## 8.3 SQS Settings
* Visibility timeout
  * Is the amount of time that the message is invisible in the SQS queue after a reader picks up that message
  * default: 30 seconds
  * increase if necessary
  * maximum is 12 hours
* Polling
  * Short polling
    * Returns a response immediately even if the message queue being polled is empty
    * This can result in a lot of empty responses if nothing is in the queue
    * you will still pay for these responses
  * Long Polling
    * Periodically polls the queue
    * Does not return a response until a message arrives in the message queue or the ling poll times out
    * Can save money
    * Long polling is generally preferable to short polling

## 8.4 SQS Delay Queues & Managing Large Messages
* SQS delay queues - postpone delivery of new messages
  * Postpone delivery of new messages to a queue for a number of seconds
  * Messages sent to the Delay queue remain invisible to consumers for the duration of the delay period
  * Default delay is 0 seconds, maximum is 900
  * For standard queues, changing the setting does not affect the delay of messages already in the queue, only new messages
  * For FIFO queues, this affects the delay of messages already in the queue
* When should you use a delay queue
  * Large distributed applications which may need to introduce a delay in processing
  * you need to apply a delay to an entire queue of messages
  * e.g. adding a delay of a few seconds, to allow for updates to your sales and stock control databases before sending a notification to a customer confirming an online transaction
* Managing Large SQS Messages
  * Best practice for managing large sqs messages is S3
    * for large SQS messages - 256KB up to 2GB in size
    * use s3 to store messages
    * use amazon sqs extended clint library for Java to manage them
    * YOU will also need the AWS SDK for java, provides an API for s3 bucket and object operations

## 8.5 Triggering AWS Lambda from amazon SQS
* In this hands-on AWS lab, you will learn how to trigger a Lambda function using SQS. This Lambda function will process messages from the SQS queue and insert the message data as records into a DynamoDB table.
* Objectives
  * Create the Lambda Function
  * Create the SQS Trigger
  * Copy the Source Code into the Lambda Function
  * Log In to the EC2 Instance and Test the Script
  * Confirm Messages Were Inserted into the DynamoDB Table

## 8.6 SNS - Simple Notification Service
* A web service that makes it easy to set up, operate, and send notification from the cloud
* Messages sent from an application can be immediately delivered to subscribers or other applications
* Used to create:
  * Push notifications
    * To devices(e.g. apple, google, fire os, windows, android)
  * SMS and Email
    * SMS text message or email to amazon simple queue service(SQS) queues or any HTTP endpoint
  * Lambda
    * Trigger lambda functions to process the information in the message, publish to another SNS topic, or send the message to another AWS service
* How does it work
  * Uses a pub-sub model - publish and subscribe
  * Applications publish or push messages to a topic, subscribers receive messages from a topic
  * Notifications are delivered using a push mechanism that eliminates the need to periodically check or poll for new information and update
* What is a Topic
  * it is an access point, Allowing recipients to subscribe to, and receive identical copies of the same notification. SNS delivers appropriately-formatted copies of the message to each subscriber (e.g. IOS,Android, SMS, etc)
* What about Durability
  * Durable storage
    * Prevents messages from being lost
    * all messages published to SNS are stored redundantly across multiple Availability Zones
  * Benefits:
    * Instantaneous:
      * Instantaneous, push-based delivered (no-polling)
    * Simple
      * Simple APIs and easy integration with applications
    * Flexible:
      * Flexible message delivery over multiple transport protocols
    * Inexpensive:
      * Inexpensive, pay-as-you-go model with no up-front costs
    * Easy to configure:
      * web-based AWS management console offers the simplicity of a point-and-click interface
    * Managed Service
      * With all the high availability and durability features needed for a production environment
  * Selecting the right solution
    * SNS
      * messaging service
      * push based
      * think push notifications
    * SQS
      * messaging service
      * SQS is pull-based
      * think polling the queue for messages periodically

## 8.7 SES VS SNS
* SES (Simple Email Service)
  * features 
    * Scalable and highly available email
      * Designed to help marketing teams and application developers send marketing, notification, and transactional emails to their customer using a pay-as-you-go model
    * Send and receive email
      * can also be used to receive emails with incoming mails delivered to an S3 bucket
    * Trigger lambda an SNS
      * incoming emails can be used to trigger lambda functions and SNS notifications 
  * use cases
    * automated emails
      * Notification that there is a new post in a discussion forum that you moderate
    * online purchases
      * Purchase confirmations, shipping notifications, and order status updates
    * marketing emails
      * marketing communications, advertisements, newsletters, special offers, new products, and black friday deals.
* SES vs SNS
  * SES
    * Email messaging service
    * can trigger a lambda function or sns notifications
    * can be used for both incoming and outgoing email
    * an email address is all that is required to start sending messages
  * SNS
    * Pub/Sub messaging service
    * formats include: SMS, HTTP, SQS, email
    * Can trigger a lambda function
    * Can fan-out messages to a large number of recipients (replicate and push messages to multiple endpoints and formats)
    * Consumer must subscribe to a topic to receive the notifications
  
## 8.8 Kinesis 101
* what it kinesis
  * A family of services that enables you to collect, process, and analyze streaming data in real time
  * Allows you to build custom applications for your own business
  * Kinesis is originally a greek word, meaning movement or motion
  * Amazon kinesis deals with data that is in motion, or streaming data
* What is streaming data
  * Data generated continuously by thousands of data sources that typically send in the data records simultaneously and in small sizes (kilobytes)
  * Financial transactions
  * Stock prices
  * Game data (as the gamer plays)
  * Social media feeds
  * Location-tracking data (Uber)
  * IoT sensors
  * ClickStream data
  * Log files
* Four Core Services
  * Kinesis Streams
    * Stream data and video to allow you to build custom applications that process data in real time
    * Two services:
      * Data streams and video streams
  * Kinesis Data Firehouse
    * Capture, transform, and load data streams into AWS data stores to enable near real-time analytics with BI tools
  * Kinesis Data analytics
    * analyze, query and transform streamed data in real time using standard SQL. Store the results in an AWS data store
* Kinesis Data Streams
  * A producers send data to kinesis data stream, data is store in things called shard for 24 hours to 365 day retention
  * Consumers takes the data from the shard and process it, once completed the calculation the consumer can save the data in other place
  * Kinesis shards
    * Kinesis stream are made up of shards
    * Each shard is a sequence of one or more data records and provides a fixed unit of capacity
    * Each shard have five reads per second
    * The max total read rate is 2MB per second
    * 1,000 writes per second
    * The max total write rate is 1MB per second
    * Data capacity of the stream is determined by the number of shards
    * if the data rate increases, you can increase the capacity on your stream by increasing the number of shards
  * All in order
    * Each record in the stream has a unique sequence number that identifies it
    * With kinesis streams, the order of records is maintained
* Kinesis Video Streams
  * Securely stream video from connected devices to AWS
  * Videos can be used for analytics and machine learning
* Kinesis Data Firehouse
  * Producers send data to Firehouse, there is no shards, and capacity is automatically manages
  * Consumers are optional
  * There is no data retention
  * Save the data into another permanent storage like an S3, OpenSearch 
* Kinesis Data analytics
  * Producers send data to kinesis stream and data firehouse, then you can connect this data into kinesis data analytics to query your data with standard SQL and save the result of the query into S3, OpenSearch, or Redshift
  * this is about real time analytics
* Understand the difference
  * Data and Video Streams
    * Capture and store streaming video and data. Consumer application process and analyze the data in real time
  * FireHose
    * Capture, Transform, and load data continuously into AWS data stores, Existing Bi applications and tools can be used for near real-time analysis of the stored data
  * Data analytics
    * Real-time analytics using standard SQL data received by Kinesis data stream and kinesis data firehose. stores the processed data in AWS data stored (e.g. S3, redshift, or OpenSearch)

## 8.9 Setting up a Kinesis Stream - Demo
* Using cloud formation
  * It is going to create an EC2 Java app (Producer and consumer)
  * Kinesis Data Stream (Capture streaming data)
  * DynamoDB (store the data)

## 8.10 Kinesis Shards and Consumers
* Kinesis recap
  * A kinesis data stream is a set of shards
  * A shard is a sequence of data records in a stream, each data record has a unique sequence number
  * The data capacity of your stream is the sum total capacity of its shards
  * Per shard:
    * 5 read transactions per second, up to a max of 2MB per second
    * 1000 write records per second, up to a max of 1MB per second
  * As you data rate increases, you increase the number of shards(resharding)
* But what about consumers (Kinesis Client Library)
  * Kinesis client library runs on the consumer instances
  * Tracks the number of shards in your stream
  * Discovers new shards when you reshard
  * if you have only one consumer, the KCL will create all the record processors on a single consumer
  * If you have two consumers it will load balance an create half the processors on one instance and half on another
* Scaling out the consumers
  * With KCL, generally you should ensure that the number of instances does not exceed the number of shards (except for failure or standby purposes)
  * You never need multiple instances to handle the processing load on one shard
  * However, one worker can process multiple shards
  * It's fine if the number of shards exceeds the number of instances
  * Don't think that just because you reshard, that you need to add more instances
  * Instead, CPU utilization is what you should drive to quantity of consumer instances you have, NOT the number of shards in your kinesis stream
  * Uso an Auto Scaling group, and base scaling decisions on CPU load on your consumers

* Exam tips
  * The kinesis clinet library running on your consumers creates a record processor for each shard that is being consumed by your instance
  * If you increase the number of shards, the KCL will add more record processors on your consumers
  * CPU utilization is what should drive the quantity of consumers instances you have, Not the number of shards in your kinesis stream
  * Use an Auto scaling group, and base scaling decisions on CPU load on your consumers

## 8.11 Introducing Elastic Beanstalk
* what is it?
  * Allows you to deploy and scale your web applications
  * Support languages: Java, .NET, PHP, Nodejs, python, ruby and go
  * Supported platforms: Apache tomcat, Docker
  * Developers benefits
    * Focus on writing code, and don't worry about any of the underlying infrastructure needed to run the application
* What does elastic beanstalk handle:
  * Infrastructure: provisioning infrastructure, load balancing, auto scaling, and application health monitoring
  * Application platform: Installation and management of the application stack including patching and updates to your operating system and application platform
  * you are in control: You have complete administrative control of the AWS resources
  * No additional charges for using Elastic Beanstalk
* Benefits for developers
  * Developers do not have to be sysadmins
  * You don't need to worry about any of the underlying infrastructure needed to run the application
  * Get you application to market faster
  * Fastest and simplest way to deploy you application on AWS

* Exam tips
  * Deploy and scale applications including the web application server platform
  * Los of programming languages
  * Managed platforms like Apache tomcat, docker
  * Provision AWS Resources like: EC2, RDS, S3, load balances, auto scaling groups
  * System administration: OS and application server updates, Monitoring, metrics, adn health checks are all included
  * Administrative Control: Can fully manage the EC@ instances for you, or you can take full administrative control

## 8.12 Updating Elastic Beanstalk
* Several options for deployments updates
  * All at once
    * Deploys to all hosts concurrently
    * You will experience a total outage
    * Not ideal for mission-critical production systems
    * Rollback
      * If the update fails, you need to roll back the changes by re-deploying the original version to all your instances. Resulting in another outage to get back to the previous version
    * Only use it on development or testing environment, not on Production
  * Rolling
    * Deploys the new version in batches
    * Each batch is taken out of service while the deployment takes place
    * You environment capacity will be reduced by the number of instances in a batch while the deployment takes place
    * Not ideal for performance sensitive systems
    * Rolling back
      * If the update fails, you need to perform an additional rolling update to roll back changes
  * Rolling with additional batch
    * Launches an additional batch of instances. 
    * Then deploys the new version in batches
    * Maintains full capacity throughout the deployment
    * Rolling back
      * if the updates fails, you need to perform an additional rolling update to roll back the changes
  * Immutable
    * Deploys the new version to a fresh group of instances before deleting the old instances
    * only when the new instances pass their health checks, should the old instances be terminated
    * Rolling back
      * If a deployments fails, just delete the new instances
    * this is the preferred approach for mission critical systems
  * Traffic splitting
    * Install the new version on a new set of instances, like an immutable deployments
    * Forwards a percentage of incoming client traffic to the new application version for a specified evaluation period
    * If the new instances stay healthy, Elastic Beanstalk forwards the 100% of the traffic to them, and terminates the old ones
    * Enables canary testing

## 8.13 Deploying an application with elastic Beanstalk - Demo
* overview
  * Php code in a zip file
  * we are going to upload it to Beanstalk
  * Elastic Beanstalk is going to create an EC2 and publish the app to be accessible form the internet

## 8.14 Advances Elastic Beanstalk
* Customizing your elastic beanstalk environment
  * The configuration is different for Amazon linux 1 and amazon linux 2
  * Amazon Linux 1
    * configuration file:
      * Define packages to install, create linux users and groups, run shell commands, enable services, and configure load balancers
      * Can be written on YAML or JSON format
      * constrains: The file must have a .config extension an be inside a folder called .ebextensions in the top-level directory of your application source code bundle
  * Amazon linux 2
    * It is recommended that you use BuildFile, ProcFile, adn platform hooks whenever possible to configure and run custom code on your environment instances during instance provisioning
    * BuildFile
      * For commands that run for short periods, and then exit upon task completion
      * Create you BuildFile in the root directory of your application source
      * Format: `<process_name>:<command> make: ./build.sh` <- reference a script in your source code bundle
    * ProcFile:
      * For long-running application processes
      * Create a file called ProcFile in a the root directory of you application source
      * Format: `<process_name>:<command> make: ./build.sh` <- reference a script in your source code
      * Elastic Beanstalk expects processes defined in the ProcFile to run continuously, it monitors and restarts any processes that terminate
    * Platform Hooks:
      * Custom scripts or executable files that you would like Elastic beanstalk to run at a chosen stage of the EC2 provisioning process
      * Store in dedicated directories in your application source code
      * Format: .platform/hooks/prebuild files that you want EB to run before builds, sets up, and configure the application and web server
      * Format: .platform/hooks/predeploy files that you want to run after it sets up and configure the application and web server but before it deploys them to the final runtime location
      * Format: .platform/hooks/postdeploy: files that run after EB deploys the application the las deployment workflow step  

## 8.15 EDS & Elastic Beanstalk
* EB supports two ways of integration an RDS database with your Beanstalk environment: deploy your RDS inside your EB environment, or outside  of it
  * Option 1: Launch RDS within EB environment
    * Launch the RDS instances from within the EB console
    * Its created within your EB environment
    * If you terminate the environment, then database will also be terminated
    * It's good option for DEv and Test deployments, not so good for Prod
  * Option 2: Lunch the RDS outside of EB
    * Don't use EB to create you RDS database
    * Instead use the RDS console or AWS cli
    * It allows you to tear down your application environment without affecting the database instance
    * This is the preferred approach for production systems
    * Connection to an outside database:
      * An additional security group must be added to your environments auto scaling group
      * You'll need to provide connection string information to your application servers using EB environment properties
  
## 8.16 Migration Application to Elastic Beanstalk
* Scenario
  * Image you have a .NET application running on windows server in your own data center, you want to migrate this application to AWS and run it in Elastic Beanstalk
* Migration Assistant Tool
  * Windows Web application migration assistant
    * Formerly known as .NET Migration Assistant for Elastic Beanstalk
  * Interactive Powershell utility
    * Enables you to migrate a .NET application, or entire website from windows servers in your data center, to Elastic Beanstalk in AWS
  * Open source

## 8.17 Other AWS services summary part 1


