## 3. Beginner Guide to EC2

### 3.1 Introducing EC2
Stands for "Elastic Compute Cloud (EC2)"
* Secure, Resizable compute capacity in the cloud
* Live a VM, only hosted in AWS instead on your own data center
* Designed to make web-scale cloud computing easier for developers
* The capacity you want when you need it
* You are in completed control of your own instances

**Why is so cool**
* Game changer: AWS led a big change in the industry by introducing EC2
* Pay only for what you use: EC@ change the economics of computing
* No wasted capacity: Select the capacity that you need right now. Grow and shrink when you need

**Before EC2**
* On premises infrastructure
  * Long term investment, 3-5 years
  * take a long time to get a new server runnings

### 3.2 EC2 Pricing Options
* types of pricing models
  * **On Demand:** Pay by the hour or the second depending on the type of instance you run
    * Flexible: Low cost and flexibility of amazon ec2 without any up-front payment or long commitment
    * Short-term: Applications with short-term, spiky or unpredictable workloads that cannot be interrupted
    * testing the water: Applications being developed or tested on Amazon EC2 for the first time
  * **Reserved:** Reserved capacity for one or three years, Up to 72% discount on the hourly charge regional
    * Predictable Usage: Applications with steady state or predictable usage
    * Specific capacity requirements: Applications that require reserved capacity
    * Pay up-front: You can make up-front payments to reduce their total computing cost even further
    * Standard RIs: up to 72% off on-demand price 
    * Convertible RIs: Up to 54% off on-demand price. Has the option to change to a different reserved instance type of equal or grater value
      * Schedule RIs: launch a within the time windows you define. match your capacity reservation to a predictable recurring schedule that only requires a fraction of a day, week or month
  * **Spot:** Purchase unused capacity at a discount of up to 90%. Prices fluctuate with supply and demand
    * applications that have flexible start and end times
    * Applications that are only feasible at very low compute prices
    * Users with an urgent need for large amounts for additional computing capacity
  * **Dedicated:** A physical EC2 server dedicate for your use. The most expensive option
    * Compliance: Regulatory requirements that may not support multi-tenant virtualization
    * Licensing: Great for licensing which does not support multi-tenancy or cloud deployments
    * on-demand: can be purchased on demand(hourly)
    * Reserved: can be purchased as a reservation for up to 70% off the on-demand price

**Saving plans**
* Save up to 72%: All AWS compute usage regardless of instance type or region
* Commit to one to three years: commit ot use an specific amount of compute power(measured in $/hour) for one or three year period
* Super flexible: Not only EC2, also includes serverless technologies like Lambda and Fargate

**AWS Pricing Calculator**
Allows you to create an estimate of your expenses base on resources you select

### 3.3 Exploring EC2 Instance Types
It determines the hardware of the host computer

* Hardware: When you launch an instance, the instance type determines the hardware of the host computer used for your instance
* Capabilities: Each instance type offers different compute, memory, and storage capabilities, these types are grouped in instance families
* Application Requirements: Select an instance type based on the requirements of the application that you plan to run on your instance

**Families:**
* General purpose
* Compute optimized
* memory optimized
* Accelerated computing
* Storage optimized
* Instance features
* Measuring instance performance

### 3.4 Launching an EC2 instance(demo)
* Lunch an instance
* configure security group to open port http 80
* configure a web server with httpd
* create an index.html
* visit page
### 3.5 How to use Putty Demo(Windows users only)
### 3.6 Using EC2 instance connect-Demo
* Lunch an EC2 instance
* security group support ssh
* connect to the instance via the EC2 instance connect inside AWS console
### 3.7 Understanding EBS Volume

* EBS stands for Elastic Block store
* Storage volumes that you can attach to your EC2 instances
* by default there is one EBS for each EC2 this is the one that the OS is installed
* you can attach more EBS in to a EC2

