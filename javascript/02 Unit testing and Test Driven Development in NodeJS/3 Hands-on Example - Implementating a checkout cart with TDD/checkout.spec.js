const exp = require("constants");
const Checkout = require("./checkout");

let expect = require("chai").expect;
let checkout;

beforeEach(() => {
  checkout = new Checkout();
  checkout.addItemPrice("a", 1);
  checkout.addItemPrice("b", 2);
});

it("Can add item price", () => {
  expect(true).to.equal(true);
});

it("Can calculate the current total", () => {
  checkout.addItem("a");
  expect(checkout.calculateTotal()).to.equal(1);
});

it("Can add multiple items and get correct total", () => {
  checkout.addItem("a");
  checkout.addItem("b");
  expect(checkout.calculateTotal()).to.equal(3);
});

it("Can add discount rule", () => {
  checkout.addDiscount("a", 3, 2);
});

it("Can apply discount rules to the total", () => {
  checkout.addDiscount("a", 3, 2);
  checkout.addItem("a");
  checkout.addItem("a");
  checkout.addItem("a");
  expect(checkout.calculateTotal()).to.equal(2);
});

it("Throws when item added with no price", () => {
  expect(() => checkout.addItem("c")).to.throw();
});
