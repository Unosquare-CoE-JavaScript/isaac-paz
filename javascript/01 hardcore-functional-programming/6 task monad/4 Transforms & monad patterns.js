const fs = require("fs");
const { Task, Either, Id } = require("../types");
const { Right, Left, fromNullable } = Either;
const { List, Map } = require("immutable-ext");

Either.of(List.of(4)).chain((xs) => Either.of(3));
// Either (List(Either))
// Either (Either(List))
// Either (List)
