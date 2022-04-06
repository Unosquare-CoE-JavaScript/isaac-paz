# AWS Lambda console - Create your first Lambda Function

- Deploying Hello World Function Using AWS Lambda
  - Sign up for an AWS Account
  - Create our first Lambda function
  - Test and Run it

## The Serverless Framework

- Aims to ease the pain of creating, deploying, managing, and debugging lambda functions
- It integrates well with CI/CD tools
- it has CloudFormation support so your entire stack con be deployed using this framework

### Installing

- Install dependencies (node & AWS CLI)
- Install the serverless framework
- Setting up AWS for the `serverless-admin` user
- Download credential on your machine
- setup serverless to use credentials

### Commands

- sls create (to create a new project from a template)
- sls deploy (to deploy or update all the project)
- sls deploy function -f ${name_of_the_function} (to update a specific function)
- sls invoke -f ${name_of_the_function} (to invoke or call a specific function)
- sls invoke -f ${name_of_the_function} --log (to invoke printing all log produces in the calling)
- sls logs -f ${name_of_the_function} (retrieve all saved logs of the function)
- sls remove (Remove all objects and dependencies from the project)
