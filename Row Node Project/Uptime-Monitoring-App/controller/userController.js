/*
 * Title: users controller
 * Description: handle user related all api based on request method
 * Author: Masud Rana
 * Date: 24/10/2023
 */

// Dependencies
const { hash, parseJSON } = require("../helpers/utilities");
const data = require("../lib/data");

// user all api method - module scaffolding
const userHandler = {};

// user controller to handle user related all api based on request method
const usersController = (req, callback) => {
  const acceptedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
  const requestMethod = req.method.toUpperCase();
  if (acceptedMethods.includes(requestMethod)) {
    // called method based on accepted methods
    userHandler[requestMethod](req, callback);
  } else {
    callback(500, { message: "falid message for method test" });
  }
};

// ################### handler for user create
userHandler.POST = (req, callback) => {
  const firstName =
    typeof req.body.firstName === "string" &&
    req.body.firstName.trim().length > 0
      ? req.body.firstName
      : false;

  const lastName =
    typeof req.body.lastName === "string" && req.body.lastName.trim().length > 0
      ? req.body.lastName
      : false;

  const phone =
    typeof req.body.phone === "string" && req.body.phone.trim().length === 11
      ? req.body.phone
      : false;

  const password =
    typeof req.body.password === "string" && req.body.password.trim().length > 0
      ? req.body.password
      : false;

  // terms, services and agreement
  const tosAgreement =
    typeof req.body.tosAgreement === "boolean" ? req.body.tosAgreement : false;

  //if all validation done then do something
  if (firstName && lastName && phone && password && tosAgreement) {
    //before creating new user. make sure use doesn't exist
    data.read("users", phone, (err) => {
      if (err) {
        //while reading user is not found,then create new user
        let user = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };
        //store user to file system
        data.create("users", phone, user, (err1) => {
          if (err1) {
            callback(500, { error: "Could not create user" });
          } else {
            callback(200, { message: "User created successfully" });
          }
        });
      } else {
        // user already exists, return message
        callback(500, { error: "User already exists in server" });
      }
    });
  } else {
    callback(400, { error: "You have a problem in your request with data" });
  }
};

//TODO: implement authentication
// ###############  handler for get user
userHandler.GET = (req, callback) => {
  //check the phone number is valid
  const phone =
    typeof req.query.phone === "string" && req.query.phone.trim().length === 11
      ? req.body.phone
      : false;

  if (phone) {
    // find the user
    data.read("users", phone, (err, user) => {
      //parse json data and copy it into foundUser
      const foundUser = { ...parseJSON(user) };
      if (!err && user) {
        delete foundUser.password; //don't pass the password
        callback(200, foundUser);
      } else {
        callback(404, { message: "User not found" });
      }
    });
  } else {
    callback(404, { message: "User not found" });
  }
};

//TODO: implement authentication
// ##############  handler for update user
userHandler.PUT = (req, callback) => {
  // validation phone, firstName, lastName and password
  const phone =
    typeof req.body.phone === "string" && req.body.phone.trim().length === 11
      ? req.body.phone
      : false;

  const firstName =
    typeof req.body.firstName === "string" &&
    req.body.firstName.trim().length > 0
      ? req.body.firstName
      : false;

  const lastName =
    typeof req.body.lastName === "string" && req.body.lastName.trim().length > 0
      ? req.body.lastName
      : false;

  const password =
    typeof req.body.password === "string" && req.body.password.trim().length > 0
      ? req.body.password
      : false;

  //when phone is invalid, return error message
  if (!phone) return callback(400, { error: "Invalid phone number" });
  // validate other properties
  if (firstName || lastName || password) {
    data.read("users", phone, (err, userData) => {
      const user = { ...parseJSON(userData) };
      if (!err && user) {
        //update the user object
        if (firstName) {
          user.firstName = firstName;
        }
        if (lastName) {
          user.lastName = lastName;
        }
        if (password) {
          user.password = hash(password);
        }

        // store to the filesystem
        data.update("users", phone, user, (err2) => {
          if (!err2) callback(200, { message: "Your updated successfully" });
          else
            callback(500, { error: "there was a problem in the server side" });
        });
      } else {
        callback(404, { message: "User not found" });
      }
    });
  } else {
    callback(400, { error: "Your have a problem in your request" });
  }
};

//TODO: implement authentication
// ############# handler for delete user
userHandler.DELETE = (req, callback) => {
  //check the phone number is valid
  const phone =
    typeof req.query.phone === "string" && req.query.phone.trim().length === 11
      ? req.body.phone
      : false;

  if (phone) {
    // find the user
    data.read("users", phone, (err, user) => {
      if (!err && user) {
        data.delete("users", phone, (err2) => {
          if (err2) callback(500, { error: "There was a server side error" });
          else callback(200, { message: "User deleted successfully" });
        });
      } else {
        callback(404, { message: "User not found" });
      }
    });
  } else {
    callback(404, { message: "There was a problem with your phone number" });
  }
};
module.exports = {
  usersController,
};
