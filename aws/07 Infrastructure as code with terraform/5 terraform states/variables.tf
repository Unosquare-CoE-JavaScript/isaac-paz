variable "bucket_name" {
  default = "ispm-backend-terraform-platzi"
}

variable "acl" {
  default = "private"
}

variable "tags" {
  default = {
    Environment = "Dev"
    CreatedBy   = "terrafor"
  }
}