**Features**
* Design for production mission critical workload
* Highly available: Automatically replicated within a single AZ to protect against hardware failures
* Scalable: Dynamically increase capacity and change the type volume with no downtimes or performance impact to your live systems

**Options**
* General purposes SSD (gp2):
  * Balance between price and performance
  * 3 IOPS per GiB, up to a max of 16.000 IOPS per volume
  * gp2 volumes are smaller than 1TB can burst up to 3.000 IOPS.
  * Good for boot volumes or development and test application which are not latency sensitive
* General purpose SSD(gp3)
  * The latest generation
  * Baseline of 3.000 IOPS for any volume size (1GB - 16TB)
  * Deliver up to 16.000 IOPS
  * 20% cheaper than gp2
  * like gp2 good for boot volumes or development and test application which are not latency sensitive
* Provisioned IOPS SSD (io1): 
  * The high performance option, and the most expensive
  * Up to 64.000 IOPS per volume, 50 IOPS per GiB
  * use if you need more than 16.000 IOPS
  * Designed for I/O intensive applications, large databases, and latency-sensitive workloads
* Provisioned IOPS SSD (io2)
  * The latest generation
  * Higher durability and more IOPS
  * io2 is the same price as io1
  * 500 IOPS per GiB up to 64.000 IOPS
  * 99.999% durability instead of up to 99.9%
  * I/O intensive apps, large databases, and latency-sensitive workloads. application which need high levels of durability
* Provisioned IOPS SSD io2 Block Express
  * SAN (Storage Area Network) in the cloud.
  * Highest performance, sub-millisecond latency
  * uses EBS block express architecture
  * 4x throughput, IOPS, and capacity of regular io2 volumes
  * up to 64TB, 254.000 IOPS per volume
  * 99.999% durability
  * great for the largest, most critical, high-performance applications like SAP HANA, Oracle, Microsoft SQL Server, and IBM DB2
* Throughput Optimized HDD (st1)
  * Low-cost HDD volume
  * Baseline throughput of 40MB/s per TB
  * ability to burst up to 250MB/s per TB
  * Maximum throughput of 500 MB/s per volume
  * Frequently-accessed, throughput-intense workloads.
  * Big-Data, data warehouses, ETL, and log processing
  * A cost effective way to store mountains of data
  * Cannot be a boot volume
* Cold HDD (SC1)
  * Lowest cost option
  * baseline of throughput of 12 MB/s per TB
  * ability to burst up to 80MB/s per TB
  * Max throughput of 250MB/s per volume
  * A good choice for colder data requiring fewer scans per day
  * Good for applications that need the lowest cost and performance is not a factor
  * Cannot be a boot volume

**IOPS VS Throughput**
* IOPS
  * Measure the number of read and write operations per second
  * important metric for quick transactions, low latency apps, transactional workloads
  * The ability to actions reads and writes very quickly
  * Choose provisioned IOPS SSD (io1 or io2)
* Throughput
  * Measure the number of bit read or written per second (MB?s)
  * important metric for large datasets, large I/O sizes, complex queries
  * The ability to deal with large datasets
  * Choose throughput optimized HDD (st1)
  
### 3.8 Creating an EBS volume (Demo)
* Create an EC2
* Create an gp3 EBS
* Attach EBS volume to Existing EC2

**Encryption**
* Default encryption
  * if encryption by default is set in your account by your account admin, you cannot create and unencrypted EBS volume
* Encrypted Snapshots
  * if you can create an EBS volume from an encrypted snapshot, then you will get an encrypted volume
* Unencrypted Snapshots
  * if you create an EBS from an unencrypted snapshot, then encryption is only optional if default encryption has not been set at account level by you account admin

### 3.9 Exploring Elastics Load Balancer

What is a Load balancer:
* Distribute network traffic across a group of services

Options
* Applications load balancer: balances HTTP and HTTPS
  * Used for load balancing http/https traffic, they operate at layer 7 and are application aware
  * they support advance request routing to specific web server based on the HTTP header
