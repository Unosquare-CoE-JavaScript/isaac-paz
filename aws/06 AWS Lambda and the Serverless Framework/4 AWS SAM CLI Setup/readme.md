# AWS SAM CLI Setup

- Run Lambda locally using AWS toolkit for VS Code
  - You'll need to have VS code installed
- With AWS Toolkit we can:
  - Test code locally with step-through debugging in a Lambda environment
  - Deploy your applications to the AWS Region of your choice
  - Invoke your Lambda functions locally or remotely
  - Specify function configurations such as an event payload and environment variables

## AWS Toolkit installation

- Install VS Code
- Install the AWs Toolkit for VS Code
  - install on VS code plugin "aws toolkit"
  - Use AWS credentials to connect the toolkit to AWS
- Install AWS CLI
  - Run `aws configure` to set your credentials
- Install and run Docker
- Install the AWS Serverless Application Model CLI (SAM) - allows to define, test, and deploy a serverless application" `brew tap aws/tap && brew install aws-sam-cli`
  - Run to check version `sam --version`
