const fs = require("fs");

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

let p = new PersistenceManager();
let filename = __dirname + "/1 single-responsibility.txt";

Journal.count = 0;

let j = new Journal();
j.addEntry("I cried today");
j.addEntry("i ate a bug");

console.log(j.toString());

p.saveToFile(j, filename);
