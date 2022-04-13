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
  - If you have a file with `*.auto.tfvars` terraform is going to take it as the default file to read variables and i won't be necesary to pass the argument "-var-file"

- Output
  - You can define output variables from `terraform apply` on the file "output.tf" with the next syntax:

```
output "instance_ip" {
  value = aws_instance.platzi-instance.*.public_ip
}

```

## Local Modules

- You can split definition of resources into other files and use them as modules
- When you want to "Invoke" a modules you have to follow the next sintax and pass the variables that the module is waiting as properties

```
module "app" {
  source        = "./modules/instance" #path to the module's folder
  ami_id        = var.ami_id
  instance_type = var.instance_type
  tags          = var.tags
  sg_name       = var.sg_name
  ingress_rules = var.ingress_rules
}

```
