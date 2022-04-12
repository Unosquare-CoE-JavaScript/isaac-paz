const AWS = require("aws-sdk");

const TODO_TABLE = process.env.TODO_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid");
module.exports.createTodo = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.todo !== "string") {
    console.error("Validation Failed");
    return;
  }

  const params = {
    TableName: TODO_TABLE,
    Item: {
      id: uuid.v1(),
      todo: data.todo,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  dynamoDb.put(params, (error, data) => {
    if (error) {
      console.error(error);
      callback(new Error(error));
      return;
    }
    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
    callback(null, response);
  });
};
