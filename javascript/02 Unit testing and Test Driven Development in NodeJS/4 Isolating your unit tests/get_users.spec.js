let expect = require("chai").expect;
let chai = require("chai");
let sinon = require("sinon");
let sinonChai = require("sinon-chai");
let request = require("request");
chai.should();
chai.use(sinonChai);

let getUsers = require("./get_users");

describe("GetUsers Tests", function () {
  let spy;

  beforeEach(function () {
    spy = sinon.spy();
    sinon.stub(request, "get").callsFake(function (url, callback) {
      callback({}, { body: '{"users": ["user1", "user2"]}' });
    });
  });

  afterEach(function () {
    sinon.restore();
  });

  it("Calls the callback", function () {
    getUsers(spy);
    spy.should.have.been.calledOnce;
  });

  it("Calls the correct URL", function () {
    getUsers(spy);
    request.get.should.have.been.calledWith("https://www.mysite.com/api/users");
  });

  it("Returns correct data", function () {
    getUsers(spy);
    spy.should.have.been.calledWith({ users: ["user1", "user2"] });
  });
});
