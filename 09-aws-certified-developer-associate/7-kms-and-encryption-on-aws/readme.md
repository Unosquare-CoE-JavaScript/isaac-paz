# 7 KMS and Encryption on AWS
## 7.1 KMS 101
*  What is it:
   *  AWS Key managed service
   *  Managed
      *  managed service that makes it easy for you to create and control the encryption keys used to encrypt your data
   *  Integrated
      *  Seamlessly integrated with many AWS services to make encrypting data in those services as easy as checking a box
   *  Simple
      *  With KMS, it is simple to encrypt your data with encryption keys that you manage
*  When so we use KMS
   *  Whenever you are dealing with sensitive information
   *  Sensitive data that you want to keep secret 
      *  costumer, financial, database passwords, secrets, credentials data
*  Integrated with services
   *  S3
   *  RDS
   *  DynamoDB
   *  Lambda
   *  EBS
   *  EFS
   *  CloudTrail
   *  Developer Tools
   *  many more
*  What is a CMK
   *  Customer master key
      *  encrypt and decrypt data up to 4KB
   *  User for
      *  Used for generate / encrypt/ decrypt the data key
   *  Data key
      *  Used to encrypt / decrypt your data

## 7.2 Creating A CMK - DEMO
* Objectives
  * Create a group with administrator access 
  * Create key administrator and key user
  * Create a CMK with a material origin of KMS

## 7.3 CMK Summary
* Properties
  * Alias: your applications can refers o the alias using the CMK
  * Creation date: The date and time when the CMK was created
  * Description: You can add your own description to describe the CMK
  * Key state: Enabled, disabled, pending, deletion, unavailable
  * Key material: Customer-provided or AWS-provided
  * Stays inside KMS: can never be exported
* Exam tips
  * Set up KMS
    * Create alias and description
    * choose key and material option
  * Key administrative permissions
    * IAM users and roles that can administer (but not use) the key through the KMS API
  * Key usage permissions
    * IAM users and roles that can use the key to encrypt and decrypt data
  * AWS-Managed CMK
    * AWS-provided and aws managed CMK, Used on your behalf with the aws services integrated with KMS
  * Customer managed CMK
    * You create, own and manage yourself
  * Data key
    * Encryption keys that you can use to encrypt data, including large amounts of data. You can use a CMK to generate, encrypt, and decrypt data keys

## 7.4 Understanding KMS API calls - Demo
* Create a EC2 machine
* add the keys of the kms user key created before
* review KMS api
* encrypt a text file

* Exam tips
  * aws kms encrypt
    * encrypts plaintext into cipher text by using a customer master key
  * aws kms decrypt
    * Decrypts cipher text that was encrypted by an AWS KMS customer master key (CMK)
  * aws kms re-encrypt
    * Decrypts cipher text and then re-encrypts it entirely within AWS KMS (e.g. when you change the CMK or manually rotate the CMK)
  * aws kms enable-key-rotation
    * Enables automatic key rotation every 365 days
  * aws kms generate-data-key
    * Uses the CMK to generate a data key to encrypt data > 4KB

## 7.5 Exploring Envelope Encryption
* What is it:
   *  it is a process for encrypting your data, it applies to files > 4KB
   *  It generated a data key, encrypts the data and saves the data key inside the payload encrypted that combination of the data and the data key is called envelope
* Why envelope encryption, why not encrypt the data using the CMK directly
  * Network performance: When encrypt data directly with KMS it must be transferred over the network
  * Performance: With envelope encryption, only the data key goes over the network, not your data
  * Benefits: The data key is used locally in your application or AWS service, avoiding the need to transfer large amount of data to KMS