const expect = require("chai").expect;

describe("test_suite1", () => {
  it("test1", () => {
    expect(true).to.equal(true);
  });
});

describe("test_suite2", () => {
  describe("test_suite3", () => {
    it("test3", () => {
      expect(true).to.equal(true);
    });
  });
  it("test2", () => {
    expect(true).to.equal(true);
  });
});
