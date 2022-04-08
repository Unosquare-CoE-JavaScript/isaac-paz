"use strict";

module.exports.hello = async (event) => {
  const multiplier = 7;
  let catAge = multiplier * event.age;

  console.log("Received event:", JSON.stringify(event, null, 2));
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: catAge,
        input: event,
      },
      null,
      2
    ),
  };
};
