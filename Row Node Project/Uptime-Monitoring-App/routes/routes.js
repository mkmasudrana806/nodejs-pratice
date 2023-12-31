/*
 * Title: Routes handler
 * Description: call controller methods based on route
 * Author: Masud Rana
 * Date: 24/10/2023
 */

// Dependencies
const { checksController } = require("../controller/checkController");
const { sample, about } = require("../controller/sampleController");
const { tokenController } = require("../controller/tokenHandler");
const { usersController } = require("../controller/userController");

// routes handling - module scaffolding
const routes = {
  sample: sample,
  user: usersController,
  token: tokenController,
  check: checksController
};

// export routes
module.exports = routes;
