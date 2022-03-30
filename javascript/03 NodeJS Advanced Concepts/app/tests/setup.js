jest.setTimeout(30000);

require("../models/User");

const mongoose = require("mongoose");
const keys = require("../config/keys");

//use Nodejs standard implementation
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { userMongoClient: true });
