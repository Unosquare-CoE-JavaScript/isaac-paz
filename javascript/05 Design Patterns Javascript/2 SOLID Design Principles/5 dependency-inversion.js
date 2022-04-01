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

//Low-Level Module (Storage)

class Relationships {
  constructor() {
    this.data = [];
  }

  addParentAndChild(parent, child) {
    this.data.push({ from: parent, to: child, type: Relationship.parent });
  }
}

//High Level Module (Getting data out - Front-end)

class Research {
  constructor(relationships) {
    //find all children of John
    let relations = relationships.data;
    for (let rel of relations.filter(
      (r) => r.from.name === "John" && r.type === Relationship.parent
    )) {
    }
  }
}

let parent = new Person("John");
let child1 = new Person("Chris");
let child2 = new Person("Matt");

let relationship = new Relationship();

relationship.addParentAndChild(parent, child1);
relationship.addParentAndChild(parent, child2);
