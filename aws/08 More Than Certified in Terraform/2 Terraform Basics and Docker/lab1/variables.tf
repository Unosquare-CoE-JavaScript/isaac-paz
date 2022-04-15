variable "int_port" {
  type    = number
  default = 3000
  validation {
    condition     = var.int_port == 3000
    error_message = "The Grafana port must be set to 3000."
  }
}

variable "ext_port" {
  type = list(number)
}
