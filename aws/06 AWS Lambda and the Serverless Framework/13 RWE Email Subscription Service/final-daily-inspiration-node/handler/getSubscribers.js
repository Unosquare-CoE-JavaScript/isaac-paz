const AWS = require("aws-sdk");
const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
module.exports.getSubscribers = (event, context, callback) => {
  const params = {
    TableName: USERS_TABLE,
  };

  dynamoDb.scan(params, (error, data) => {
    if (error) {
      console.error(error);
      callback(new Error(error));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };

    callback(null, response);
  });
};
