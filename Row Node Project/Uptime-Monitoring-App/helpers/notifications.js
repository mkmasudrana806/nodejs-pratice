/*
 * Title: Notifications library
 * Description: Important functions to notify users
 * Author: Masud Rana
 * Date: 28/10/2023
 */

// Dependencies
const https = require("https");
const { twilioInfo } = require("./environment");
const querystring = require("querystring");
const environment = require("./environment");
const twilio = require("twilio")(
  environment.twilioInfo.accountSid,
  environment.twilioInfo.authToken
);

// module scaffolding
const notifications = {};

notifications.sendTwilioSms = (to, message, callback) => {
  // send message
  twilio.messages
    .create({
      from: environment.twilioInfo.fromPhone,
      to: `+88${to}`,
      body: "This is a test message from twilio",
    })
    .then((res) => callback("Message sent successfully"))
    .catch((err) => console.log(err));
};

// export the module
module.exports = notifications;
