ami_id        = "ami-00b1cfa5b4d6d00a1"
instance_type = "t2.micro"
tags = {
  "Name"        = "practica 1"
  "Environment" = "prod"
}

sg_name = "platzi-rules"
ingress_rules = [
  {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  },
  {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
]
