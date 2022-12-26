# 6 DynamoDB
## 6.1 Introduction to DynamoDB
* Fast and flexible NoSQL Database
* consistent, single-digit millisecond latency at any scale
* Fully managed
  * Supports key-value data models. 
  * Supported document formats are JSON, HTML, and XML
* Use cases
  * A great fit for mobile, web , gaming, ad tech, IoT, and many other applications
* Serverless
  * Integrates well with lambda
  * It can be configured to automatically scale
  * A popular choice for developers and architects who are designing serverless applications
* Features
  * Performance: SSD storage
  * Resilience: Spread across 3 geographically distinct data centers
  * Consistency (Two options)
    * **Eventually consistent reads**
      * Consistency across all copies of data is usually reached within a second
      * Best for read performance
    * **Strongly consistent reads**
      * A strongly consistent read always reflects all successful write
      * Writes are reflected across all 3 locations at once
      * Best for read consistency
    * ACID Transactions
      * DynamoDB transactions provide the ability to perform ACID transactions (Atomic, Consistent, Isolated, Durable)
      * Read or write multiple items across multiple tables as an all or nothing operation
* DynamodbDB Transactions
  * Items: is a record inside dynamodb database
  * attribute: is a column or field of the table
* Primary Keys
  * What is a primary key
    * DynamodbDB stores and retrieves data based on a primary key
  * Two types
    * Partition key
    * composite key (partition key + sort key)
  * **Partition key**
    * A unique attribute
    * for example: Customer_ID, product_ID, email address, vehicle registration number
    * The value of a partition key is input to an internal hash function which determines the partition of physical location on which the data is stored
    * Id you are using the partition key as your primary key then no two item can have the same partition key
  * **Composite Key**
    * A combination between a Partition key + Sort key
    * A unique combinations
      * items in the table may have the same partition key, but they must have a different sort key
    * Storage
      * All items with the same partition key are stored together and then sorted according to the sort key value

## 6.2 Creating A DynamoDB Table - Demo
* Create an IAM User
  * DynamoDB access
* Create an EC2 Instance
  * configure the AWS CLI
* Create a DynamoDB Table
  * Create the table using the AWS CLI populate the table with items

## 6.3 DynamoDB Access Control
* Controlling Access to DynamoDB
  * IAM
    * authentication and access control is managed using AWS IAM
  * IAM Permissions
    * You can create IAM users within your AWS account with specific permissions to access and create DynamoDB tables
  * IAM Roles
    * You can also create IAM roles, enabling temporary access to DynamoDB
* Restricting User Access
  * You can also use a special IAM condition to restrict user access to only their own records
  * This can be done by adding a condition to an IAM Policy to allow access only to items where the partition key value matches their User_ID example:
  * ``` 
    "Condition": {
      "ForAllValues :StringEquals": {
        "dynamodb: LeadingKeys": [
          "${www.mygame.com:user_id)"
        ],```

## 6.4 Indexes Deep dive
* What is a secondary index
  * Flexible Querying
    * Query based on a attribute that is not the primary key
    * DynamoDB allows you to run a query on non-primary key attributes using global secondary indexes and local secondary indexes
    * A secondary index allows you to perform fast queries on specific columns in a table. You select the columns that you want included in the index and run your searches on the index, rather than on the entire database
  * **Local Secondary index**
    * Primary key
      * same partition key as your original table but different sort key
    * A different view
      * Gives you a different view of your data, organized according to an alternative sort key 
    * Faster Queries
      * Any queries based on this sort key are much faster using the index than the main table
    * An Example
      * Partition key: user ID
      * Sort key: account creation date
    * Add at creation time
      * Can only be created when you are creating your table, You cannot add, remove or modify it later
  * **Global Secondary index**
    * A completely different primary key
      * Different partition key and sort key
    * View Your data Differently
      * Gives you a completely different view of the data
    * Speed up queries
      * Speeds up any queries relating to this alternative partition and sort keys
    * An Example:
      * Partition Key: email address
      * Sort key: last log in date
    * Flexible:
      * You can create when you create your table, or add it latter

* Tips
  * Local secondary index
    * Same partition key and different sort key to your table
    * Must be created when you create your table
  * Global Secondary index
    * Different partition key and different sort key to your table
    * can be created at any time

