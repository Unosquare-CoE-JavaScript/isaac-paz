# 5 Automated Headless Browser Testing

## Differences between Unit testing an Integration testing

- Unit testing = Assert that one piece of you app is working the way you expect
- Integration Testing = Make sure that multiple 'units' work together correctly

## Puppeteer

Allows us to launch a headless browser and interact with it programmatically

### Common Object and methods

- Puppeteer: Lib that allows us to interact with an instance of a browser
  - Method: launch = Init a Browser object
- Browser: Object that allows us to create multiple pages an interact with them
  - newPage: Init a page on the browser
- Page: Object that allows us to interact with the web applications via many methods
  - goto: Allows us to navigate to an URL
  - setCookie: Allows us to set a cookie in the instance of the page on the current web domain
  - waitFor: make the execution wait until an element of the DOM defined appears on screen
  - $eval: Allows us to retrieve a DOM element on the page
  - evaluate: Allows us to execute javascript code direct in the browser
  - click: Allows us to perform a click on a selector on the page

## Jest

it is a testing framework pretty alike other

### Setup

Jest by default only load test code if we are going to need some libraries as was of this course case,
we need to load models of mongoose you need to pass into the jest command an option to a file that is going to be execute before test like this:

`"test": "jest --setupTestFrameworkScriptFile=./tests/setup.js"`

(inside /test/setup.js)

```
// Set max timeout for each test to 30 seconds
jest.setTimeout(30000);

//Import models and envs
require("../models/User");
const mongoose = require("mongoose");
const keys = require("../config/keys");

//Init connection to mongoDB
//use Nodejs standard implementation
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { userMongoClient: true });

```

### Common methods

- beforeEach: Allows us to run code before each test case
- afterEach: allows us to run code after each test case
- describe: Allows us to organize an group test cases and execute own beforeEach and afterEach to pre configure common situations to these test cases

## Factories

These are functions that we are going to use a lot in our test cases so we make these to retrieve data we are going often need and don't want to handle this logic all the time

userFactory (Creates a new user on the database a retrieve that user to the test case)

```
() => {
  return new User({}).save();
};
```

SessionFactory(Take an user an generate the cookies needed to certificated that is authenticated and return those session to the test case)

```
(user) => {
  const sessionObject = {
    passport: {
      user: user._id.toString(),
    },
  };

  const session = Buffer.from(JSON.stringify(sessionObject)).toString("base64");

  const sig = keygrip.sign("session=" + session);

  return { session, sig };
};

```

## Helpers and Proxy

These helpers allows us to reutilize code on all our test cases, we setup a Custom class to encapsulated the creation of the browser, page and the login logic to make it easy on all test cases to perform these actions

### Proxy

As we seek to have only on object to refer in terms of Page, Browser and new functionality that we wanted to add to this object without touching the lib we came up with the use of proxies

Proxies give us the capability to call to a certain function check if that function is implemented in a custom class other wise, call would be redirected to another object

Example:

```
class CustomPage {

  //Function that creates a browser, a page an return a proxy to call to methods of any of thesw objects priority is set to (CustomPage, browser, page)
  static async build() {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: (target, property) => {
        return customPage[property] || browser[property] || page[property];
      },
    });
  }

  constructor(page) {
    this.page = page;
  }

  //More custom functions we can add up and will have #1 priority at the moment of calls
  ...
}
```
