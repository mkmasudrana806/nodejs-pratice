/*
 * Title: sample controller
 * Description: handle all the route function
 * Author: Masud Rana
 * Date: 24/10/2023
 */

// controller - module scaffolding
// we can use controller object and add each controller as property.
// here i am using simple controller function and export them directly
//const controller = {};

// controller for sample api call
const sample = (req, callback) => {
  // do something
  console.log(req);

  // reutrn something with callback
  callback(200, { message: "success message for sample test" });
};

// about controller
const about = (req, callback) => {
  // do something
  console.log(req);

  // reutrn something with callback
  callback(200, { message: "success message for about test" });
};

module.exports = {
  sample,
  about,
};
