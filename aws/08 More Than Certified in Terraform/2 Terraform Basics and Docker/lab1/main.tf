terraform {
  required_providers {
    docker = {
      source = "kreuzwerker/docker"
    }
  }
}

provider "docker" {}


resource "docker_image" "container_image" {
  name = "grafana/grafana"
}

resource "docker_container" "container" {
  count = 2
  image = docker_image.container_image.latest
  name  = "grafana_container-${count.index}"
  ports {
    internal = 3000
    external = var.ext_port[count.index]
  }
}


output "public_ip" {
  value = [for x in docker_container.container : "${x.name} - ${x.ip_address}:${x.ports[0].external}"]
}
