## 4. S3

### 4.1 S3 101
* Stands for simple storage service
* provides secure, durable, highly scalable object storage
* is easy to use, with a simple web service interface
* Allows you to store and retrieve any amount of data from anywhere on the web at a very low cost

**S3 is object base storage**
* Manages data as object rathen than in file systems or data blocks
* upload any file type you can think of s3
* it cannot be used to run an operating systems or database

**specs**
* unlimited storage: the total volume of data and the number of object you can store is unlimited
* Object up to 5TB in size: S3 object can range in size from a minimum of 0 bytes to a maximum of 5 Terabytes
* S3 buckets: storage files buckets (similar to folders)

**Working with s3 bucket**
* Universal namespace: All AWS accounts shares the s3 namespace each s3 bucket name is globally unique
* Example S3 URLS: https://bucket-name.s3.region.amazonaws.com/key-name
* Uploading files: when you upload a file to an S3 bucket, you will receive an HTTP 200 code if the upload was successful
* Key value store:
  * Key: name of the object
  * Value: this is the data itself, which is made up of a sequence of bytes
  * Version ID: important for storing multiple versions of the same object
  * Metadata: data about the data you are storing, you can add your own metadata

**Highly available and highly durable**
* S3 is a safe place to store your files: the data is spread across multiple devices and facilities to ensure availability and durability
* built for 99.95 and 99.99 service availability depending of the s3 tier
* Designed for 99.99999999999 (11 9's) durability for data store in s3

**Characteristics**
* Tiered storage: s3 offers a range of storage classes designed for different use cases
* Lifecycle management: Define rules to automatically transition objects to a cheaper storage tier or delete objects that are no longer required after a set period of time
* Versioning: with versioning, all version of an object are stored and can be retrieved, including deleted objects.

**Secure your data**
* Server side encryption: you can set default encryption on a bucket to encrypt all new object when they are stored in the bucket
* Access Control Lists (ACLs): Define which AWS accounts or groups are granted access and the type of access. You can attach S3 ACLs to individual object within a bucket
* bucket policies: S3 bucket policies specify what actions are allowed or denied (e.g., allow user Alice to PUT but not DELETE objects in the bucket)

### 4.2 Reviewing S3 Storage Classes

* **S3 Standard**
  * High Availability an Durability: Data is stored redundantly across multiple devices in multiples facilities (>= 3 AZs)
    * 99.99% Availability
    * 99.999999999 (11 9's)
  * Designed for frequent Access: Perfecto fro frequently accessed data
  * Suitable for most workloads
    * the default storage class
    * use cases includes website,content distribution, mobile and gaming applications, and big data analytics
* **S3 Standard-Infrequent Access (S3-IA)**
  * Designed for infrequently accessed data (few times a month)
  * Rapid Access: Used for data that is accessed less frequently but required rapid access when needed
  * You Pay to Access the data: There is a low per-GB storage price and a per-GB retrieval fee
  * Use cases: great for long-term storage, backups, and disaster recovery files
    * Minimum storage duration 30 days
  * 99.99% Availability
  * 99.999999999 (11 9's)
* **S3 One Zone-Infrequent Access**
  * Like the S3-IA, but data is stored redundantly within a single AZ
  * Costs 20% less than the S3-IA
  * great for long-lived, infrequently accesses, non-critical data
  * Minimum storage duration 30days
  * 99.5% Availability
  * 99.999999999 (11 9's)
*** Glacier and Glacier deep archive**
  * Very cheap
  * Optimized for data that is very infrequently accessed
  * You pay each tim you access your data
  * Uso only for archiving data
  * **Glacier**
    * Provides long-term data archiving with retrieval times that range from 1 minute to 12 hours
    * Historical data only accessed a few times per year
    * 90 days of storage minimum
  * **Glacier Deep Archive**
    * archives rarely accessed data with a default retrieval time of 12 hours
    * financial records that may be accessed once or twice a year
    * 180 days of storage minimum
  * 99.99% Availability
  * 99.999999999 (11 9's)
* S3 intelligent tiering
  * 2 tiers frequent and infrequent access
  * Automatically moves your data to the most cost-effective tier based on how frequently you access each object
  * Optimizes costs: added monthly fee of 0.0025$ per 1000, objects
  * 99.99% Availability
  * 99.999999999 (11 9's)
  

### 4.3 Securing S3 Buckets
* Private: by default all newly created buckets are private
* Bucket owner: by default, only the bucket owner can upload new files, read files, delete files, etc
* No public access: No public access by default
* Bucket policies:
  * You can set up access control to you bucket using bucket policies
  * Applied at bucket level: the permissions granted by the policy apply to all of the objects within the bucket
  * Not individual objects: You can't attach a bucket policy to an individual object
  * Group of files: A group of files which need to be accessed by the same people
  * They are written in JSON
* Bucket Access controls lists (ACLs)
  * Applied at an object level: we can apply different permissions for different objects within a bucket
  * Grant access to objects: We can define which account or groups are granted access and also the type of access, e.g. read, write, or full control
  * Fine grained control: Grant a different type of access to different object within the same bucket. e.g. to apply different permissions for different objects, for different users and groups
* Access Logs
  * Log all requests made to the s3 bucket
  * Every time a user makes a request to upload, read or delete a file logs are written into another S3 bucket
  
### 4.4 ACLs and bucket Policies Demo Part 1 && 2
Objectives: 
* Create an S3 bucket
* Upload some files
* Configure an Access control list
* Configure a bucket policy

### 4.5 Create a static website using Amazon S3 (Lab)
* Create a public S3 bucket
* Load index.html and error.html files
* Configure bucket to be an static page web server
* Add policy to allow everyone to access the bucket 

### 4.6 S3 Encryption

**Types of encryption**
* Encryption in Transit: SSL/TLS using HTTPS
* Encryption at Rest: Server side Encryption
  * SSE-S3: S3 managed keys, using AES 256-bit encryption
  * SSE-KMS: AWS key management service managed keys
  * SSE-C: Customer provided keys
* Encryption at Rest: Client Side encryption
  * You encrypt the files yourself before you upload them into S3
  
**Enforcing server side encryption**
* Console:
  * select the encryption setting on your S3 bucket
  * The easiest way, just a check box in the console
* Bucket Policy:
  * You can also enforce encryption using a bucket policy
  * This method does sometimes come up in the exam
  * this works by creating a policy which denies any S3 PUT request which does not include the "x-amz-server-side-encryption" parameter in the request header
  * You can ensure encryption at transit with a bucket policy with the conditional option "aws:SecureTransport" to enforce HTTPS/SSL

### 4.7 Configuring Encryption on an S3 Bucket (Demo)
Objectives:
* Create an S3 bucket
* Review encryption options
* enforce encryption using a bucket policy
* Test our set-up