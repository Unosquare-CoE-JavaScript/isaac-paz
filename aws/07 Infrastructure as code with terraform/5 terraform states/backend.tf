terraform {
  backend "s3" {
    bucket     = "ispm-backend-terraform-platzi"
    key        = "dev"
    region     = "us-east-2"
    encrypt    = true
    kms_key_id = "arn:aws:kms:us-east-2:079366237922:key/bccf026e-5efa-4499-805c-10f6c7c8a582"
  }
}
