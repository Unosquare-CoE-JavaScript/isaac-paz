// Definitions
// ====================
const Right = (x) => ({
  chain: (f) => f(x),
  map: (f) => Right(f(x)),
  fold: (f, g) => g(x),
  toString: () => `Right(${x})`,
});

const Left = (x) => ({
  chain: (f) => Left(x),
  map: (f) => Left(x),
  fold: (f, g) => f(x),
  toString: () => `Left(${x})`,
});

const fromNullable = (x) => (x != null ? Right(x) : Left(null));

const tryCatch = (f) => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
};

const logIt = (x) => {
  console.log(x);
  return x;
};

const DB_REGEX = /postgres:\/\/([^:]+):([^@]+)@.*?\/(.+)$/i;

// Exercise: Either
// Goal: Refactor each example using Either
// Bonus: no curlies
// =========================

// Ex1: Refactor streetName to use Either instead of nested if's
// =========================

const getAdress = (user) => (user.address ? Right(user.address) : Left(""));
const getStreet = (adress) => (adress.street ? Right(adress.street) : Left(""));

const street = (user) =>
  fromNullable(user)
    .chain(getAdress)
    .chain(getStreet)
    .fold(
      () => "no street",
      (x) => x
    );

QUnit.test("Ex1: street", (assert) => {
  const user = { address: { street: { name: "Willow" } } };
  assert.deepEqual(street(user), { name: "Willow" });
  assert.equal(street({}), "no street");
});

// Ex1: Refactor streetName to use Either instead of nested if's
// =========================

const streetName_ = (user) => {
  const address = user.address;

  if (address) {
    const street = address.street;

    if (street) {
      return street.name;
    }
  }

  return "no street";
};

const streetName = (user) =>
  fromNullable(user)
    .chain(getAdress)
    .chain(getStreet)
    .chain((street) => (street.name ? Right(street.name) : Left("")))
    .fold(
      () => "no street",
      (x) => x
    );

QUnit.test("Ex1: streetName", (assert) => {
  const user = { address: { street: { name: "Willow" } } };
  assert.equal(streetName(user), "Willow");
  assert.equal(streetName({}), "no street");
  assert.equal(streetName({ address: { street: null } }), "no street");
});

// Ex2: Refactor parseDbUrl to return an Either instead of try/catch
// =========================
const parseDbUrl_ = (cfg) => {
  try {
    const c = JSON.parse(cfg); // throws if it can't parse
    return c.url.match(DB_REGEX);
  } catch (e) {
    return null;
  }
};

const parseJson = (json) => tryCatch(() => JSON.parse(json));
const getUrlMatch = (obj) => tryCatch(() => obj.url.match(DB_REGEX));

const parseDbUrl = (cfg) =>
  parseJson(cfg)
    .chain(getUrlMatch)
    .fold(
      () => null,
      (x) => x
    );

QUnit.test("Ex1: parseDbUrl", (assert) => {
  const config = '{"url": "postgres://sally:muppets@localhost:5432/mydb"}';
  assert.equal(parseDbUrl(config)[1], "sally");
  assert.equal(parseDbUrl(), null);
});

// Ex3: Using Either and the functions above, refactor startApp
// =========================
const startApp_ = (cfg) => {
  const parsed = parseDbUrl(cfg);

  if (parsed) {
    const [_, user, password, db] = parsed;
    return `starting ${db}, ${user}, ${password}`;
  } else {
    return "can't get config";
  }
};

const startApp = (cfg) =>
  fromNullable(parseDbUrl(cfg))
    .map((obj) => `starting ${obj[3]}, ${obj[1]}, ${obj[2]}`)
    .fold(
      () => `can't get config`,
      (x) => x
    );

QUnit.test("Ex3: startApp", (assert) => {
  const config = '{"url": "postgres://sally:muppets@localhost:5432/mydb"}';
  assert.equal(String(startApp(config)), "starting mydb, sally, muppets");
  assert.equal(String(startApp()), "can't get config");
});