* Network Load Balancer: TCP and high performance
  * Used for load balancing TCP traffic where extreme performance is required
  * operating at the level 4 of the OSI model (transport (TCP,UDP))
  * As it is the high performance, it is the most expensive option
* Classic load balancer (legacy): HTTP/HTTPS and TCP
  * Legacy
  * support http/https and support some layer 7 specific features
  * support layer 4 on TCP routing
* Gateway Load Balancer: allows you to load balance workloads for third-party 
  * virtual appliances running in AWS marketplace
  * virtual firewalls from companies like fortinet, palo alto, juniper, cisco
  * IDS/IPS systems from companies like checkpoint, trend micro, etc

"X-Forwarded-For" Header: identify the originating IP address of a client connection through a load balancer

Common Load Balancer Error:
* Error 504 Gateway timeout: the target failed to respond
  * check your application
  * The ELB could not establish a connection to the target
  * your application is having issues
  * identify where the application is failing and fix the problem

### 3.10 Route53 Demo

**What is route 53**
* Allows you to map a domain name that you own to:
* EC2 instances
* Load Balancers
* S3 Buckets

Demo objectives:
* Launch an EC2 instance
* create an application load balancer
* configure a route53 alias

### 3.11 CLI Demo Lab
Lesson objectives
* Launch EC2 instance
* Create an IAM User
* Configure the AWS CLI
* Create an S3 bucket
* Update a file into s3 bucket

CLI documentations URL: https://awscli.amazonaws.com/v2/documentation/api/latest/reference/index.html

**tips**
* Always give your user the minimum amount of access required to do their job
* Create IAM groups and assign your user to groups
* Groups permissions are assigned using IAM policy documents
* Secret access key: you get to see it only once, you can deactivate and generate new ones if you lose the previous
* Do not share your key pairs
* AWS CLI support linux, windows, MacOS

### 3.12 CLI Pagination 

* You can control the number of items included in the output when you run a cli command
* By default the AWS CLI uses a page size of 1000

**Errors**
* if you see errors when you running list commands on a large number of resources, the default page size of 1000 might be too high
* you are most likely to see a "time out" error, because the API call has exceeded the maximum allowed time to fetch the required results

**Fixing errors**
* to fix, use the --page-size option to have the CLI request a smaller number of items from each API call
* The CLI still retrieves the full list, but perform a larger number of APi calls in the background and retrieves a smaller number of item with each call

Examples
`aws s3api list-objects --bucket my-bucket --page-size 100`
`aws s3api list-objects --bucket my-bucket --max-items 100`

### 3.13 Working with the AWS CloudShell Demo 

objectives
* Launch AWS CloudShell
* Explore the CloudShell
* Use the AWS CLI

### 3.14 EC2 with s3 Role Demo

objectives
* Create an IAM Role with s3 access
* Create an EC2 instance: attach the role we just created
* Access s3: try to access s3 from our EC2 instance

**tips**
* roles are preferred from a security perspective
* Avoid hard coding your credentials: roles allows you to provide access without the use of access keys IDs and secret access keys
* Policies control a role's permissions
* you can update a policy attached to a role, and it will take immediate effect
* you can attach an detach roles to running EC2 instances without having to stop or terminate these instances and it will take immediate effect

### 3.15 RDS 101

Relational databases servers
* Tables:Data is organized into tables
* Rows: the data items
* Columns: the field in the database

when should be use an RDS database:
* Is generally for Online transaction processing (OLTP)
* RDS types:
  * SQL servers
  * Oracle
  * MySQL
  * PostgreSQL
  * MariaDB
  * Amazon Aurora
* Up and running in minutes
* Multi-AZ
* Failover capability
* Automated backups
  
Differences between 
* Online transaction processing (OLTP)
  * processes data from transaction in real time like customer orders, banking transactions payments and booking systems
  * OLTP is all about data processing and completing large number of small transactions in real-time
