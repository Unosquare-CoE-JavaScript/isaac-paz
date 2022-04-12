# 5 AWS SAM CLI Running AWS Lambda Function Locally

- What is AWS SAM

  - AWS SAM (Serverless Application Model)
  - Used to define your serverless application (remember serverless Framework and the serverless.yml file)
  - AWS SAM consist of the following components:
    - **AWS SAM Template Specification**: you write properties to a file to describe functions, APIs permissions etc.
    - **AWS SAM CLI**: to invoke functions, packages and deploy serverless applications to a AWS cloud and so on
    - **Single deployment configurations**: deploy the whole stack as a single entity
    - **Extension of AWS CloudFormation**: reliable cloudFormation stack deployment
    - Built-in best practices - use AWS SAM to define and deploy your infrastructure as config:
      - **Enforces best practices as code reviews**
    - **Local debugging and Testing**: locally build, test and debug serverless app!
    - **Deep integration with development tools**: integrates well with many other AWS tools and services!

- Commands:
  - `sam build` build the project
  - `sam local invoke` invoke the functions on local environment (requires docker)
  - `sam deploy --guided ` deploy de project on the cloud with assistance
  - `sam local start-api ` deploy the project locally
  - `sam local invoke "HelloWorldFunction"` invoke a function locally
  - `aws cloudformation delete-stack --stack-name sam-app --region us-east-1` Delete the stack (Does not have an output)
