terraform {
  backend "s3" {
    bucket = "ispm-backend-terraform-platzi"
    key    = "dev"
    region = "us-east-2"
  }
}
