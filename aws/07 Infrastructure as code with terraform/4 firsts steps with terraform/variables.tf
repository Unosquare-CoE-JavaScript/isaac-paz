variable "ami_id" {
  default     = ""
  description = "Ami Id"
}

variable "instance_type" {
  description = "Type of the ec2 we are going to use"
}

variable "tags" {
  type = map(any)
}


variable "sg_name" {

}

variable "ingress_rules" {

}
