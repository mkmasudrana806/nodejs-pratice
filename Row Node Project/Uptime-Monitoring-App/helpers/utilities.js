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

// create random string
utilities.createRandomString = (strlen) => {
  let len = strlen;
  len = typeof strlen === "number" && strlen > 0 ? strlen : false;
  if (len) {
    let possibleChar = "abcdefghijklmnopqrstuvwxyz1234567890";
    let output = "";
    for (let i = 1; i <= len; i++) {
      let randomCharacter = possibleChar.charAt(
        Math.floor(Math.random() * possibleChar.length)
      );
      output += randomCharacter;
    }
    return output;
  } else {
    return false;
  }
};
// export module
module.exports = utilities;
