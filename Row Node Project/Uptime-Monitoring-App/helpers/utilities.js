/*
 * Title: Utilities
 * Description: Important utility functions
 * Author: Masud Rana
 * Date: 26/10/2023
 */

// Dependencies
const crypto = require("crypto");
const environment = require("./environment");

// module scaffolding
const utilities = {};

// parse JSON string to Object
utilities.parseJSON = (jsonString) => {
  let output = {};
  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    output = {};
  }
  return output;
};

// hash any string
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    const hashStr = crypto
      .createHmac("sha256", environment.secretKey)
      .update(str)
      .digest("hex");
    return hashStr;
  }
  return false;
};

// export module
module.exports = utilities;
