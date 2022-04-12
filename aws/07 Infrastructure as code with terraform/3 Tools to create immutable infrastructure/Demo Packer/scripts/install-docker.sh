#!/bin/bash
# Instalar Docker
sudo yum update -y

sudo yum install docker -y
sudo service docker start

#Agregar el usuario centos al grupo docker
sudo usermod -a -G docker ec2-user
