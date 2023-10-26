/*
 * Title: Routes handler
 * Description: call controller methods based on route
 * Author: Masud Rana
 * Date: 24/10/2023
 */

// Dependencies
const { sample, about } = require("../controller/sampleController");
const {  usersController } = require("../controller/userController");

// routes handling - module scaffolding
const routes = {
  sample: sample,
  user: usersController,
};

// export routes
module.exports = routes;
