# 2 Terraform Basics and Docker

### Useful commands

- terraform show -json | jq (show terraform current state and piped into jq that is a json formatting tool)
- terraform state list (List all resources describe in the state)
- terraform output (Show defined fields output, need and apply first to be populated)

### Functions

- join(';', ["thing", 1, 2]) = (Takes a value that is going to use to join values from an array),Example:
- join("-", ["this", "sentence", "has", 2+2, "dashes"]) = "this-sentence-has-4-dashes"

### Random Provider

- You can have a resource that generate a random type of value to use in the definition of the infrastructure:

```
resource "random_string" "random" {
  length  = 4
  special = false
  upper   = false
}
```

- in this case it was use to append this generated string into a name of a container like this:

```
resource "docker_container" "nodered_container" {
  name  = join("-", ["nodered", random_string.random.result])
  image = docker_image.nodered_image.latest

  ports {
    internal = 1880
    # external = 1880
  }
}
```

### Count Argument

- You can create multiple resources with the count property you can use this on resources, modeules but not in outputs
- Example of creating 2 random string adn 2 containers using this random string
- count.index allows you to access to the current iteration to access the property

```
resource "random_string" "random" {
  count   = 2
  length  = 4
  special = false
  upper   = false
}

resource "docker_container" "nodered_container" {
  count = 2
  name  = join("-", ["nodered", random_string.random[count.index].result])
  image = docker_image.nodered_image.latest

  ports {
    internal = 1880
    # external = 1880
  }
}
```

### Splat Expression

- Used like a for loop
- Returns all values in an array
- Allows you to reference all your resources created by count
  Example:

```
random_string.random[*].result
<!-- Returns -->
[
  "zvs8",
  "x3z2",
]
```

### For Loops

- Allows you to iterate in an array of values and implement some logic with the use of every item being iterated, Example

```
[for i in [1, 2, 3]: i * 2]
<!-- Returns -->
[
  2,
  4,
  6,
]
```

Example of getting ips and ports from an array of containers

```

output "ip_address" {
  value       = [for i in docker_container.nodered_container[*] : join(":", [i.ip_address], i.ports[*].external)]
  description = "The IP address and external port of the container"
}
<!-- Returns  -->
[
  "172.17.0.3:55009",
  "172.17.0.2:55008",
]
```

### Tainting

- You mark a resource because it can be function wrong, and in the next apply terraform in the next apply is going to replace that resource and replace all other resources that depends on the tainted resource
- It is basically rebooting a resource and others than depend of it

**Taint a Resource**

- on console: `terraform taint "random_string.random[0]"`
- returns: Resource instance random_string.random[0] has been marked as tainted.

**Un-taint a Resource**

- on console: `terraform untaint "random_string.random[0]"`
- returns: Resource instance random_string.random[0] has been successfully untainted.

## Terraform import

- it help to fix broken state of terraform
- If a resource is missing in the configuration file or in the state you have to do the following to restore the state of terraform
  - 1.- Add the resource to your configurations
  - 2.- apply the import command of terraform = `terraform import docker_container.nodered_container2 $(docker inspect --format="{{.ID}}" nodered-3ose)`
  - 3.- Once the resource is created in the state you can redeploy or eliminate the whole state(recommended)

## Variables

- You can define a variable with this syntax:
  `variable "ext_port" {}`
- And to pass value you can use one of the following methods
  - via command line `terraform plan -var ext_port=1880`
  - via environment variables with the prefix TF*VAR* `export TF_VAR_ext_port=1880`
  - you can define a default value:

```
variable "ext_port" {
  type    = number
  default = 1880
}
```

**Custom validation rules**

- We can add some logic to validate the value passed for the variable with the following syntax:

```
variable "ext_port" {
type    = number
default = 1880

validation {
  condition     = var.ext_port <= 65535 && var.ext_port > 0
  error_message = "The external port must be in the valid port range 0 - 65535."
}
}
```

## tfvars files

- If you are managing sensitive data, you should not expose your default values of you variables so you can use a file with an extension of "tfvars" to automatically make terraform read values from that file and be sure to .gitignore that file in order to do not share those values
- Format of the file to define the variables:

Inside tfvars file

```
ext_port = 1880
```

- You can use several file in order to manage numerous environments you can define with tfvar file to read from the console like this: `terraform apply --var-file file.tfvars`

### Local Values

- Use to save a long expression or something you are going to use frequently
- Different from values this does allows functions

Example:

```
<!-- Definition -->
locals {
  container_count = length(ext_port)
}

<!-- Call -->
resource "random_string" "random" {
  count   = local.container_count
  length  = 4
  special = false
  upper   = false
}
```

### Functions

- length(var) = (Return the length of a list)
- min(1,2,3) = (Returns the minimum values of the parameters passed)
- max(1,2,3) = (Returns the maximum values of the parameters passed)
- (Spread operator) `[1,2,3]...` -> 1, 2, 3 (Returns the values of a list as parameters) useful example `max([1,2,3]...)` or `max(var.myList...)`

## Path references and string interpolation

- path.cwd (returns the path of the current working directory)
- path.root
- path.module
- **String interpolation**
  - Inside a strin you can interpolate a variable with the next syntax
  - `"Hello my name is: ${var.name}"`

### Maps and Lookups

- We can lookup into a value in a map, by the lookup function that takes the map and the key we are trying to access.
- We can use this to manage values environment in variables

```
> lookup({dev = "image1", prod = "image2"}, "dev")
"image1"
> lookup({dev = "image1", prod = "image2"}, "prod")
"image2"
>

<!-- Example of selection a type of image depending on environment -->
<!-- Variable Definition -->
variable "image" {
  type        = map(any)
  description = "Image for container"
  default = {
    dev  = "nodered/node-red:latest"
    prod = "nodered/node-red:latest-minimal"
  }
}

<!-- Usage -->
> lookup(var.image, "prod")
"nodered/node-red:latest-minimal"
> lookup(var.image, "dev")
"nodered/node-red:latest"
```

### Workspaces

- Allows you to have multiple workspaces to manage in a better way environments
- Allows you to have multiple states
- Not all backend supports workspaces so it is a good idea to check before implementing
- Commands
  - `terraform workspace new dev` Creates a new workspace named "dev"
  - `terraform workspace show` Shows current workspace you are in
  - `terraform workspace list` Shows all terraform workspaces
  - `terraform workspace select dev` Change workspace to dev

**Referencing your workspace in your script**

- You can access to your terraform workspace name value by this expression: `terraform.workspace` in your HCL code
  Example

```
<!-- A Resource named in base of the workspace  -->
resource "docker_container" "nodered_container" {
  count = local.container_count
  name  = join("-", ["nodered", terraform.workspace, random_string.random[count.index].result])
  image = docker_image.nodered_image.latest
}
```