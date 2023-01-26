# 9 Developer theory
## 9.1 What is CI/CD
* what is it?
  * software development best practice
    * Continuos integration, continuous delivery / deployment
  * make small changes & automate everything
    * Small, incremental code changes, automate as much as possible e.g. code integration, build, test and deployment
  * Why is it so cool?
    * Modern companies like AWS, Netflix, google and Facebook have pioneered this approach to releasing code, successfully applying thousands of changes per day
* Benefits of the CI/CD approach
  * Automation is good
    * Fast, repeatable, scalable, enables rapid deployment
  * Manual is Bad
    * slow, error prone, inconsistent, un-scalable, complex
  * Small changes
    * Test each code change and catch bugs while they are small and simple to fix
* Continuos integration workflow
  * Shared code repository
    * Multiple developers contributing to a shared code repository like Git, Frequently merging or integrating code updates
  * Automated Build
    * When changes appear in the code repository this triggers an automated build of the new code
  * Automated test
    * Run automated tests to check the code locally before it is committed into the master code repository
  * Code is merged
    * After successful tests, the code gets merget to the master repository
  * Prepared for deployment
    * code is built, tested and packages for deployment
  * Manual Decision
    * Humans may be involved in the decision to deploy the code, This is known as continuos Delivery 
  * Or Fully automated
    * The system automatically deploys the new code as soon as it has been prepared for deployment, this is known as continuous deployment
* AWS developer tools
  * CodeCommit
    * source and version control
    * Source control service enabling teams to collaborate on code, html pages, scripts, images and binaries
  * CodeBuild
    * Compiles source code, runs tests and produces packages that are ready to deploy
  * CodeDeploy
    * automates code deployments to any instance, including EC2 Lambda and on-premises
  * CodePipeline
    * End-to-end solution, build, test and deploy your application every time there is a code change
* Tips
  * Continuos integration
    * Integrating or merging the code changes frequently - at least once per day think CodeCommit
  * Continuos Delivery
    * Automating the build, test and deployments functions think CodeBuild and CodeDeploy
  * Continuous Deployment
    * Fully automated release process, code is deployed into Staging or Production as soon as it has successfully passed through the release pipeline think CodePipeline
* AWS Whitepaper
  * Practicing continuous integration & continuos deployment on AWS
    * Explains the features and benefits of using continuos integration, continuous delivery (CI/CD) and AWS tooling in your software development environment
    * link https://docs.aws.amazon.com/whitepapers/latest/practicing-continuous-integration-continuous-delivery/practicing-continuous-integration-continuous-delivery.pdf

## 9.2 CodeCommit 101
* CodeCommit is a central code repository
  * Manages updates from multiple sources
  * Enables collaboration
  * Tracks and manages code changes
  * Maintains version history
  * Based on Git
  * Version control system

## 9.3 CodeCommit Demo
* Objectives
  * Create a CodeCommit repository
    * Add a file to the repository
  * Create new branch
    * A branch is like a working are in the repository
  * Update the file
    * Merge the changes

## 9.4 Configure and Work with CodeCommit from the CLI Lab
* Bootstrap an EC2 instance
* Configure user policies to access code commit
* Generate user credentials to apply on ec2 instance
* Generate codecommit credentials
* Create a codecommit repo from ec2 instance
* Clone the repository
* Add a file
* Push the file to the main branch
* Check file was created on CodeCommit console

## 9.5 CodeDeploy 101 (in progress)
* What is CodeDeploy
  * Automated deployment
    * EC2 instances, on-premises & Lambda
    * Quickly release new features
    * Avoid downtime during deployments
    * Avoid the risks associated with manual processes
* CodeDeploy Deployment approaches
  * In place
    * The application is stopped on each instance nad the new releases is installed, Also known as a Rolling update

