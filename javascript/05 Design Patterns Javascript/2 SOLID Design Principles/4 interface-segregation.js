class Document {}

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

class MultiFunctionPrinter extends Machine {
  print(doc) {
    // Ok Can print
  }
  fax(doc) {
    // Ok Can fax
  }
  scan(doc) {
    // Ok Can scan
  }
}

class NotImplementedError extends Error {
  constructor(name) {
    let msg = `${name} is not implemented!`;
    super(msg);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotImplementedError);
    }
  }
}

class OldFashionPrinter extends Machine {
  print(doc) {
    // Ok Can print
  }

  // fax(doc) {
  //   // do nothing
  //   // Principle of least surprise (violates this principle)
  // }

  scan(doc) {
    throw new NotImplementedError("OldFashionPrinter.scan");
  }
  //User Unfriendly
}

//ISP = Segregate (Split up)

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

class Photocopier {
  print() {}
  scan() {}
}

let printer = new OldFashionPrinter();
printer.scan();
