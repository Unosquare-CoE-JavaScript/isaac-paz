# SOLID Principles

- Introduced by Robert C. Martin
- Frequently references in Design Pattern literature

## 1 Single Responsibility Principle

- A Class only should have only one responsibility
- Only one reason to change
- Separation of concerns = Split all functionalities on different classes
- Do not make an anti patterns God Class (A Class that has a lot of functionalities)

Example of this principle being applied

Here you have a class Journal that its responsibility is add and remove entries, and instead of creating a method to save this entries to a file, create a new class that is going to be in charge to save this data and why not other kind of data to persist then in a file

```
class Journal {
  static count = 0;

  constructor() {
    this.entries = {};
  }

  addEntry(text) {
    let c = ++Journal.count;
    let entry = `${c}: ${text}`;
    this.entries[c] = entry;
    return c;
  }

  removeEntry(index) {
    delete this.entries[index];
  }

  toString() {
    return Object.values(this.entries).join("\n");
  }
}

class PersistenceManager {
  saveToFile(journal, filename) {
    fs.writeFileSync(filename, journal.toString());
  }
}

```

## 2 Open-Closed Principle

- Never Jump into an existing class and start to modify or add methods (Unless like a bug)
- Use inheritance to extend functionality (Specification class) with interfaces

Bad implementation of a filter (Every time you are asked to add a new way to filter products you are going to add more methods to class):

```
class Product {
  constructor(name, color, size) {
    this.name = name;
    this.color = color;
    this.size = size;
  }
}

//Open for extension (Inheritance), closed for modification
class ProductFilter {
  filterByColor(products, color) {
    return products.filter((p) => p.color === color);
  }

  filterBySize(products, size) {
    return products.filter((p) => p.size === size);
  }

  filterBySizeAndColor(products, size, color) {
    return products.filter((p) => p.size === size && p.color === color);
  }

  // State space explosion
  // Color or Size
  // 3 criteria = 7 methods
}
```

Better Implementation of a Filter:

- You can add more specification to filter by other criteria
- you create a combinator Specification to join specific login with and or or combinations
- You do not touch already tested classes you create new one with the interface compatibility of specs

```

class BetterFilter {
  filter(items, spec) {
    return items.filter((x) => spec.isSatisfied(x));
  }
}

class AndSpecification {
  constructor(...specs) {
    this.specs = specs;
  }

  isSatisfied(item) {
    return this.specs.every((x) => x.isSatisfied(item));
  }
}

//Specification
class ColorSpecification {
  constructor(color) {
    this.color = color;
  }

  isSatisfied(item) {
    return item.color === this.color;
  }
}

//Specification
class SizeSpecification {
  constructor(size) {
    this.size = size;
  }

  isSatisfied(item) {
    return (item.size = this.size);
  }
}

```

## 3 Liskov Substitution Principle

- If you have a function which takes some base type, it should also equally be able to take a derivative type

Example of a implementation that breaks this principle

- On the method useIt, methods works well on rectangle base class but when passed an square class logic does not work as expected because square set its width or height when one of those in changed

```
class Rectangle {
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  set width(value) {
    this._width = value;
  }

  set height(value) {
    this._height = value;
  }

  get area() {
    return this._width * this._height;
  }

  toString() {
    return `${this._width} * ${this._height}`;
  }
}

class Square extends Rectangle {
  constructor(size) {
    super(size, size);
  }

  set width(value) {
    this._width = this._height = value;
  }

  set height(value) {
    this._width = this._height = value;
  }
}

let useIt = function (rc) {
  let width = rc._width;
  rc.height = 10;

  console.log(`Expected area of ${10 * width}, ` + `got ${rc.area}`);
};
```

## 4 Interface Segregation Principle

- Javascript does not have interfaces, it uses duck typing
- But typescript does have interfaces use it when possible
- Split up interfaces so people do not implement more than they need

- Bad implementation (Interface has many method than cannot be implemented by all machines, and users of this API should let body in blank od those functions or implement Errors, that are not user friendly)

```
class Machine {
  constructor() {
    if (this.constructor.name === "Machine") {
      throw new Error("machine is abstract!");
    }
  }

  print(doc) {}
  fax(doc) {}
  scan(doc) {}
}
```

- Good implementations(user can implement just what they need)

```
class IPrinter {
  constructor() {
    if (this.constructor.name === "Printer") {
      throw new Error("machine is abstract!");
    }
  }
  print(doc) {}
}

class IScanner {
  constructor() {
    if (this.constructor.name === "Scanner") {
      throw new Error("machine is abstract!");
    }
  }
  scan(doc) {}
}

class IFax {
  constructor() {
    if (this.constructor.name === "Fax") {
      throw new Error("machine is abstract!");
    }
  }
  fax(doc) {}
}

```

## 5 Dependency Inversion Principle

- Define the relation that should have low level modules and high level modules
- High level module should not depend on implementation of low level modules
- Anything to do with dependency injection (It is a consequence)
- Normally it would be implemented by an abstract class or a interface but since in javascript we do not have those tools it is just used with our Duck typing

## 6 Gamma Categorization

- Design patters are typically split into three categories
- This is called Gamma Categorization after Erich Gamma, one of GoF authors

**Categories**

- **Creational Patterns**
  - Deal with the creation (construction) of objects
  - Explicit (constructor) and Implicit(Dependency Injection, reflection, etc)
  - Wholesale (single statement) and piecewise(step-by-step)
- **Structural Patterns**
  - concerned with the structure (class members)
  - Many patterns are wrappers that mimic the underlying class interface
  - Stress the importance of good API design
- **Behavioral patterns**
  - They are all different; no central theme