## 6.5 AWS DynamoDB in the Console Creating Tables, Items, and Indexes
* Description:
  * Welcome to this live AWS environment for learning the fundamentals of using DynamoDB in the AWS console. This lab provides you with essential exposure to database concepts such as partition and sort keys, how to add, delete, and update items, as well as attributes inside of a DynamoDB table. Indexes give access to alternate query patterns and can speed up queries. Secondary keys allow efficient access to data with attributes other than the primary key. You can create one or more secondary indexes on a table. Query or Scan requests can be done against those indexes. In the lab, you will add local and global secondary indexes, and use the local secondary index to query for items in your table.
  
* Objectives
  * Create a DynamoDB Table
  * Add Items to Your Table
  * Add a Global Secondary Index to your Table

## 6.6 Scan Vs Query API Call - Demo
* what is a query
  * A query finds items in a table based on the primary key attribute and a distinct value to search for
  * For example: selecting an item where the user ID is equal to 212 will select all the attributes for that item (e.g., first name, surname, email address)
  * Refine your query
    * use an optional sort key name and value to refine the results
      * for example: if you sort key is a timestamp, you can refine the query to only select items with a timestamp of the last 7 days
    * by default, a query returns all attributes for the items you select, but you can use the ProjectionExpression parameter if you want to only return the specific attributes you want (e.g., if you only want to see the email address rather than all the attributes)
  * Query result are always sorted by the sort key
    * In Ascending numeric order by default
    * ASCII character code values
    * You can reverse the order by setting the ScanIdexForward parameter to false (only for query)
    * by default, queries are eventually consistent
    * you need to explicitly set the query to be strongly consistent if you want that
* What is a Scan
  * A scan examines every item in the table. by default, it return all data attributes
  * use the ProjectionExpression parameter to refine the scan to only return the attributes you want
* Query or Scan
  * Query is more efficient than a scan: 
    * A scan dumps the entire table and filters out the values to provide the desired result, removing the unwanted data
  * Extra Step
    * Adds an extra step of removing the data you do not want, As the table grows, the scan operation takes longer
  * Provisioned Throughput
    * A scan operation on a large table can use up the provisioned throughput for a large table in just a single operation
* How to improve scan performance
  * Sequential by Default
    * A scan operation processes data sequentially returning 1MB increments before moving on to retrieve the next 1MB of data
    * scans one partition at a time
  * Parallel is possible
    * you can configure DynamoDB to use parallel scans instead by logically dividing a table or index into segments and scanning each segment in parallel
  * Beware
    * it is best to avoid parallel scans if your table or index is already incurring heavy read or write activity from other applications, it can impact the other applications
  * Isolate your scan operations to specific tables and segregate them from your missing-critical traffic, even if that means writing data to 2 different tables
* Improve Query and Scan Performance
  * Set a smaller page size: (e.g. 40 items)
  * Running a larger number of operations will allow other request to success without throttling
* Avoid scans as possible
* Design your table in a way that you can use the Query, Get or BatchGetItem APIs

## 6.7 Using DynamoDB API calls
* We can use API calls to programmatically interact whit our DynamoDB table (e.g. query, delete, or add items)
* when use the AWS CLI to run the get-item command, we are interacting with the DynamoDB GetItem API
* Commonly Used Commands
  * create-table: Create a new table
  * put-item: Adds a new item into a table or replaces and old item with a new one
  * get-item: Returns a set of attributes for an item with the given primary key
  * update-item: Allows you to edit the attribute of an existing item(e.g. add or delete attributes)
  * update-table: used to modify a table
  * list-table: Returns a list of tables in your account
  * describe-table: Return information about the table
  * scan: Reads every item in a table and return all items and attributes, Use a FilterExpression to return fewer items
  * query: Queries that able based on a partition key value that you provide
  * delete-item: Allows you to delete an item based on its primary key
  * delete-table: Deletes a table including all of its items
* Do i need to know all of these commands:
  * You should understand what they are used for at a high level, understand the differences between them, and be aware that the user must have the correct IAM permissions.

