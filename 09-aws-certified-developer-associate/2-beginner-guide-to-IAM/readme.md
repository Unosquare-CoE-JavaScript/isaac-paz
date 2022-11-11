## 2. Beginner guide to IAM

### 2.1 IAM 101
Benefits: 
* Allows you to manage user and access to resources on AWS
* Gives you centralized control to you AWS accounts
* Share access to your AWs account
* Granular permissions
* Supports well-know identity such as: Active directory Facebook and Linkedin
* Multi-factor authentication
* Temporary Access for users/devices and services as necessary
* Password Policies Allows to set up your own password rotation policy
* Integrates with many different AWS services
* Supports PCI DSS compliance

Core concepts
* Users: End user = think people
* Groups: A collection of users under one set of permissions
* Roles: you create roles and then assign them to users, applications, and services to give access to AWS resources
* Policy: A document that defines one or more permissions and this can be attach to a user, group or role it can be share between multiple users, groups or roles

### 2.2 IAM Demo
* Configure Multifactor authentication
* Create users
* Create groups
* Assign policy to groups
* Configure password policy
  
### 2.3 Lab (Introduction to AWS Identity and Access Management)
* Assign users to an group
* Sign in with those users from and root account base url
  
### 2.4 Testing IAM Policy Permissions
We use IAM Policy Simulator to test our policies and the policies attach to existing user group or role

URL: https://policysim.aws.amazon.com/

### 2.5 IAM 101 Summary
**Users:** End users and people
**Groups:** a way to group users and apply policies to them collectively
**Roles:** Create roles and then assign them to users, applications, and services to give access to AWS resources

* IAM is universal not regional
* the root account is created when you first set yp your AWS account, the account has complete admins access, this should not be use to make day to day actions
* New users have no permissions when first created
* **IAM Access Keys**
  * Access Keys: New users are assigned an access key ID and secret access key when their accounts are created
  * Not for console Access: These are not the same as a password and you cannot use the access key ID or secret access key to log in in to the AWs Management console
  * Programmatic Access: You can use access keys to access AWS via the APIs and command line
  * you only get to view the access key ID and secret access key once, if you lose them, you have to regenerate them. Make sure to save them in a secure location
* Always use Multi factor authentication (MFA) on your root account
* Password rotation: You can create and customize your own password rotation policies