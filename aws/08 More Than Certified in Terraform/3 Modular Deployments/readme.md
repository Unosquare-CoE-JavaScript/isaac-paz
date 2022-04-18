# Module Deployments

- You can separate login into different modules,
- In order to create a module you need to create a new folder
- create your normal files like (main.tf, output.tf, providers.tf, variables.tf)
- After you create your logic as a separated terraform project, you reference your module in your root module like this, givin the module a name and a path to your folder's module

```
module "image" {
  source = "./image"
}
```

- If you want to reference some data from you module, you first have to create an output from you module

```
output "image_out" {
  value = docker_image.nodered_image.latest
}

```

and make reference from you root module with this syntax, first make reference with the keyword module, then the module name, and last the name of your output variable

```
resource "docker_container" "nodered_container" {
  name  = "name"
  image = module.image.image_out
}
```

## Variables on modules

- You pass de value as a property of the module when calling on your root module

```
module "image" {
  source   = "./image"
  image_in = var.image[terraform.workspace]
}
<!-- Everything after source property its going to be taken as a variable of the module -->
```

- Then create the variable on a variables.tf on the module you are going to use the variable

```
variable "image_in" {
  description = "Name of image"
}
```

- Use the variable with the name created in your variables.tf on the module

```
resource "docker_image" "nodered_image" {
  name = var.image_in
}
```

## Generate a Graph of dependencies

- Install graphviz
- run the next command to generate a pdf with the dependencies: `terraform graph | dot -Tpdf > graph-plan.pdf`
- Create a graph of the destroy plan: `terraform graph -type=plan-destroy | dot -Tpdf > graph-destroy.pdf`

### Cycles of dependencies

- Use the following command to spot rapidly your cycles and fix them:
- `terraform graph -draw-cycles | dot -Tpdf > cycle.pdf`

## Prevent the destruction of resources

- You can prevent the destroy of a resource with the following metadata:

```
resource "docker_volume" "container_volume" {
  name = "${var.name_in}-volume"
  lifecycle {
    prevent_destroy = true
  }
}
```

## for_each usage

- Allows you to iterate in a map making possible to access its key and values

First create a map with data you want to iterate

```
locals {
  deployment = {
    nodered = {
      container_count = length(var.ext_port["nodered"][terraform.workspace])
      image           = var.image["nodered"][terraform.workspace]
      int             = 1880
      ext             = var.ext_port["nodered"][terraform.workspace]
      container_path  = "/data"
    }
    influxdb = {
      container_count = length(var.ext_port["influxdb"][terraform.workspace])
      image           = var.image["influxdb"][terraform.workspace]
      int             = 8086
      ext             = var.ext_port["influxdb"][terraform.workspace]
      container_path  = "/var/lib/influxdb"
    }
  }
}

```

Then you can use iterate this map in other resource like this

- After you assign the value of the map you are going to iterate with this property: `for_each = local.deployment`
- It is going to create as many resources as key:values has the iterating map,
- It allows you to user a `each` variable to access the data on each iteration like this `each.key` and `each.values`

```

module "image" {
  source   = "./image"
  for_each = local.deployment
  image_in = each.value.image
}

module "container" {
  source            = "./container"
  for_each          = local.deployment
  count_in          = each.value.container_count
  name_in           = each.key
  image_in          = module.image[each.key].image_out
  int_port_in       = each.value.int
  ext_port_in       = each.value.ext
  container_path_in = each.value.container_path
}
```
