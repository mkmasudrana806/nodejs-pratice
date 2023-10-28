/*
 * Title: Token handler
 * Description: token handler, authorization
 * Author: Masud Rana
 * Date: 26/10/2023
 */

const { hash, createRandomString, parseJSON } = require("../helpers/utilities");
const data = require("../lib/data");

// Dependencies

// token handler - module scaffolding
const tokenHandler = {};

// token controller to handle token related api
const tokenController = (req, callback) => {
  const acceptedMethods = ["GET", "POST", "DELETE", "PUT"];
  const requestMethod = req.method.toUpperCase();
  if (acceptedMethods.includes(requestMethod)) {
    // called method based on accepted methods
    tokenHandler[requestMethod](req, callback);
  } else {
    callback(500, { message: "Error in your request method" });
  }
};

// ################### handler for token create
tokenHandler.POST = (req, callback) => {
  const phone =
    typeof req.body.phone === "string" && req.body.phone.trim().length === 11
      ? req.body.phone
      : false;

  const password =
    typeof req.body.password === "string" && req.body.password.trim().length > 0
      ? req.body.password
      : false;

  if (phone && password) {
    data.read("users", phone, (err, userData) => {
      if (err) return callback(404, { message: "User not found" });
      let hashPassword = hash(password);
      if (hashPassword === parseJSON(userData).password) {
        //password same so do something
        let tokenId = createRandomString(20);
        let expires = Date.now() + 60 * 60 * 1000;
        let tokenObject = {
          phone,
          id: tokenId,
          expires,
        };

        // store token to the filesystem
        data.create("tokens", tokenId, tokenObject, (err2) => {
          if (!err2) {
            callback(200, tokenObject);
          } else {
            callback(500, { error: "There was a problem in the server side" });
          }
        });
      } else {
        callback(400, { error: "Password incorrect!" });
      }
    });
  } else {
    callback(400, { error: "You have a problem with your request" });
  }
};

// ###############  handler for get token
tokenHandler.GET = (req, callback) => {
  //check the phone number is valid

  const id =
    typeof req.query.id === "string" && req.query.id.length === 20
      ? req.query.id
      : false;

  if (id) {
    // find the tokens
    data.read("tokens", id, (err, tokenData) => {
      //parse json data and copy it into foundToken
      const foundToken = { ...parseJSON(tokenData) };
      console.log("found token:", foundToken, "and query token:", id);
      if (!err && foundToken) {
        callback(200, foundToken);
      } else {
        callback(404, { message: "Requested Token was not found" });
      }
    });
  } else {
    callback(404, { message: "Requested Token was not found" });
  }
};

// ##############  handler for extend expires time
tokenHandler.PUT = (req, callback) => {
  console.log(req.body);
  //validate id
  const id =
    typeof req.body.id === "string" && req.body.id.length === 20
      ? req.body.id
      : false;

  const extend =
    typeof req.body.extend === "boolean" && req.body.extend === true
      ? req.body.extend
      : false;

  if (id && extend) {
    data.read("tokens", id, (err, tokenData) => {
      let parseTokenData = parseJSON(tokenData);
      if (parseTokenData.expires > Date.now()) {
        parseTokenData.expires = Date.now() * 60 * 60 * 1000;
        // store the updated token
        data.update("tokens", id, parseTokenData, (err2) => {
          if (!err2) {
            callback(200, { message: "Token updated successfull" });
          } else {
            callback(500, {
              error: "Error while updating token expires times",
            });
          }
        });
      } else {
        callback(400, { error: "Token already expires" });
      }
    });
  } else {
    callback(404, { error: "Requested token was not found" });
  }
};

// ############# handler for delete token
tokenHandler.DELETE = (req, callback) => {
  //check the phone number is valid
  const id =
    typeof req.query.id === "string" && req.query.id.length === 20
      ? req.query.id
      : false;

  if (id) {
    // find the token
    data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete("tokens", id, (err2) => {
          if (err2) callback(500, { error: "There was a server side error" });
          else callback(200, { message: "tokenData deleted successfully" });
        });
      } else {
        callback(404, { message: "tokenData not found" });
      }
    });
  } else {
    callback(404, { message: "There was a problem with your id number" });
  }
};

// ############## verify token handler
tokenHandler.verify = (token, phone, callback) => {
  data.read("tokens", token, (err, tokenData) => {
    if (!err && tokenData) {
      if (
        parseJSON(tokenData).phone === phone &&
        parseJSON(tokenData).expires > Date.now()
      ) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

module.exports = {
  tokenController,
  tokenHandler,
};
