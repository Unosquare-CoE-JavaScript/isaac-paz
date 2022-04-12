# 3 Tools to create immutable infrastructure

## Immutable infrastructure

- Packer (Hashicorp)
  - It allow us to create personalized AWS amis
  - It also uses a definition file
  - Elements:
    - variables: as its name indicates, here we define the variables that we are going to use.
    - builders: we indicate where we are going to build our base image.
    - provisioners: here we customize our image, add packages, create directories, define the state of the infrastructure, etc.
    - post-processors: we can have output files and execute commands after having created the infrastructure, everything runs locally.
