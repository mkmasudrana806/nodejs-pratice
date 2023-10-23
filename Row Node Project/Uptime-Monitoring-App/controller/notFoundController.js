/*
 * Title: Handle unknwon route
 * Description: Response for unknwon route with not found message
 * Author: Masud Rana
 * Date: 24/10/2023
 */

// controller for not found route
const notFound = (req, callback) => {
  console.log(req);
  callback(404, { message: "Your requested route not found!" });
};

module.exports = notFound;
