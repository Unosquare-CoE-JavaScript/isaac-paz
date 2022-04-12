const AWS = require("aws-sdk");
const TODO_TABLE = process.env.TODO_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.updateTodo = (event, context, callback) => {
  const datetime = new Date().toISOString();
  const data = JSON.parse(event.body);

  if (typeof data.todo !== "string" || typeof data.checked !== "boolean") {
    console.error("Value of todo or checked is invalid");
    return;
  }

  const params = {
    TableName: TODO_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      "#todo_text": "todo",
    },
    ExpressionAttributeValues: {
      ":todo": data.todo,
      ":checked": data.checked,
      ":updatedAt": datetime,
    },
    UpdateExpression:
      "SET #todo_text = :todo, checked = :checked, updatedAt = :updatedAt",
    ReturnValues: "ALL_NEW",
  };

  dynamoDb.update(params, (error, data) => {
    if (error) {
      console.error(error);
      callback(new Error(error));
      return;
    }
    const response = {
      statusCode: 200,
      body: JSON.stringify(data.Attributes),
    };
    callback(null, response);
  });
};
