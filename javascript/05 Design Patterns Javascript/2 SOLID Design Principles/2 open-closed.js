let Color = Object.freeze({
  red: "red",
  green: "green",
  blue: "blue",
});

let Size = Object.freeze({
  small: "small",
  medium: "medium",
  large: "large",
});

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

let apple = new Product("Apple", Color.green, Size.smalls);
let tree = new Product("Tree", Color.red, Size.large);
let house = new Product("house", Color.green, Size.large);

let products = [apple, tree, house];

let pf = new ProductFilter();
console.log(`Green products (old): `);

for (let p of pf.filterByColor(products, Color.green)) {
  console.log(`* ${p.name} is green`);
}

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

let bf = new BetterFilter();
console.log(`Green products (new): `);

for (let p of bf.filter(products, new ColorSpecification(Color.green))) {
  console.log(`* ${p.name} is green`);
}

console.log(`Large and Green products: `);

let spec = new AndSpecification(
  new ColorSpecification(Color.green),
  new SizeSpecification(Size.large)
);

for (let p of bf.filter(products, spec)) {
  console.log(`* ${p.name} is large and green`);
}
