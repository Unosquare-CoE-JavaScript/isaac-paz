output "instance_ip" {
  value = aws_instance.platzi-instance.*.public_ip
}
