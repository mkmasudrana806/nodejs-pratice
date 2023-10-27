/*
 * Title: check controller
 * Description:  handler to handle check defined checks
 * Author: Masud Rana
 * Date: 27/10/2023
 */

// Dependencies
const { hash, parseJSON, createRandomString } = require("../helpers/utilities");
const data = require("../lib/data");
const { tokenHandler } = require("./tokenHandler");
const { maxChecks } = require("../helpers/environment");

// check all api method - module scaffolding
const checkHandler = {};

// check controller to handle check related all api based on request method
const checksController = (req, callback) => {
  const acceptedMethods = ["GET", "POST", "PUT", "DELETE"];
  const requestMethod = req.method.toUpperCase();
  if (acceptedMethods.includes(requestMethod)) {
    // called method based on accepted methods
    checkHandler[requestMethod](req, callback);
  } else {
    callback(500, { message: "falid message for method test" });
  }
};

// ################### handler for check create
checkHandler.POST = (req, callback) => {
  // validate inputs: protocol, method, url, successCodes, timeoutseconds
  let protocol =
    typeof req.body.protocol === "string" &&
    ["http", "https"].includes(req.body.protocol)
      ? req.body.protocol
      : false;

  let url =
    typeof req.body.url === "string" && req.body.url.trim().length > 0
      ? req.body.url
      : false;

  let method =
    typeof req.body.method === "string" &&
    ["get", "put", "delete", "post"].includes(req.body.method)
      ? req.body.method
      : false;

  let successCodes =
    typeof req.body.successCodes === "object" &&
    req.body.successCodes instanceof Array
      ? req.body.successCodes
      : false;

  let timeoutSeconds =
    typeof req.body.timeoutSeconds === "number" &&
    req.body.timeoutSeconds % 1 === 0 &&
    req.body.timeoutSeconds >= 1 &&
    req.body.timeoutSeconds <= 5
      ? req.body.timeoutSeconds
      : false;

  // console.log(typeof req.body.timeoutSeconds);
  // console.log(protocol, url, successCodes, timeoutSeconds);
  if (protocol && url && successCodes && timeoutSeconds) {
    //verify token
    const token =
      typeof req.headers.token === "string" ? req.headers.token : false;

    //find user phone number using token
    data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        let userPhone = parseJSON(tokenData).phone;

        // find the user data using phone number
        data.read("users", userPhone, (err2, userData) => {
          if (!err2 && userData) {
            tokenHandler.verify(token, userPhone, (tokenValidity) => {
              if (tokenValidity) {
                let userObject = parseJSON(userData);
                let userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (userChecks.length < maxChecks) {
                  let checkId = createRandomString(20);
                  let checkObject = {
                    id: checkId,
                    userPhone: userPhone,
                    protocol,
                    url,
                    method,
                    successCodes,
                    timeoutSeconds,
                  };

                  // save the object
                  data.create("checks", checkId, checkObject, (err3) => {
                    if (!err3) {
                      // add checkid to the user object
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);

                      // save the new user data
                      data.update("users", userPhone, userObject, (err4) => {
                        if (!err4) {
                          // return the data about the new check
                          callback(200, checkObject);
                        } else {
                          callback(500, {
                            error: "there was a server side error",
                          });
                        }
                      });
                    } else {
                      callback(500, {
                        error: "There was a problem in the server side",
                      });
                    }
                  });
                } else {
                  callback(401, { error: "User has already exceeded maximum" });
                }
              } else {
                callback(403, { error: "Token is not verified" });
              }
            });
          } else {
            callback(404, { error: "User not found in database" });
          }
        });
      } else {
        callback(403, {
          error: "Authentication Problem. may fake token, check header",
        });
      }
    });
  } else {
    callback(400, { error: "Problem in your request" });
  }
};

// ###############  handler for get check
checkHandler.GET = (req, callback) => {
  // validate the id
  const id =
    typeof req.query.id === "string" && req.query.id.trim().length === 20
      ? req.query.id
      : false;

  if (id) {
    // find the check from file system
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        //verify token
        const token =
          typeof req.headers.token === "string" ? req.headers.token : false;
        tokenHandler.verify(
          token,
          parseJSON(checkData).userPhone,
          (tokenCheck) => {
            if (tokenCheck) {
              callback(200, parseJSON(checkData));
            } else {
              callback(403, { error: "Authentication failed" });
            }
          }
        );
      } else {
        callback(404, { error: "check request not found" });
      }
    });
  } else {
    callback(400, { message: "You have a problem in your request with query" });
  }
};

