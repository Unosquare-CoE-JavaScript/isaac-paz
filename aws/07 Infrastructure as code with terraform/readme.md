- [1 Infrastructure as code with Terraform](#1-infrastructure-as-code-with-terraform)
  - [Definition](#definition)
  - [Types of tools to implement infrastructure as code](#types-of-tools-to-implement-infrastructure-as-code)
  - [Benefits](#benefits)
- [2 Introduction to Terraform](#2-introduction-to-terraform)
  - [How it works](#how-it-works)
  - [Characteristics](#characteristics)
  - [Creation and configuration of infrastructure](#creation-and-configuration-of-infrastructure)
- [3 Tools to create immutable infrastructure](#3-tools-to-create-immutable-infrastructure)
  - [Immutable infrastructure](#immutable-infrastructure)
- [4 Firsts steps](#4-firsts-steps)
  - [Local and remote Modules](#local-and-remote-modules)
- [5 Terraform State](#5-terraform-state)

# 1 Infrastructure as code with Terraform

## Definition

- It is a way to automate infrastructure based on practices of software development
- Principles
  - Systems can be reproduce easily (it is reusable)
  - Systems are renewable (if it is failing you can reconstruct a new one)
  - System are consistence (You have only one file to define your servers)
  - Design is always changing
- Practices
  - Use definition files
  - Auto-documented infrastructure
  - Use version control software
  - Small changes
  - Keep services with high availability

## Types of tools to implement infrastructure as code

- Infrastructure defining tools
  - Define resources
  - Set resources configurations
    - Virtual machines
    - Networks
    - Disks
  - Uses Definition File
  - Examples:
    - Terraform
    - Cloud formation
    - Open stack heat
- Configure Server Tools
  - Configure infrastructure with a certain state (e.j. packages needed on server, dependencies)
  - Examples
    - Ansible
    - Chef
    - Puppet

## Benefits

- Fast creation under demand (Reusable, only write definition one time)
- Automatization (CI/CD)
- Visibility and Traceability (With Git)
- Homogeneous environments
- Easy to test

# 2 Introduction to Terraform

- Open source
- Created by Hashicorp
- Developed on GO
- It creates and administrate infrastructure

## How it works

- It is a bin executable that connects into cloud providers public and privates
- With the file definition it deploy resources to the cloud provider

## Characteristics

- It has execution plans
- Easy to automate

## Creation and configuration of infrastructure

- Ansible allows us to also create infrastructure, but its main objective is not that.
- Mutable infrastructure
  - It changes the state of your infrastructure
- Immutable infrastructure
- It Recreates the whole infrastructure with a new set of configuration
- Declarative language
  - We define what to do
- Procedural language
  - We define how to do it

# 3 Tools to create immutable infrastructure

## Immutable infrastructure

- Packer (Hashicorp)
  - It allow us to create personalized AWS amis
  - It also uses a definition file
  - Elements:
    - variables: as its name indicates, here we define the variables that we are going to use.
    - builders: we indicate where we are going to build our base image.
    - provisioners: here we customize our image, add packages, create directories, define the state of the infrastructure, etc.
    - post-processors: we can have output files and execute commands after having created the infrastructure, everything runs locally.

# 4 Firsts steps

```
provider "aws" {
  region = "us-east-1"
}
resource "aws_instance" "platzi-instance" {
  ami = "ami-00b1cfa5b4d6d00a1"
  instance_type = "t2.micro"
  tags = {
    "Name" = "practica 1"
    "Environment" = "dev"
  }
}
```

- provider: The cloud provider we are using
- Resource: Resource type we are using on the provider
  - ami: Base server image
  - instance_type: type of the server we are using (t2.micro is on free tier)
- Commands

  - terraform validate: Validate all the configurations in the current folder
  - terraform init: Initialize and install all plugin necessary on the configurations files (run before validate at leas one time)
  - terraform destroy: Destoy all resources describe in all files

- Variables

  - You can define variables in the same file on in a different fire to keep good practices like in the example variables are defined in "variable.tf" and their values are in another file with extension tfvars "dev.tfvars" an pass it like this `terraform plan -var-file dev.tfvars`, you can also pass the values of this variables via command line or with environments variables
  - If you have a file with `*.auto.tfvars` terraform is going to take it as the default file to read variables and i won't be necessary to pass the argument "-var-file"

- Output
  - You can define output variables from `terraform apply` on the file "output.tf" with the next syntax:

```
output "instance_ip" {
  value = aws_instance.platzi-instance.*.public_ip
}

```

## Local and remote Modules

- You can split definition of resources into other files and use them as modules
- When you want to "Invoke" a modules you have to follow the next syntax and pass the variables that the module is waiting as properties

```
module "app" {
  source        = "./modules/instance" #path to the module's folder or an URL where the module is saved example a repository on github
  ami_id        = var.ami_id
  instance_type = var.instance_type
  tags          = var.tags
  sg_name       = var.sg_name
  ingress_rules = var.ingress_rules
}

```

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