## 6.8 DynamoDB Provisioned Throughput 
* Measured in capacity units
  * Specify requirements
    * When you create your table, you can specify your requirements in terms of read capacity units and write capacity units
  * Write Capacity Units
    * 1 x write capacity unit = 1 x 1KB write per second
  * Read capacity Units
    * 1 x read capacity unit = 
      * 1 x strongly consistent read of 4KB per second
      * OR
      * 2 x eventually consistent reads of 4KB per second(defaults)
    * Example
      * A table wit h5 read and write capacity units is going to be able to do the following
        * 5 x 4KB strongly consistent reads = 20KB per second
        * Twice as many eventually consistent = 40KB per second
        * 5 x 1KB writes = 5KB per second

## 6.9 DynamoDB On-Demand Capacity
* Price model
* Charges apply for reading, writing, and storing data
* DynamoDB instantly scales up and down based on the activity of your application
* Which pricing models should i use?
  * On-Demand Capacity
    * Unknown workloads
    * Unpredictable application traffic
    * Spiky, short-lived peaks
    * A pay-per-use model is desired
    * It might be more difficult to predict the cost
  * Provisioned Capacity
    * Read and write capacity requirements can be forecasted
    * Predictable application traffic
    * Application traffic is consistent or increases gradually
    * You have more control over the cost

## 6.10 DynamoDB Accelerator (DAX)
* DynamoDB Accelerator (or DAX) is a fully managed, clustered in-memory cache for DynamoDB
* Deliver up to a 10x read performance improvement, Microsecond performance for millions of requests per second
* Ideal for
  * Read-Heavy Workloads: like auction applications, gaming, and retail sites during Black Friday promotions
* How does DAX work 
  * DAX is a write-through caching service. Data is written to the cache and the backend store at the same time
  * This allows you to point your DynamoDB API calls at the DAX cluster
  * if the item you are querying is in the cache (cache hit) DAX returns the result
  * if the item is not available (cache miss), then DAX performs an eventually consistent GetItem operation against DynamoDB and returns the result on the API call
* Benefits
  * May be able to reduce provisioned read capacity on your table and save money on your AWS bill
* When is DAX not suitable
  * Caters for eventually consistent read only
  * Not suitable for applications that require strongly consistent reads
  * Not suitable for write intense applications
  * Not suitable for applications that do not perform many read operations
  * Not suitable for applications that do not require microsecond response times
  
## 6.11 Dynamodb Time To Live TTL - Demo
* What is it
  * Defined an expiring time for your data Expired items marked for deletion
  * Great or removing irrelevant or old data (e.g. session, data, event logs, and temporary data)
  * Reduces the cost of you table by automatically removing data which is no longer relevant

## 6.12 DynamoDB Streams
* What is Dynamodb streams
  * Time ordered sequence:
    * time ordered sequence of item level modification (e.g., insert, update, delete)
  * Logs:
    * Encrypted at rest and stored for 24 hours
    * almost log on near real time
  * Dedicated endpoint:
    * Accesses using a dedicated endpoint
  * Primary key:
    * By, default the primary key is recorded
  * Images:
    * Before and after images can be captures
  * Use cases:
    * Audit or archive transactions, trigger an event based on a particular transaction, or replicate data across multiple tables
* Applications can take actions based on contents of the stream
  * A dynamodb stream can be an event source for lambda
  * Lambda polls the DynamoDB stream and executes based on an event

* Exams tips
  * Sequence of modifications
    * DynamoDB Streams is a time-ordered sequence of item level modifications in your DynamoDB tables
  * Encrypted and stored
    * Data is stored for 24 hours only
  * Lambda Event Source
    * Can be used as an event source for lambda, so you can create applications that take actions based on events in your DynamoDB table.
  
## 6.13 Provisioned Throughput and Exponential Back-off
* ProvisionedThroughputExceededException
  * Your request rate is too high for read / write capacity provisioned on your DynamodB table
* Using the AWs SDK?
  * The SDK will automatically retry the requests until successful
* Not Using the AWS SDK
  * Reduce your request frequency
  * Use exponential backoff
* What is exponential backoff
  * Overloaded components:
    * The requester uses progressively longer waits between consecutive retries, for improved flow control
    * In addition to simple retries, all AWS SDKs use exponential backoff
    * If after 1 minute this does not work, your request size may be exceeding the throughput for you read/write capacity


