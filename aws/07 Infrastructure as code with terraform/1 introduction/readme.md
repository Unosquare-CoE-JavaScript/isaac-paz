# 1 Infrastructure as code with Terraform

## Definition

- It is a way to automate infrastructure based on practices of software development
- Principles
  - Systems can be reproduce easily (it is reusable)
  - Systems are renewable (if it is failing you can reconstruct a new one)
  - System are consistence (You have only one file to define your servers)
  - Design is always changing
- Practices
  - Use definition files
  - Auto-documented infrastructure
  - Use version control software
  - Small changes
  - Keep services with high availability

## Types of tools to implement infrastructure as code

- Infrastructure defining tools
  - Define resources
  - Set resources configurations
    - Virtual machines
    - Networks
    - Disks
  - Uses Definition File
  - Examples:
    - Terraform
    - Cloud formation
    - Open stack heat
- Configure Server Tools
  - Configure infrastructure with a certain state (e.j. packages needed on server, dependencies)
  - Examples
    - Ansible
    - Chef
    - Puppet

## Benefits

- Fast creation under demand (Reusable, only write definition one time)
- Automatization (CI/CD)
- Visibility and Traceability (With Git)
- Homogeneous environments
- Easy to test
