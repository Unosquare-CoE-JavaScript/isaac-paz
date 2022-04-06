class Field {
  constructor(name) {
    this.name = name;
  }
}

class Class {
  constructor(name) {
    this.name = name;
    this.fields = [];
  }

  toString() {
    let classOutput = [];
    classOutput.push(`class ${this.name} {\n`);

    if (this.fields.length > 0) {
      classOutput.push(`  constructor(`);

      for (let i = 0; i < this.fields.length; ++i) {
        classOutput.push(this.fields[i].name);
        if (i + 1 !== this.fields.length) classOutput.push(", ");
      }

      classOutput.push(`) {\n`);

      for (let field of this.fields) {
        classOutput.push(`    this.${field.name} = ${field.name};\n`);
      }

      classOutput.push("  }\n");
    }

    classOutput.push("}");
    return classOutput.join("");
  }
}

class CodeBuilder {
  constructor(className) {
    this.class = new Class(className);
  }

  addField(name) {
    this.class.fields.push(new Field(name));
    return this;
  }

  toString() {
    return this.class.toString();
  }
}
