let expect = require("chai").expect;

function myAsyncFunction(callback) {
  setTimeout(function () {
    callback("blah");
  }, 50);
}

function promiseFunc() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("blah");
    }, 50);
  });
}

describe("async_test1", () => {
  it("callback_test", function (done) {
    myAsyncFunction(function (str) {
      expect(str).to.equal("blah");
      done();
    });
  });

  it("Promise test", function () {
    return promiseFunc().then((result) => expect(result).to.equal("blah"));
  });

  it("Async test", async () => {
    let res = await promiseFunc();
    expect(res).to.be.equal("blah");
  });
});
