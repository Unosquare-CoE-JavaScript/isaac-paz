const AWS = require("aws-sdk");
AWS.config.update({ region: process.env.REGION });
const s3 = new AWS.S3();

module.exports.getQuotes = async (event, context, callback) => {
  try {
    console.log("Incoming:::", event);
    const data = await s3
      .getObject({
        Bucket: "isaac-my-json-quotes-bucket",
        Key: "quotes.json",
      })
      .promise();

    let json = JSON.parse(data.Body);
    console.log("JSON:::", json);

    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 200,
      body: JSON.stringify(json),
    };
  } catch (err) {
    console.error(err);
    return {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
      },
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};
