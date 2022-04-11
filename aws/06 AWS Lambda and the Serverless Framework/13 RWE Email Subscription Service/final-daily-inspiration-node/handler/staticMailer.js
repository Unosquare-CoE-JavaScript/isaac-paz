const aws = require("aws-sdk");
const sns = new aws.SNS();
const axios = require("axios");

const publishToSNS = (message) =>
  sns
    .publish({
      Message: message,
      TopicArn: process.env.SNS_TOPIC_ARN,
    })
    .promise();

const buildEmailBody = (id, form) => {
  return `
         Message: ${form.message}
         Name: ${form.name}
         Email: ${form.email}
         Service information: ${id.sourceIp} - ${id.userAgent}
      `;
};

module.exports.staticMailer = async (event) => {
  console.log("EVENT::", event);
  const data = JSON.parse(event.body);
  const emailBody = buildEmailBody(event.requestContext.identity, data);

  await publishToSNS(emailBody);

  await axios
    .post(
      "https://zpl2qfqs4a.execute-api.us-east-1.amazonaws.com/dev/subscribe",
      { email: data.email }
    )
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log("Error subscribing user:::", error);
    });

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*", // Required for CORS support to work
      "Access-Control-Allow-Credentials": false, // Required for cookies, authorization headers with HTTPS
    },
    body: JSON.stringify({ message: "OK" }),
  };
};
