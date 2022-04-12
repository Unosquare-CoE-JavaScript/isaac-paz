const AWS = require("aws-sdk");
const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uuid = require("uuid");

module.exports.subscribeUser = async (event, context) => {
  try {
    const data = JSON.parse(event.body);
    console.log("EVENT:::", data);

    const timestamp = new Date().getTime();

    if (typeof data.email !== "string") {
      console.error("Validation Failed");
      throw new Error("Validation Failed email not properly initialized");
    }

    const params = {
      TableName: USERS_TABLE,
      Item: {
        userId: uuid.v4(),
        email: data.email,
        subscriber: true,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    };

    const res = await dynamoDb.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Subscribed successfully" }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};
