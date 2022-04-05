let Relationship = Object.freeze({
  parent: 0,
  child: 1,
  sibling: 2,
});

class Person {
  constructor(name) {
    this.name = name;
  }
}

//Interface
class RelationshipBrowser {
  constructor() {
    if (this.constructor.name == "RelationshipBrowser") {
      throw new Error("RelationshipBrowser is abstract!");
    }
  }

  findAllChildrenOf(name) {}
}

//Low-Level Module (Storage)
class Relationships extends RelationshipBrowser {
  constructor() {
    super();
    this.data = [];
  }

  addParentAndChild(parent, child) {
    this.data.push({ from: parent, to: child, type: Relationship.parent });
  }

  findAllChildrenOf(name) {
    return this.data
      .filter((r) => r.from.name === "John" && r.type === Relationship.parent)
      .map((r) => r.to);
  }
}

//High Level Module (Getting data out - Front-end)
class Research {
  constructor(browser) {
    for (let p of browser.findAllChildrenOf("John")) {
      console.log(`John has a child called ${p.name}`);
    }
  }
}

let parent = new Person("John");
let child1 = new Person("Chris");
let child2 = new Person("Matt");

let relationship = new Relationships();

relationship.addParentAndChild(parent, child1);
relationship.addParentAndChild(parent, child2);

new Research(relationship);