* Online Analytics processing (OLAP)
  * Processes complex queries to analyze historical data like analyzing net profit figures from the past 3 years, and sales forecasting.
  * OLAP is all about data analysis using large amounts of data, and complex queries that take a long time to complete

### 3.16 RDS Demo
objectives
* Launch and RDS instance
* Launch and EC2 instance
* Connect to the RDS instance

### 3.17 RDS Multi-AZ and Read Replicas

**Multi-AZ**
* Is an exact copy of you database in another Availability Zone
* If something is wrong with the primary Database this second database takes a primary role 
* AWS handles the replication for you
* When you write to your production database this write will automatically synchronize to the standby database
* All of the RDS can be configure as Multi-AZ
* RDS will automatically failover to the standby during a failure so that database operations can resume quickly without administrative intervention
* Multi-AZ is for Disaster recovery
* this is not for scaling purposes
* Only one database is available on a current time

**Read Replicas**
* A read only copy of your primary database
* Can be located at the same AZ of your primary zone, another AZ or event another region
* Each replica has its own DNS endpoint
* Read replicas can be promoted to be their own independent databases, this broke the replications
* Scaling read performance
  * Primarily used for scaling, not for DR!
* Requires automatic backup
  * Automatic backups must be enables in order to deploy a read replica
* Multiple Read replicas are supported
  * MYSQL, MariaDB, PostgreSQL, Oracle, and SQL server allow you to add up to 5 read replicas to each DB instance

### 3.18 RDS Backups and Snapshots

Two ways to backup RDS

* Snapshot: Manual, ad-hoc, and user-initiated it provides a snapshot of the storage volume attached to the DB instance
* Automated Backup: Enable by default it created daily backups or snapshots that run during a backup windows that you define, it generates transactions logs are used to replay transactions

**Automated backup:**
* Point in time recovery: recover your database to any point int time within a "retention period" of 1-35 days
* Full daily backup:RDS takes a full daily backup, or snapshot, and also store transactions logs throughout the day
* The recovery process: When you do a recovery, AWS will first choose the most recent daily backup and then apply transactions logs relevant to that day, up to the recovery point
* this are stored in s3: automated backups and snapshots are stores in s3
* Free storage: you get free storage space equal to the size of your database. so if you have an RDS instance of 10GB, you will get 10GB worth of storage
* Defined backup windows: During the backup windows, storage I/O may be suspended for a few seconds while the backup process initializes, and you may experience increased latency at this time


**Snapshots:**
* Not automated: Db snapshots are done manually(they are user-initiated)
* No retention period: Manual snapshots are not deleted even after you delete the original RDS instance, including any automated backup
* Backup to a know state: Back up your DB instance in a know state as frequently as you wish, and then restore to that specific state at any time

**Restoring your RDS database**
the restored version of the database will always be a new RDS instance with a new DNS endpoint

**Encryption at rest**
* You can enable it at creation time
* It is integrated with KMS keys
* Includes all the underlying storage, automated backups, snapshots, logs, and read replicas
* You can not enable encryption on an unencrypted RDS DB instance


### 3.19 Elasticache 101

* In-memory cache(Key value): ElastiCache makes it easy to deploy, operate, and scale an in-memory cache in the cloud
* Improves Database performance: it allows you to retrieve information form fast, in memory caches instead of slower disk-based storage
* Great for Read-heavy Database Workloads: caching the results of I/O intensive database queries. Also for storing session data for distributed applications

**Types**
   * Memcached: 
     * Great for basic object caching, scales horizontally, but there is no persistence, Multi-AZ or failover
     * A good choice if you just want basic caching and you want your caching model to be as simple as possible
   * Redis
     * A more sophisticated solution with enterprise features like persistence, replication, Multi-AZ and failover
     * Supports sorting and ranking data and complex data types like lists and hashes

### 3.20 Systems manager parameter store - Demo

Objectives
* Create a string param on Params store
