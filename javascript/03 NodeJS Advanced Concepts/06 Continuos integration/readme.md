# Continuos Integration

### What is it?

Process to merger all code changes into a single branch

### What is a CI Server?

Server that runs automatic checks (tests) on the codebase to ensure the changes have not broken anything

## CI Flow

- Developer pushes code to github
- Ci Server detects that a new push of code has occurred
- Si Server clones project to a cloud-based virtual machine
- CI Server runs all tests
- if all test pass, CI Server marks build as 'passing' and does some optional followup

### CI Providers

- Travis CI
- Circle CI
- CodeShip
- AWS Codebuild
