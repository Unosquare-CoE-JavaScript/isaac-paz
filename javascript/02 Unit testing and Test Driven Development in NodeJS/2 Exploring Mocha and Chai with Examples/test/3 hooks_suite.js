const expect = require("chai").expect;

// before("Root Setup code", () => {
//   console.log("* Root Before tests");
// });
// after("Root teardown code", () => {
//   console.log("* Root After tests");
// });

// beforeEach("Root setup for each test", () => console.log("* Root before each"));

// afterEach("Root teardown for each test", () =>
//   console.log("* Root after each")
// );

describe("hook_suite", () => {
  before("Setup code", () => {
    console.log("--->Before tests");
  });
  after("teardown code", () => {
    console.log("--->After tests");
  });

  beforeEach("setup for each test", () => console.log("--->before each"));

  afterEach("teardown for each test", () => console.log("--->after each"));

  it("test_hook 1", () => {
    expect(true).to.equal(true);
  });
  it("test_hook 2", () => {
    expect(true).to.equal(true);
  });
});

/*
//output
* Root Before tests
  hook_suite
--->Before tests
* Root before each
--->before each
    ✔ test_hook 1
--->after each
* Root after each
* Root before each
--->before each
    ✔ test_hook 2
--->after each
* Root after each
--->After tests

* Root After tests
*/
