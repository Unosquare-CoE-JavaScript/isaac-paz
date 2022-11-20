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