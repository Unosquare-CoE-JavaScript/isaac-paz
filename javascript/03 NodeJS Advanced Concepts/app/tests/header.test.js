const Page = require("./helpers/page");

let page = undefined;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  try {
    await page.close();
  } catch (e) {}
});

test("The header has the correct text", async () => {
  // const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  const text = await page.getContentsOf("a.brand-logo");
  expect(text).toEqual("Blogster");
});

test("Clicking login starts oauth flow", async () => {
  await page.click(".right a");
  const url = page.url();
  url.includes;
  expect(url).toMatch(/accounts\.google\.com/);
});

test("When signed in, shows logout button", async () => {
  await page.login();
  const text = await page.$eval('a[href="/auth/logout"]', (el) => el.innerHTML);

  expect(text).toMatch(/Logout/);
});