// ##############  handler for update check
checkHandler.PUT = (req, callback) => {
  // validate the id
  const id =
    typeof req.body.id === "string" && req.body.id.trim().length === 20
      ? req.body.id
      : false;

  // validate inputs: protocol, method, url, successCodes, timeoutseconds
  let protocol =
    typeof req.body.protocol === "string" &&
    ["http", "https"].includes(req.body.protocol)
      ? req.body.protocol
      : false;

  let url =
    typeof req.body.url === "string" && req.body.url.trim().length > 0
      ? req.body.url
      : false;

  let method =
    typeof req.body.method === "string" &&
    ["get", "put", "delete", "post"].includes(req.body.method)
      ? req.body.method
      : false;

  let successCodes =
    typeof req.body.successCodes === "object" &&
    req.body.successCodes instanceof Array
      ? req.body.successCodes
      : false;

  let timeoutSeconds =
    typeof req.body.timeoutSeconds === "number" &&
    req.body.timeoutSeconds % 1 === 0 &&
    req.body.timeoutSeconds >= 1 &&
    req.body.timeoutSeconds <= 5
      ? req.body.timeoutSeconds
      : false;

  if (id) {
    if (protocol || url || method || successCodes || timeoutSeconds) {
      data.read("checks", id, (err1, checkData) => {
        if (!err1 && checkData) {
          let checkObject = parseJSON(checkData);
          //verify token
          const token =
            typeof req.headers.token === "string" ? req.headers.token : false;
          tokenHandler.verify(token, checkObject.userPhone, (tokenCheck) => {
            if (tokenCheck) {
              // set the new updated value to the check object
              if (protocol) {
                checkObject.protocol = protocol;
              }
              if (url) {
                checkObject.url = url;
              }
              if (method) {
                checkObject.successCodes = successCodes;
              }
              if (timeoutSeconds) {
                checkObject.timeoutSeconds = timeoutSeconds;
              }
              // store to the file system
              data.update("checks", id, checkObject, (err2) => {
                if (!err2) {
                  callback(200, { message: "Update check success" });
                } else {
                  callback(500, { error: "there was an error updating " });
                }
              });
            } else {
              callback(403, { error: "Authorization error" });
            }
          });
        } else {
          callback(500, { error: "There was a problem in the server side" });
        }
      });
    } else {
      callback(400, { error: "you must provide one field to update" });
    }
  } else {
    callback(400, { error: "You have a problem in your request" });
  }
};

//TODO: implement authentication
checkHandler.DELETE = (req, callback) => {
  // validate the id
  const id =
    typeof req.query.id === "string" && req.query.id.trim().length === 20
      ? req.query.id
      : false;

  if (id) {
    // find the check from file system
    data.read("checks", id, (err, checkData) => {
      if (!err && checkData) {
        //verify token
        const token =
          typeof req.headers.token === "string" ? req.headers.token : false;
        tokenHandler.verify(
          token,
          parseJSON(checkData).userPhone,
          (tokenCheck) => {
            if (tokenCheck) {
              //delete check data and one property from users
              data.delete("checks", id, (err2) => {
                if (!err2) {
                  // delete checks property from users
                  data.read(
                    "users",
                    parseJSON(checkData).userPhone,
                    (err3, userData) => {
                      let userObject = parseJSON(userData);
                      if (!err3 && userData) {
                        let userChecks =
                          typeof userObject.checks === "object" &&
                          userObject.checks instanceof Array
                            ? userObject.checks
                            : [];
                        // remove the deleted checks from users list of checks
                        let checkPosition = userChecks.indexOf(id);
                        if (checkPosition > -1) {
                          userChecks.splice(checkPosition, 1);
                          // reviceve the user data
                          userObject.checks = userChecks;
                          // now update ther user checks
                          data.update(
                            "users",
                            userObject.phone,
                            userObject,
                            (err4) => {
                              if (!err4) {
                                callback(200, {
                                  message:
                                    "after deleting check, check id inside user is successfully deleted",
                                });
                              } else {
                                callback(500, {
                                  error:
                                    "Error while updating user checks array",
                                });
                              }
                            }
                          );
                        } else {
                          callback(500, {
                            error:
                              "Your checking id is not found inside user data",
                          });
                        }
                      } else {
                        callback(500, {
                          error:
                            "there was a problem in the server to find user data",
                        });
                      }
                    }
                  );
                } else {
                  callback(500, {
                    error: "there was server side error to delete",
                  });
                }
              });
            } else {
              callback(403, { error: "Authentication failed" });
            }
          }
        );
      } else {
        callback(404, { error: "check request not found" });
      }
    });
  } else {
    callback(400, { message: "You have a problem in your request with query" });
  }
};

// export the checksController
module.exports = {
  checksController,
};
