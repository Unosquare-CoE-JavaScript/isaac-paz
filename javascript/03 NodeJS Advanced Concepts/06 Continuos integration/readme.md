# 5 Continuos Integration

### What is it?

Process to merger all code changes into a single branch

### What is a CI Server?

Server that runs automatic checks (tests) on the codebase to ensure the changes have not broken anything

## 1 CI Flow

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

## 2 Set Up

1.- First you have to make sure you have a mechanism to pass all your env to this new ci environment in this case we created this file : config/ci.js to handle all the environments

```
module.exports = {
  googleClientID:
    "70265989829-0t7m7ce5crs6scqd3t0t6g7pv83ncaii.apps.googleusercontent.com",
  googleClientSecret: "8mkniDQOqacXtlRD3gA4n2az",
  mongoURI: "mongodb://127.0.0.1:27017/blog_ci",
  cookieKey: "123123123",
  redisUrl: "redis://127.0.0.1:6379",
};

```

2.- Then you have to config you .travis.uml, this is the file that travis is going to read and use to build your project

```
language: node_js
node_js:
  - "8"
dist: trusty // type of linux very reliable with this process of CI
services: // Services that our project connects to and we want to have available on the virtual machine
  - mongodb
  - redis-server
env:
  - NODE_ENV=ci PORT=3000 //Some environments that are read directly from the project
cache: // Directories that are going to use cache to do not download it every time and make a faster CI
  directories:
    - node_modules
    - client/node_modules
install: // Scripts neede to setup and build the project
  - npm install
  - npm run build
script: // Scripts that travis is going to run if any of those scripts return <> 0 travis will say it was a successful build
  - nohup npm run start &
  - sleep 3
  - npm run test
```

3.- go to https://www.travis-ci.com/ register yourself with you github account, select a plan an configure travis to listen to your repository to trigger the ci pipeline
