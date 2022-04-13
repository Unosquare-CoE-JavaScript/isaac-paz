# 5 Terraform State

- Terraform save its state of the infrastructure created and its configurations,
- This is made to have control of what it had created and only change the state taking as input the current state of the resources
- Usually called on local environment "terraform.tfstate"

- Backend State
  - Terraform allows you to save the state on a remote server on cloud like S3 on AWS between others

Syntax

- Resource created

```
provider "aws" {
  region = "us-east-2"
}

resource "aws_s3_bucket" "platzi-backend" {
  bucket = var.bucket_name
  acl    = var.acl
  tags   = var.tags
}

```

- Bucket config

```
terraform {
  backend "s3" {
    bucket = "ispm-backend-terraform-platzi" "Name of the bucket that is going to save the data"
    key    = "dev"
    region = "us-east-2"
  }
}

```
